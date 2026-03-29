CREATE OR REPLACE FUNCTION enforce_rate_limit(
  p_user_id TEXT,
  p_max_requests INTEGER
)
RETURNS TABLE (
  limited BOOLEAN,
  max_requests INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  now_time TIMESTAMP WITH TIME ZONE := NOW();
  one_hour_ago TIMESTAMP WITH TIME ZONE := now_time - INTERVAL '1 hour';
  current_count INTEGER;
  current_reset TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Atomic read
  SELECT request_count, last_reset 
  INTO current_count, current_reset
  FROM api_rate_limits 
  WHERE user_id = p_user_id;

  IF current_reset IS NULL OR current_reset < one_hour_ago THEN
    -- Reset + insert/upsert
    INSERT INTO api_rate_limits (user_id, request_count, last_reset)
    VALUES (p_user_id, 1, now_time)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      request_count = 1,
      last_reset = now_time;

    RETURN QUERY SELECT FALSE, p_max_requests;
  ELSE
    IF current_count >= p_max_requests THEN
      RETURN QUERY SELECT TRUE, p_max_requests;
    ELSE
      -- Increment atomic
      UPDATE api_rate_limits 
      SET request_count = current_count + 1
      WHERE user_id = p_user_id;

      RETURN QUERY SELECT FALSE, p_max_requests;
    END IF;
  END IF;
END;
$$;
