-- Migration: Split contact_phone into contact_country_code and contact_phone
-- Date: 2026-05-07

-- 1. Add the new column
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS contact_country_code TEXT DEFAULT '+34' NOT NULL;

-- 2. Update existing data where the phone number starts with '+34 '
UPDATE public.entities
SET 
  contact_country_code = '+34',
  contact_phone = TRIM(SUBSTRING(contact_phone FROM 5))
WHERE contact_phone LIKE '+34 %';

-- 3. Update existing data where the phone number starts with '+34' without space
UPDATE public.entities
SET 
  contact_country_code = '+34',
  contact_phone = TRIM(SUBSTRING(contact_phone FROM 4))
WHERE contact_phone LIKE '+34%' AND contact_phone NOT LIKE '+34 %';
