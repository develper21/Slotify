# Slotify - Complete Testing Guide

## 📋 Testing Checklist

This document provides comprehensive testing procedures for all Slotify features.

---

## 1. Authentication Testing

### 1.1 Signup Flow
**Steps**:
1. Navigate to `/signup`
2. Fill in all fields (name, email, password, confirm password)
3. Click "Sign Up"
4. Verify redirect to `/verify-email`
5. Check email for OTP
6. Enter OTP and verify
7. Verify redirect to appropriate dashboard based on role

**Expected Results**:
- ✅ Form validation works (email format, password match)
- ✅ User created in database
- ✅ Email sent with OTP
- ✅ OTP verification successful
- ✅ User redirected correctly

**Test Cases**:
- [ ] Valid signup
- [ ] Invalid email format
- [ ] Password mismatch
- [ ] Duplicate email
- [ ] Empty fields

---

### 1.2 Login Flow
**Steps**:
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"
4. Verify redirect to dashboard

**Expected Results**:
- ✅ Successful login with valid credentials
- ✅ Error message for invalid credentials
- ✅ Role-based redirect (customer → `/`, organizer → `/dashboard`, admin → `/admin`)

**Test Cases**:
- [ ] Valid customer login
- [ ] Valid organizer login
- [ ] Valid admin login
- [ ] Invalid credentials
- [ ] Empty fields

---

### 1.3 Forgot Password Flow
**Steps**:
1. Navigate to `/forgot-password`
2. Enter email
3. Click "Send Reset Link"
4. Check email for reset link
5. Click link and enter new password
6. Verify login with new password

**Expected Results**:
- ✅ Reset email sent
- ✅ Password updated successfully
- ✅ Can login with new password

**Test Cases**:
- [ ] Valid email
- [ ] Invalid/non-existent email
- [ ] Password reset successful

---

### 1.4 Email Verification
**Steps**:
1. After signup, check `/verify-email`
2. Enter 6-digit OTP
3. Click "Verify"

**Expected Results**:
- ✅ OTP validated
- ✅ User account activated
- ✅ Redirect to dashboard

**Test Cases**:
- [ ] Valid OTP
- [ ] Invalid OTP
- [ ] Expired OTP

---

## 2. Customer Booking Flow Testing

### 2.1 Browse Appointments
**Steps**:
1. Navigate to home page (`/`)
2. View appointment cards
3. Use search functionality
4. Click "View Details"

**Expected Results**:
- ✅ All published appointments displayed
- ✅ Search filters appointments
- ✅ Cards show correct information
- ✅ Click redirects to detail page

**Test Cases**:
- [ ] View all appointments
- [ ] Search by title
- [ ] Empty search results
- [ ] Click appointment card

---

### 2.2 Appointment Detail Page
**Steps**:
1. Navigate to `/appointments/[id]`
2. View all appointment information
3. Click "Book Now"

**Expected Results**:
- ✅ All details displayed correctly
- ✅ Images shown (if available)
- ✅ Organizer info visible
- ✅ Redirect to date picker

**Test Cases**:
- [ ] View appointment with images
- [ ] View appointment without images
- [ ] View paid appointment (price shown)
- [ ] View free appointment

---

### 2.3 Date Selection
**Steps**:
1. Navigate to `/book/[id]/date`
2. View calendar
3. Select available date
4. Click "Continue"

**Expected Results**:
- ✅ Calendar shows current month
- ✅ Past dates disabled
- ✅ Available dates highlighted
- ✅ Selected date stored
- ✅ Redirect to time slots

**Test Cases**:
- [ ] Select today
- [ ] Select future date
- [ ] Try to select past date (should be disabled)
- [ ] Navigate between months

---

### 2.4 Time Slot Selection
**Steps**:
1. Navigate to `/book/[id]/time?date=YYYY-MM-DD`
2. View available slots
3. Select a slot
4. Click "Continue"

**Expected Results**:
- ✅ Only available slots shown
- ✅ Capacity displayed (if group booking)
- ✅ Fully booked slots disabled
- ✅ Selected slot highlighted
- ✅ Redirect to booking form

**Test Cases**:
- [ ] View slots for working day
- [ ] View slots for non-working day (empty state)
- [ ] Select available slot
- [ ] Try to select fully booked slot

---

### 2.5 Booking Form
**Steps**:
1. Navigate to `/book/[id]/form?date=...&slot=...`
2. Fill in user information
3. Answer all questions
4. Click "Complete Booking"

**Expected Results**:
- ✅ User info pre-filled from auth
- ✅ All questions rendered correctly
- ✅ Validation for required fields
- ✅ Booking created successfully
- ✅ Capacity decremented
- ✅ Redirect to confirmation

**Test Cases**:
- [ ] Fill all required fields
- [ ] Leave required field empty (validation error)
- [ ] Answer single line question
- [ ] Answer multi line question
- [ ] Answer phone question
- [ ] Select radio option
- [ ] Select multiple checkboxes
- [ ] Submit valid booking

---

### 2.6 Booking Confirmation
**Steps**:
1. Navigate to `/book/[id]/confirmation?booking=...`
2. View booking details
3. Click "View My Bookings"

**Expected Results**:
- ✅ Success message displayed
- ✅ Booking details shown
- ✅ Email confirmation notice
- ✅ Redirect to profile

**Test Cases**:
- [ ] View confirmation page
- [ ] Navigate to profile

---

### 2.7 User Profile & Booking Management
**Steps**:
1. Navigate to `/profile`
2. View upcoming bookings
3. View past bookings
4. Cancel a booking

**Expected Results**:
- ✅ User info displayed
- ✅ Bookings separated by upcoming/past
- ✅ Cancel button works
- ✅ Capacity restored on cancel
- ✅ Status updated to cancelled

**Test Cases**:
- [ ] View profile
- [ ] View upcoming bookings
- [ ] View past bookings
- [ ] Cancel booking
- [ ] Verify capacity restored

---

## 3. Organizer Dashboard Testing

### 3.1 Dashboard Overview
**Steps**:
1. Login as organizer
2. Navigate to `/dashboard`
3. View stats and appointments

**Expected Results**:
- ✅ Stats cards show correct numbers
- ✅ All appointments listed
- ✅ Search works
- ✅ Can create new appointment

**Test Cases**:
- [ ] View dashboard
- [ ] Check stats accuracy
- [ ] Search appointments
- [ ] Click "New Appointment"

---

### 3.2 Create Appointment
**Steps**:
1. Click "New Appointment"
2. Fill in title, description, duration, location
3. Click "Create"

**Expected Results**:
- ✅ Appointment created
- ✅ Default settings created
- ✅ Redirect to edit page

**Test Cases**:
- [ ] Create with all fields
- [ ] Create with required fields only
- [ ] Validation for empty title

---

### 3.3 Edit Appointment - Basic Info
**Steps**:
1. Navigate to `/appointments/[id]/edit`
2. Edit title, description, duration, location
3. Click "Save"

**Expected Results**:
- ✅ Changes saved
- ✅ Toast notification shown
- ✅ Data persisted

**Test Cases**:
- [ ] Edit title
- [ ] Edit description
- [ ] Change duration
- [ ] Update location

---

### 3.4 Edit Appointment - Book Settings
**Steps**:
1. Go to Book tab
2. Toggle manual confirmation
3. Toggle paid booking
4. Set price
5. Add messages
6. Configure meeting details

**Expected Results**:
- ✅ All settings saved
- ✅ Conditional fields shown/hidden
- ✅ Settings applied to bookings

**Test Cases**:
- [ ] Enable manual confirmation
- [ ] Enable paid booking
- [ ] Set price
- [ ] Add introduction message
- [ ] Add confirmation message
- [ ] Set meeting type (online/offline)

---

### 3.5 Schedule Management
**Steps**:
1. Navigate to `/appointments/[id]/schedule`
2. Toggle working days
3. Set working hours
4. Click "Save Schedule"
5. Click "Generate Time Slots"

**Expected Results**:
- ✅ Schedule saved
- ✅ Slots generated for next 30 days
- ✅ Slots match schedule

**Test Cases**:
- [ ] Set Mon-Fri 9-5
- [ ] Set custom hours per day
- [ ] Generate slots
- [ ] Verify slots created

---

### 3.6 Questions Management
**Steps**:
1. Navigate to `/appointments/[id]/questions`
2. Add questions of each type
3. Set mandatory flag
4. Edit question
5. Delete question

**Expected Results**:
- ✅ All question types work
- ✅ Options saved for radio/checkbox
- ✅ Questions appear in booking form
- ✅ Edit/delete works

**Test Cases**:
- [ ] Add single line question
- [ ] Add multi line question
- [ ] Add phone question
- [ ] Add radio question with options
- [ ] Add checkbox question with options
- [ ] Mark as mandatory
- [ ] Edit question
- [ ] Delete question

---

### 3.7 Capacity Management
**Steps**:
1. Go to Capacity tab
2. Enable group booking
3. Set max capacity
4. Save settings

**Expected Results**:
- ✅ Settings saved
- ✅ Slots show capacity
- ✅ Multiple bookings allowed per slot

**Test Cases**:
- [ ] Enable capacity
- [ ] Set max capacity to 5
- [ ] Verify slots updated

---

### 3.8 Publish/Unpublish
**Steps**:
1. From dashboard, click publish toggle
2. Verify status changes

**Expected Results**:
- ✅ Status updated
- ✅ Published appointments visible to customers
- ✅ Unpublished appointments hidden

**Test Cases**:
- [ ] Publish appointment
- [ ] Verify visible on home page
- [ ] Unpublish appointment
- [ ] Verify hidden from home page

---

### 3.9 Reports & Analytics
**Steps**:
1. Navigate to `/reports`
2. View stats
3. View charts
4. View recent bookings

**Expected Results**:
- ✅ All stats accurate
- ✅ Chart shows data
- ✅ Recent bookings listed

**Test Cases**:
- [ ] View reports page
- [ ] Verify stats match database
- [ ] Check chart data
- [ ] View recent bookings

---

## 4. Admin Panel Testing

### 4.1 Admin Dashboard
**Steps**:
1. Login as admin
2. Navigate to `/admin`
3. View system stats

**Expected Results**:
- ✅ Only admins can access
- ✅ Stats show system-wide data
- ✅ Tabs for users and organizers

**Test Cases**:
- [ ] Access as admin
- [ ] Try to access as non-admin (should redirect)
- [ ] View system stats

---

### 4.2 User Management
**Steps**:
1. Go to Users tab
2. Change user role
3. Activate/deactivate user

**Expected Results**:
- ✅ All users listed
- ✅ Role change works
- ✅ Status toggle works

**Test Cases**:
- [ ] View all users
- [ ] Change role to organizer
- [ ] Deactivate user
- [ ] Activate user

---

### 4.3 Organizer Management
**Steps**:
1. Go to Organizers tab
2. Approve pending organizer
3. Disable approved organizer

**Expected Results**:
- ✅ All organizers listed
- ✅ Approval works
- ✅ Disable works

**Test Cases**:
- [ ] View all organizers
- [ ] Approve pending organizer
- [ ] Disable organizer

---

## 5. Role-Based Access Control Testing

### 5.1 Customer Access
**Test Cases**:
- [ ] Can access home page
- [ ] Can access appointment details
- [ ] Can access booking flow
- [ ] Can access profile
- [ ] CANNOT access `/dashboard`
- [ ] CANNOT access `/admin`

---

### 5.2 Organizer Access
**Test Cases**:
- [ ] Can access `/dashboard`
- [ ] Can create appointments
- [ ] Can edit own appointments
- [ ] CANNOT edit other organizer's appointments
- [ ] CANNOT access `/admin`

---

### 5.3 Admin Access
**Test Cases**:
- [ ] Can access `/admin`
- [ ] Can manage all users
- [ ] Can manage all organizers
- [ ] Can view system stats

---

## 6. Database & RLS Testing

### 6.1 Row Level Security
**Test Cases**:
- [ ] Users can only see their own bookings
- [ ] Organizers can only see their own appointments
- [ ] Admins can see all data
- [ ] Public can only see published appointments

---

### 6.2 Capacity Management
**Test Cases**:
- [ ] Booking decrements capacity
- [ ] Cancellation restores capacity
- [ ] Cannot book if capacity = 0
- [ ] Capacity never exceeds max_capacity

---

### 6.3 Slot Generation
**Test Cases**:
- [ ] Slots generated for working days only
- [ ] Slots match schedule times
- [ ] Slots respect appointment duration
- [ ] No duplicate slots created

---

## 7. Email Notifications Testing

### 7.1 Authentication Emails
**Test Cases**:
- [ ] Signup OTP email sent
- [ ] Password reset email sent
- [ ] Email templates render correctly

---

### 7.2 Booking Emails
**Test Cases**:
- [ ] Confirmation email sent after booking
- [ ] Cancellation email sent after cancel
- [ ] Emails contain correct information

---

## 8. UI/UX Testing

### 8.1 Responsive Design
**Test Cases**:
- [ ] Mobile view (375px)
- [ ] Tablet view (768px)
- [ ] Desktop view (1024px+)
- [ ] All pages responsive

---

### 8.2 Loading States
**Test Cases**:
- [ ] Skeleton loaders shown
- [ ] Button loading spinners work
- [ ] Suspense boundaries work

---

### 8.3 Error Handling
**Test Cases**:
- [ ] Form validation errors shown
- [ ] API errors show toast
- [ ] Empty states displayed
- [ ] 404 pages work

---

## 9. Performance Testing

### 9.1 Page Load Times
**Test Cases**:
- [ ] Home page loads < 2s
- [ ] Dashboard loads < 3s
- [ ] Booking flow smooth

---

### 9.2 Database Queries
**Test Cases**:
- [ ] No N+1 queries
- [ ] Indexes used properly
- [ ] Queries optimized

---

## 10. Security Testing

### 10.1 Authentication
**Test Cases**:
- [ ] Protected routes redirect to login
- [ ] Tokens expire properly
- [ ] Session management works

---

### 10.2 Authorization
**Test Cases**:
- [ ] RLS policies enforced
- [ ] Server actions check permissions
- [ ] No unauthorized access

---

## ✅ Final Verification Checklist

Before deployment, verify:

- [ ] All authentication flows work
- [ ] Complete booking flow works end-to-end
- [ ] Organizer can manage appointments
- [ ] Admin can manage system
- [ ] All emails send correctly
- [ ] RLS policies protect data
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Loading states everywhere
- [ ] Error handling complete
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] Production build succeeds

---

**Testing Status**: Ready for comprehensive testing
**Last Updated**: December 20, 2024
