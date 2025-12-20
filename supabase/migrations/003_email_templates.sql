-- =====================================================
-- SUPABASE EMAIL TEMPLATES CONFIGURATION
-- Override default 8-digit OTP with custom templates
-- =====================================================

-- Note: Supabase's built-in OTP is 8 digits and cannot be changed via SQL
-- You need to either:
-- 1. Use custom OTP system (recommended - see 004_otp_system.sql)
-- 2. Configure in Supabase Dashboard > Authentication > Email Templates

-- For Dashboard configuration:
-- 1. Go to: https://app.supabase.com/project/YOUR_PROJECT/auth/templates
-- 2. Select "Magic Link" template
-- 3. Customize the email template
-- 4. Note: OTP length is controlled by Supabase and cannot be changed to 6 digits

-- =====================================================
-- RECOMMENDED: Use Custom OTP System Instead
-- =====================================================

-- This is why we created the custom OTP system in 004_otp_system.sql
-- It gives you full control over:
-- - OTP length (6 digits)
-- - Expiry time
-- - Email templates
-- - Verification logic

-- To use custom OTP system:
-- 1. Run migration: 004_otp_system.sql
-- 2. Use lib/otp.ts functions instead of Supabase auth OTP
-- 3. Send emails via your own email service (Resend, SendGrid, etc.)

-- Example workflow:
-- Instead of: supabase.auth.signInWithOtp({ email })
-- Use: createOTP(email, 'login') + sendOTPEmail(email, otp, 'login')
