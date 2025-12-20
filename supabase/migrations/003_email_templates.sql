-- =====================================================
-- SUPABASE EMAIL TEMPLATES CONFIGURATION
-- =====================================================

-- This file contains the email template configurations for Supabase Auth
-- These should be configured in your Supabase Dashboard under:
-- Authentication > Email Templates

-- =====================================================
-- 1. CONFIRM SIGNUP (Email Verification)
-- =====================================================

-- Subject: Verify your email for Slotify

-- Body (HTML):
/*
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .otp-code {
      background: #f0f4ff;
      border: 2px solid #0066ff;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-code .code {
      font-size: 36px;
      font-weight: 700;
      color: #0066ff;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Slotify</h1>
    </div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for signing up for Slotify! To complete your registration, please verify your email address.</p>
      
      <div class="otp-code">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your verification code:</p>
        <div class="code">{{ .Token }}</div>
      </div>
      
      <p>This code will expire in 24 hours.</p>
      
      <p>Or click the button below to verify automatically:</p>
      <a href="{{ .ConfirmationURL }}" class="button">Verify Email Address</a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #999;">
        If you didn't create an account with Slotify, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Slotify. All rights reserved.</p>
      <p>Smart Appointment Booking System</p>
    </div>
  </div>
</body>
</html>
*/

-- =====================================================
-- 2. MAGIC LINK (Alternative to OTP)
-- =====================================================

-- Subject: Your Slotify login link

-- Body (HTML):
/*
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Slotify</h1>
    </div>
    <div class="content">
      <h2>Login to Your Account</h2>
      <p>Click the button below to securely log in to your Slotify account:</p>
      
      <a href="{{ .ConfirmationURL }}" class="button">Login to Slotify</a>
      
      <p style="margin-top: 30px;">This link will expire in 1 hour.</p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #999;">
        If you didn't request this login link, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Slotify. All rights reserved.</p>
      <p>Smart Appointment Booking System</p>
    </div>
  </div>
</body>
</html>
*/

-- =====================================================
-- 3. RESET PASSWORD
-- =====================================================

-- Subject: Reset your Slotify password

-- Body (HTML):
/*
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Slotify</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password for your Slotify account.</p>
      
      <p>Click the button below to create a new password:</p>
      <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      
      <p style="margin-top: 30px;">This link will expire in 1 hour.</p>
      
      <div class="warning">
        <p style="margin: 0; color: #856404; font-weight: 600;">⚠️ Security Notice</p>
        <p style="margin: 8px 0 0 0; color: #856404;">
          If you didn't request a password reset, please ignore this email and ensure your account is secure.
        </p>
      </div>
    </div>
    <div class="footer">
      <p>© 2024 Slotify. All rights reserved.</p>
      <p>Smart Appointment Booking System</p>
    </div>
  </div>
</body>
</html>
*/

-- =====================================================
-- 4. INVITE USER (For organizers/admins)
-- =====================================================

-- Subject: You've been invited to Slotify

-- Body (HTML):
/*
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%));
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #999;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Slotify</h1>
    </div>
    <div class="content">
      <h2>Welcome to Slotify!</h2>
      <p>You've been invited to join Slotify, the smart appointment booking system.</p>
      
      <p>Click the button below to accept your invitation and set up your account:</p>
      <a href="{{ .ConfirmationURL }}" class="button">Accept Invitation</a>
      
      <p style="margin-top: 30px;">This invitation will expire in 7 days.</p>
    </div>
    <div class="footer">
      <p>© 2024 Slotify. All rights reserved.</p>
      <p>Smart Appointment Booking System</p>
    </div>
  </div>
</body>
</html>
*/

-- =====================================================
-- CONFIGURATION INSTRUCTIONS
-- =====================================================

/*
To configure these email templates in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to: Authentication > Email Templates
3. For each template type (Confirm signup, Magic Link, Reset Password, Invite User):
   - Copy the HTML content above
   - Paste into the "Message (Body)" field
   - Update the subject line
   - Save changes

4. Configure SMTP settings (optional, for custom domain):
   - Go to: Project Settings > Auth
   - Scroll to "SMTP Settings"
   - Enter your SMTP credentials
   - Test the connection

5. Customize sender details:
   - Sender name: "Slotify"
   - Sender email: "noreply@yourdomain.com"

Note: Supabase provides default email templates, but these custom templates
match your application's branding and design system.
*/
