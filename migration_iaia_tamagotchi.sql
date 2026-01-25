-- Migration: IAIA Role-Play Settings (Tamagotchi Rural)
-- Description: Adds flexible settings for the IAIA interaction game

BEGIN;

-- 1. Add iaia_settings column to profiles
-- Using JSONB to allow for flexible scheduling and avatar choices
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS iaia_settings JSONB DEFAULT '{
    "enabled": false,
    "avatar_id": null,
    "schedule": {
        "days": [1, 2, 3, 4, 5, 6, 7],
        "morning_alert": "08:00",
        "night_alert": "22:00"
    },
    "roleplay_level": 1,
    "last_interaction": null
}'::jsonb;

-- 2. Index for performance (optional but good for future autonomous triggers)
CREATE INDEX IF NOT EXISTS idx_profiles_iaia_enabled ON profiles((iaia_settings->>'enabled')) WHERE (iaia_settings->>'enabled' = 'true');

COMMIT;
