-- Migration: Push Notifications Infrastructure
-- Description: Creates tables and functions for web push notifications

-- 1. Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    device_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, endpoint)
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active) WHERE is_active = true;

-- 3. Enable Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can view their own subscriptions"
    ON push_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
    ON push_subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON push_subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions"
    ON push_subscriptions
    FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Function to clean expired subscriptions
CREATE OR REPLACE FUNCTION clean_expired_push_subscriptions()
RETURNS void AS $$
BEGIN
    -- Delete subscriptions not used in 90 days
    DELETE FROM push_subscriptions
    WHERE last_used_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create notifications log table (optional, for debugging)
CREATE TABLE IF NOT EXISTS push_notifications_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success BOOLEAN DEFAULT false,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_push_log_user_id ON push_notifications_log(user_id);
CREATE INDEX IF NOT EXISTS idx_push_log_sent_at ON push_notifications_log(sent_at DESC);

-- 7. Function to log notifications (for analytics)
CREATE OR REPLACE FUNCTION log_push_notification(
    p_user_id UUID,
    p_type TEXT,
    p_payload JSONB,
    p_success BOOLEAN,
    p_error TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO push_notifications_log (user_id, notification_type, payload, success, error_message)
    VALUES (p_user_id, p_type, p_payload, p_success, p_error)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON push_subscriptions TO authenticated;
GRANT SELECT ON push_notifications_log TO authenticated;

COMMENT ON TABLE push_subscriptions IS 'Stores web push notification subscriptions for users';
COMMENT ON TABLE push_notifications_log IS 'Logs all push notifications sent for analytics and debugging';
