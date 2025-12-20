-- =====================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Complete security implementation for all tables
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update all users
CREATE POLICY "Admins can update all users"
ON public.users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- ORGANIZERS TABLE POLICIES
-- =====================================================

-- Organizers can view their own profile
CREATE POLICY "Organizers can view own profile"
ON public.organizers FOR SELECT
USING (user_id = auth.uid());

-- Organizers can update their own profile
CREATE POLICY "Organizers can update own profile"
ON public.organizers FOR UPDATE
USING (user_id = auth.uid());

-- Admins can view all organizers
CREATE POLICY "Admins can view all organizers"
ON public.organizers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update all organizers (for approval)
CREATE POLICY "Admins can update all organizers"
ON public.organizers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Anyone can insert (for organizer registration)
CREATE POLICY "Anyone can register as organizer"
ON public.organizers FOR INSERT
WITH CHECK (user_id = auth.uid());

-- =====================================================
-- APPOINTMENTS TABLE POLICIES
-- =====================================================

-- Everyone can view published appointments
CREATE POLICY "Anyone can view published appointments"
ON public.appointments FOR SELECT
USING (published = true);

-- Organizers can view their own appointments
CREATE POLICY "Organizers can view own appointments"
ON public.appointments FOR SELECT
USING (
  organizer_id IN (
    SELECT id FROM public.organizers WHERE user_id = auth.uid()
  )
);

-- Organizers can create appointments
CREATE POLICY "Organizers can create appointments"
ON public.appointments FOR INSERT
WITH CHECK (
  organizer_id IN (
    SELECT id FROM public.organizers WHERE user_id = auth.uid()
  )
);

-- Organizers can update their own appointments
CREATE POLICY "Organizers can update own appointments"
ON public.appointments FOR UPDATE
USING (
  organizer_id IN (
    SELECT id FROM public.organizers WHERE user_id = auth.uid()
  )
);

-- Organizers can delete their own appointments
CREATE POLICY "Organizers can delete own appointments"
ON public.appointments FOR DELETE
USING (
  organizer_id IN (
    SELECT id FROM public.organizers WHERE user_id = auth.uid()
  )
);

-- Admins can view all appointments
CREATE POLICY "Admins can view all appointments"
ON public.appointments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- APPOINTMENT SETTINGS TABLE POLICIES
-- =====================================================

-- Organizers can manage settings for their appointments
CREATE POLICY "Organizers can manage own appointment settings"
ON public.appointment_settings FOR ALL
USING (
  appointment_id IN (
    SELECT a.id FROM public.appointments a
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Anyone can view settings for published appointments
CREATE POLICY "Anyone can view published appointment settings"
ON public.appointment_settings FOR SELECT
USING (
  appointment_id IN (
    SELECT id FROM public.appointments WHERE published = true
  )
);

-- =====================================================
-- SCHEDULES TABLE POLICIES
-- =====================================================

-- Organizers can manage schedules for their appointments
CREATE POLICY "Organizers can manage own schedules"
ON public.schedules FOR ALL
USING (
  appointment_id IN (
    SELECT a.id FROM public.appointments a
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Anyone can view schedules for published appointments
CREATE POLICY "Anyone can view published schedules"
ON public.schedules FOR SELECT
USING (
  appointment_id IN (
    SELECT id FROM public.appointments WHERE published = true
  )
);

-- =====================================================
-- TIME SLOTS TABLE POLICIES
-- =====================================================

-- Organizers can manage time slots for their appointments
CREATE POLICY "Organizers can manage own time slots"
ON public.time_slots FOR ALL
USING (
  appointment_id IN (
    SELECT a.id FROM public.appointments a
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Anyone can view time slots for published appointments
CREATE POLICY "Anyone can view published time slots"
ON public.time_slots FOR SELECT
USING (
  appointment_id IN (
    SELECT id FROM public.appointments WHERE published = true
  )
);

-- =====================================================
-- BOOKING QUESTIONS TABLE POLICIES
-- =====================================================

-- Organizers can manage questions for their appointments
CREATE POLICY "Organizers can manage own booking questions"
ON public.booking_questions FOR ALL
USING (
  appointment_id IN (
    SELECT a.id FROM public.appointments a
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Anyone can view questions for published appointments
CREATE POLICY "Anyone can view published booking questions"
ON public.booking_questions FOR SELECT
USING (
  appointment_id IN (
    SELECT id FROM public.appointments WHERE published = true
  )
);

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT
USING (user_id = auth.uid());

-- Users can create bookings
CREATE POLICY "Users can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own bookings (for cancellation)
CREATE POLICY "Users can update own bookings"
ON public.bookings FOR UPDATE
USING (user_id = auth.uid());

-- Organizers can view bookings for their appointments
CREATE POLICY "Organizers can view own appointment bookings"
ON public.bookings FOR SELECT
USING (
  appointment_id IN (
    SELECT a.id FROM public.appointments a
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Organizers can update bookings for their appointments
CREATE POLICY "Organizers can update own appointment bookings"
ON public.bookings FOR UPDATE
USING (
  appointment_id IN (
    SELECT a.id FROM public.appointments a
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- BOOKING ANSWERS TABLE POLICIES
-- =====================================================

-- Users can view their own booking answers
CREATE POLICY "Users can view own booking answers"
ON public.booking_answers FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM public.bookings WHERE user_id = auth.uid()
  )
);

-- Users can create booking answers
CREATE POLICY "Users can create booking answers"
ON public.booking_answers FOR INSERT
WITH CHECK (
  booking_id IN (
    SELECT id FROM public.bookings WHERE user_id = auth.uid()
  )
);

-- Organizers can view answers for their appointment bookings
CREATE POLICY "Organizers can view own appointment booking answers"
ON public.booking_answers FOR SELECT
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    INNER JOIN public.appointments a ON b.appointment_id = a.id
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- =====================================================
-- PAYMENTS TABLE POLICIES
-- =====================================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM public.bookings WHERE user_id = auth.uid()
  )
);

-- Users can create payments for their bookings
CREATE POLICY "Users can create payments"
ON public.payments FOR INSERT
WITH CHECK (
  booking_id IN (
    SELECT id FROM public.bookings WHERE user_id = auth.uid()
  )
);

-- Organizers can view payments for their appointment bookings
CREATE POLICY "Organizers can view own appointment payments"
ON public.payments FOR SELECT
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    INNER JOIN public.appointments a ON b.appointment_id = a.id
    INNER JOIN public.organizers o ON a.organizer_id = o.id
    WHERE o.user_id = auth.uid()
  )
);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- HELPER FUNCTION: Check if user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Check if user is organizer
-- =====================================================
CREATE OR REPLACE FUNCTION is_organizer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'organizer'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- HELPER FUNCTION: Get user's organizer ID
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_organizer_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM public.organizers
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
