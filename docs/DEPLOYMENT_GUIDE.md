# Slotify - Deployment Guide

## 🚀 Complete Deployment Guide

This guide will help you deploy Slotify to production.

---

## Prerequisites

Before deploying, ensure you have:
- [ ] Supabase account
- [ ] Vercel account (or other hosting platform)
- [ ] Domain name (optional)
- [ ] Email service configured (Supabase handles auth emails)

---

## 1. Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `slotify-production`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users
4. Wait for project creation (~2 minutes)

### 1.2 Run Database Migrations
1. Go to SQL Editor in Supabase dashboard
2. Run migrations in order:
   ```sql
   -- Copy and paste content from:
   supabase/migrations/001_initial_schema.sql
   ```
3. Run RLS policies:
   ```sql
   -- Copy and paste content from:
   supabase/migrations/002_rls_policies.sql
   ```
4. Verify tables created (14 tables should exist)

### 1.3 Configure Email Templates
1. Go to Authentication → Email Templates
2. For each template (Confirm Signup, Magic Link, Reset Password, Invite User):
   - Copy HTML from `supabase/migrations/003_email_templates.sql`
   - Paste into template editor
   - Save
3. See `docs/EMAIL_TEMPLATES_SETUP.md` for detailed instructions

### 1.4 Get API Keys
1. Go to Project Settings → API
2. Copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - `anon` public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `service_role` key (`SUPABASE_SERVICE_ROLE_KEY`) - **Keep secret!**

---

## 2. Environment Variables Setup

### 2.1 Create `.env.local`
Create `.env.local` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional - Supabase handles auth emails)
RESEND_API_KEY=your_resend_api_key

# Payment (Optional - for future implementation)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 2.2 Production Environment Variables
For production (Vercel):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 3. Local Testing

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Run Development Server
```bash
npm run dev
```

### 3.3 Test All Features
Follow `docs/TESTING_GUIDE.md` to test:
- [ ] Authentication (signup, login, forgot password)
- [ ] Customer booking flow
- [ ] Organizer dashboard
- [ ] Admin panel
- [ ] Email notifications

---

## 4. Production Build

### 4.1 Build Project
```bash
npm run build
```

### 4.2 Test Production Build Locally
```bash
npm start
```

### 4.3 Verify Build
- [ ] No build errors
- [ ] All pages load
- [ ] No console errors
- [ ] Images load correctly

---

## 5. Deploy to Vercel

### 5.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Select framework: Next.js

### 5.2 Configure Project
1. **Build Command**: `npm run build`
2. **Output Directory**: `.next`
3. **Install Command**: `npm install`

### 5.3 Add Environment Variables
In Vercel project settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
```

### 5.4 Deploy
1. Click "Deploy"
2. Wait for deployment (~2-3 minutes)
3. Visit your app URL

---

## 6. Post-Deployment Setup

### 6.1 Create Admin User
1. Sign up through the app
2. Go to Supabase → Table Editor → `users`
3. Find your user
4. Change `role` to `admin`
5. Save

### 6.2 Create Test Organizer
1. Create another account
2. Change role to `organizer`
3. Go to `organizers` table
4. Insert record:
   ```sql
   INSERT INTO organizers (user_id, approved)
   VALUES ('user_id_here', true);
   ```

### 6.3 Create Test Appointment
1. Login as organizer
2. Create appointment
3. Set schedule
4. Add questions
5. Publish

### 6.4 Test Booking Flow
1. Logout
2. Login as customer (or browse as guest)
3. Book the test appointment
4. Verify email sent
5. Check booking in profile

---

## 7. Custom Domain (Optional)

### 7.1 Add Domain in Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### 7.2 Update Environment Variables
```bash
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
```

### 7.3 Update Supabase Redirect URLs
1. Go to Supabase → Authentication → URL Configuration
2. Add your domain to:
   - Site URL
   - Redirect URLs

---

## 8. Monitoring & Maintenance

### 8.1 Set Up Monitoring
- **Vercel Analytics**: Enable in project settings
- **Supabase Logs**: Monitor database queries
- **Error Tracking**: Consider Sentry integration

### 8.2 Database Backups
- Supabase automatically backs up database
- Enable Point-in-Time Recovery (PITR) for production

### 8.3 Regular Maintenance
- [ ] Monitor error logs weekly
- [ ] Check database performance
- [ ] Update dependencies monthly
- [ ] Review security policies

---

## 9. Scaling Considerations

### 9.1 Database
- Supabase Free tier: Good for MVP
- Upgrade to Pro for:
  - More database space
  - Better performance
  - Priority support

### 9.2 Vercel
- Free tier: Good for testing
- Pro tier for:
  - Custom domains
  - Better performance
  - Team collaboration

### 9.3 Email Service
- Supabase handles auth emails
- For booking emails, integrate:
  - Resend
  - SendGrid
  - AWS SES

---

## 10. Security Checklist

Before going live:
- [ ] All RLS policies enabled
- [ ] Service role key kept secret
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] No sensitive data in client code
- [ ] Rate limiting configured (Supabase)
- [ ] CORS configured properly

---

## 11. Performance Optimization

### 11.1 Images
- Use Next.js Image component (already implemented)
- Configure Supabase Storage for uploads
- Enable CDN caching

### 11.2 Database
- Indexes already created
- Monitor slow queries
- Use connection pooling

### 11.3 Caching
- Enable Vercel Edge Caching
- Use `revalidatePath` for dynamic data
- Implement ISR where appropriate

---

## 12. Troubleshooting

### Common Issues

**Build Fails**
- Check TypeScript errors
- Verify all dependencies installed
- Check environment variables

**Database Connection Fails**
- Verify Supabase URL correct
- Check API keys
- Ensure RLS policies allow access

**Authentication Not Working**
- Check redirect URLs in Supabase
- Verify email templates configured
- Check SMTP settings

**Emails Not Sending**
- Verify Supabase email settings
- Check spam folder
- Review email templates

---

## 13. Deployment Checklist

### Pre-Deployment
- [ ] All features tested locally
- [ ] Database migrations run
- [ ] Email templates configured
- [ ] Environment variables set
- [ ] Production build successful
- [ ] No console errors

### Deployment
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Custom domain configured (if applicable)
- [ ] First deployment successful

### Post-Deployment
- [ ] Admin user created
- [ ] Test organizer created
- [ ] Test appointment created
- [ ] Test booking completed
- [ ] Emails sending correctly
- [ ] All roles working
- [ ] Mobile responsive verified

---

## 14. Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs

### Community
- Next.js Discord
- Supabase Discord
- Stack Overflow

---

## 🎉 Congratulations!

Your Slotify appointment booking system is now live!

**Next Steps**:
1. Share with beta users
2. Gather feedback
3. Iterate and improve
4. Scale as needed

---

**Deployment Guide Version**: 1.0
**Last Updated**: December 20, 2024
**Status**: Production Ready
