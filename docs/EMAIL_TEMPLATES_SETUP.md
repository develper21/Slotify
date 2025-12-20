# Email Templates Setup Guide

## Overview

This guide explains how to configure premium email templates for Slotify's authentication system in Supabase.

## Email Templates Included

1. **Confirm Signup** - Email verification with OTP code
2. **Magic Link** - Passwordless login
3. **Reset Password** - Password reset flow
4. **Invite User** - Organizer/admin invitations

## Setup Instructions

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Select your Slotify project
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Each Template

#### Template 1: Confirm Signup (Email Verification)

**Subject:**
```
Verify your email for Slotify
```

**Body:**
- Copy the HTML from `supabase/migrations/003_email_templates.sql` (Confirm Signup section)
- Paste into the "Message (Body)" field
- Click **Save**

**Features:**
- Displays OTP code prominently
- Includes verification button
- Matches Slotify branding (blue-purple gradient)
- Responsive design

#### Template 2: Magic Link

**Subject:**
```
Your Slotify login link
```

**Body:**
- Copy the Magic Link HTML from the migration file
- Paste and save

**Features:**
- One-click login button
- Security notice
- 1-hour expiration notice

#### Template 3: Reset Password

**Subject:**
```
Reset your Slotify password
```

**Body:**
- Copy the Reset Password HTML
- Paste and save

**Features:**
- Clear reset button
- Security warning box
- Expiration notice

#### Template 4: Invite User

**Subject:**
```
You've been invited to Slotify
```

**Body:**
- Copy the Invite User HTML
- Paste and save

**Features:**
- Welcome message
- Accept invitation button
- 7-day expiration

### Step 3: Configure SMTP Settings (Optional)

For custom domain emails:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enter your SMTP credentials:
   - Host: `smtp.your-provider.com`
   - Port: `587` (or `465` for SSL)
   - Username: Your SMTP username
   - Password: Your SMTP password
   - Sender name: `Slotify`
   - Sender email: `noreply@yourdomain.com`
4. Click **Save**
5. Send a test email

### Step 4: Test Email Templates

1. Create a test account in your app
2. Verify you receive the email
3. Check that:
   - Branding matches (gradient, colors)
   - OTP code displays correctly
   - Links work properly
   - Email is responsive on mobile

## Email Template Variables

Supabase provides these variables for use in templates:

- `{{ .Token }}` - OTP verification code
- `{{ .ConfirmationURL }}` - Verification/reset link
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your application URL

## Design Features

All templates include:

✅ **Branding**
- Slotify logo and name
- Blue-purple gradient header
- Consistent color scheme

✅ **Responsive Design**
- Mobile-friendly layout
- Readable on all devices

✅ **Professional Styling**
- Clean typography (Inter font)
- Proper spacing and padding
- Rounded corners and shadows

✅ **Security**
- Expiration notices
- Warning messages
- Clear call-to-action buttons

## Troubleshooting

### Emails not sending?

1. Check Supabase email quota (free tier: 3 emails/hour)
2. Verify SMTP settings if using custom domain
3. Check spam folder
4. Review Supabase logs: **Project Settings** → **Logs**

### Styling issues?

1. Ensure HTML is properly formatted
2. Test in different email clients
3. Use inline CSS (already included)

### Variables not working?

1. Verify variable syntax: `{{ .VariableName }}`
2. Check Supabase documentation for available variables

## Production Checklist

Before going live:

- [ ] All 4 templates configured
- [ ] SMTP settings configured (if using custom domain)
- [ ] Test emails sent and received
- [ ] Templates tested on mobile devices
- [ ] Sender email verified
- [ ] Email quota sufficient for expected traffic

## Additional Resources

- [Supabase Auth Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email Template Best Practices](https://supabase.com/docs/guides/auth/auth-email-templates#best-practices)

---

**Note:** The email templates are stored in `supabase/migrations/003_email_templates.sql` for reference. They must be manually configured in the Supabase Dashboard as Supabase doesn't support email template migrations via SQL.
