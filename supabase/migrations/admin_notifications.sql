-- Migration: admin_notifications.sql

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Recepient
    type TEXT NOT NULL, -- 'signup', 'system', 'like', etc.
    content TEXT NOT NULL,
    meta JSONB DEFAULT '{}', -- Extra data like source_user_id
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Push Subscriptions Table (if not exists)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    device_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, endpoint)
);

-- 3. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Notifications: Users can view their own
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Push Subscriptions: Users can insert/view their own
CREATE POLICY "Users can manage own subscriptions" ON public.push_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- 5. Function to Notify Admins on New User (Optional Database Trigger approach)
-- Note: We will use Frontend Trigger for simplicity in this iteration, 
-- but this function is prepared for future automation.

-- 6. Grant Access
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.notifications TO service_role;
GRANT ALL ON public.push_subscriptions TO service_role;
