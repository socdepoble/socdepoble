-- Migration: Add Privacy Settings to Profiles
-- Description: Adds a JSONB column to store user privacy preferences (e.g., read receipts).

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'privacy_settings') THEN 
        ALTER TABLE public.profiles ADD COLUMN privacy_settings JSONB DEFAULT '{"show_read_receipts": true}'; 
    END IF; 
END $$;

-- Update existing profiles to have default value if null
UPDATE public.profiles SET privacy_settings = '{"show_read_receipts": true}' WHERE privacy_settings IS NULL;
