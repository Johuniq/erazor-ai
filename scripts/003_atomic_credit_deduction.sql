-- Atomic credit deduction function to prevent race conditions
CREATE OR REPLACE FUNCTION deduct_credit(p_user_id UUID, p_amount INTEGER)
RETURNS TABLE(credits INTEGER, success BOOLEAN) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_credits INTEGER;
  v_success BOOLEAN;
BEGIN
  -- Attempt to deduct credits atomically
  UPDATE profiles 
  SET credits = profiles.credits - p_amount,
      updated_at = NOW()
  WHERE id = p_user_id 
    AND profiles.credits >= p_amount
  RETURNING profiles.credits INTO v_credits;
  
  -- Check if update was successful
  IF FOUND THEN
    v_success := TRUE;
    credits := v_credits;
    success := v_success;
    RETURN NEXT;
  ELSE
    -- Get current credits if deduction failed
    SELECT profiles.credits INTO v_credits 
    FROM profiles 
    WHERE id = p_user_id;
    
    v_success := FALSE;
    credits := COALESCE(v_credits, 0);
    success := v_success;
    RETURN NEXT;
  END IF;
END;
$$;

-- Atomic credit deduction for anonymous users
CREATE OR REPLACE FUNCTION deduct_anon_credit(p_anon_user_id UUID, p_amount INTEGER)
RETURNS TABLE(credits INTEGER, success BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_credits INTEGER;
  v_success BOOLEAN;
BEGIN
  -- Attempt to deduct credits atomically
  UPDATE anon_users 
  SET credits = anon_users.credits - p_amount,
      updated_at = NOW()
  WHERE id = p_anon_user_id 
    AND anon_users.credits >= p_amount
  RETURNING anon_users.credits INTO v_credits;
  
  -- Check if update was successful
  IF FOUND THEN
    v_success := TRUE;
    credits := v_credits;
    success := v_success;
    RETURN NEXT;
  ELSE
    -- Get current credits if deduction failed
    SELECT anon_users.credits INTO v_credits 
    FROM anon_users 
    WHERE id = p_anon_user_id;
    
    v_success := FALSE;
    credits := COALESCE(v_credits, 0);
    success := v_success;
    RETURN NEXT;
  END IF;
END;
$$;
