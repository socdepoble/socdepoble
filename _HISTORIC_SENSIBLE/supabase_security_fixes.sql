
-- Fix for Warning 1: API exposure of Materialized View
-- Revokes API ability to query the view directly.
REVOKE ALL ON public.entity_member_map FROM anon, authenticated;

-- Fix for Warning 2: Overly permissive RLS on invoices
-- Drop existing policies that might be "always true" for sensitive actions
DROP POLICY IF EXISTS "Enable read access for all users" ON public.invoices;
DROP POLICY IF EXISTS "Public invoices are viewable by everyone." ON public.invoices;
DROP POLICY IF EXISTS "Allow all" ON public.invoices;

-- Assuming standard structure (like author_id or user_id), create safe policies:
-- Only allow people to see their own invoices (or those linked to them)
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR auth.uid() IN (
    SELECT user_id FROM public.entity_member_map WHERE entity_id = invoices.entity_id
  )
);

-- Force RLS on if it wasn't
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
