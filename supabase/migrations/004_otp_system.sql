-- =====================================================
-- 6-DIGIT OTP SYSTEM
-- Custom OTP verification with 6-digit codes
-- =====================================================

-- Create function to generate 6-digit OTP
CREATE OR REPLACE FUNCTION generate_6_digit_otp()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create OTP table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('signup', 'login', 'password_reset')),
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_otp_email ON public.otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON public.otp_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_purpose ON public.otp_verifications(purpose);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert OTP (for registration)
CREATE POLICY "Anyone can create OTP"
ON public.otp_verifications FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can verify their own OTP
CREATE POLICY "Anyone can verify OTP"
ON public.otp_verifications FOR SELECT
USING (true);

-- Policy: System can update OTP
CREATE POLICY "System can update OTP"
ON public.otp_verifications FOR UPDATE
USING (true);

-- Function to create OTP
CREATE OR REPLACE FUNCTION create_otp(
  p_email TEXT,
  p_purpose TEXT,
  p_expiry_minutes INTEGER DEFAULT 10
)
RETURNS TEXT AS $$
DECLARE
  v_otp TEXT;
BEGIN
  -- Generate 6-digit OTP
  v_otp := generate_6_digit_otp();
  
  -- Delete old unverified OTPs for this email and purpose
  DELETE FROM public.otp_verifications
  WHERE email = p_email 
    AND purpose = p_purpose
    AND verified = FALSE;
  
  -- Insert new OTP
  INSERT INTO public.otp_verifications (email, otp, purpose, expires_at)
  VALUES (
    p_email,
    v_otp,
    p_purpose,
    NOW() + (p_expiry_minutes || ' minutes')::INTERVAL
  );
  
  RETURN v_otp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION verify_otp(
  p_email TEXT,
  p_otp TEXT,
  p_purpose TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_record RECORD;
  v_result JSONB;
BEGIN
  -- Get OTP record
  SELECT * INTO v_record
  FROM public.otp_verifications
  WHERE email = p_email
    AND purpose = p_purpose
    AND verified = FALSE
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Check if OTP exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'OTP not found'
    );
  END IF;
  
  -- Check if expired
  IF v_record.expires_at < NOW() THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'OTP expired'
    );
  END IF;
  
  -- Check attempts (max 5)
  IF v_record.attempts >= 5 THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Too many attempts'
    );
  END IF;
  
  -- Increment attempts
  UPDATE public.otp_verifications
  SET attempts = attempts + 1
  WHERE id = v_record.id;
  
  -- Check if OTP matches
  IF v_record.otp != p_otp THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid OTP',
      'attemptsRemaining', 5 - v_record.attempts - 1
    );
  END IF;
  
  -- Mark as verified
  UPDATE public.otp_verifications
  SET verified = TRUE
  WHERE id = v_record.id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'message', 'OTP verified successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS INTEGER AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.otp_verifications
  WHERE expires_at < NOW() - INTERVAL '1 day'
  OR (verified = TRUE AND created_at < NOW() - INTERVAL '7 days');
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-otps', '0 2 * * *', 'SELECT cleanup_expired_otps()');
