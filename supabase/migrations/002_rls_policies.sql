-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacity_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users"
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
-- Organizers can read their own data
CREATE POLICY "Organizers can read own data"
  ON public.organizers FOR SELECT
  USING (user_id = auth.uid());

-- Organizers can update their own data
CREATE POLICY "Organizers can update own data"
  ON public.organizers FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can read all organizers
CREATE POLICY "Admins can read all organizers"
  ON public.organizers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all organizers
CREATE POLICY "Admins can update all organizers"
  ON public.organizers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- APPOINTMENTS TABLE POLICIES
-- =====================================================
-- Anyone can read published appointments
CREATE POLICY "Anyone can read published appointments"
  ON public.appointments FOR SELECT
  USING (published = true);

-- Organizers can read their own appointments
CREATE POLICY "Organizers can read own appointments"
  ON public.appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- Organizers can create appointments
CREATE POLICY "Organizers can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- Organizers can update their own appointments
CREATE POLICY "Organizers can update own appointments"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- Organizers can delete their own appointments
CREATE POLICY "Organizers can delete own appointments"
  ON public.appointments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- APPOINTMENT_SETTINGS TABLE POLICIES
-- =====================================================
-- Anyone can read settings for published appointments
CREATE POLICY "Anyone can read settings for published appointments"
  ON public.appointment_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments
      WHERE id = appointment_id AND published = true
    )
  );

-- Organizers can manage settings for their appointments
CREATE POLICY "Organizers can manage own appointment settings"
  ON public.appointment_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- APPOINTMENT_IMAGES TABLE POLICIES
-- =====================================================
-- Anyone can read images for published appointments
CREATE POLICY "Anyone can read images for published appointments"
  ON public.appointment_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments
      WHERE id = appointment_id AND published = true
    )
  );

-- Organizers can manage images for their appointments
CREATE POLICY "Organizers can manage own appointment images"
  ON public.appointment_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- RESOURCES TABLE POLICIES
-- =====================================================
-- Organizers can manage their own resources
CREATE POLICY "Organizers can manage own resources"
  ON public.resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organizers
      WHERE id = organizer_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- USERS_ASSIGNMENTS TABLE POLICIES
-- =====================================================
-- Organizers can manage assignments for their appointments
CREATE POLICY "Organizers can manage own assignments"
  ON public.users_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- SCHEDULES TABLE POLICIES
-- =====================================================
-- Anyone can read schedules for published appointments
CREATE POLICY "Anyone can read schedules for published appointments"
  ON public.schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments
      WHERE id = appointment_id AND published = true
    )
  );

-- Organizers can manage schedules for their appointments
CREATE POLICY "Organizers can manage own schedules"
  ON public.schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- TIME_SLOTS TABLE POLICIES
-- =====================================================
-- Anyone can read slots for published appointments
CREATE POLICY "Anyone can read slots for published appointments"
  ON public.time_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments
      WHERE id = appointment_id AND published = true
    )
  );

-- Organizers can manage slots for their appointments
CREATE POLICY "Organizers can manage own slots"
  ON public.time_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- CAPACITY_RULES TABLE POLICIES
-- =====================================================
-- Organizers can manage capacity rules for their appointments
CREATE POLICY "Organizers can manage own capacity rules"
  ON public.capacity_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- BOOKING_QUESTIONS TABLE POLICIES
-- =====================================================
-- Anyone can read questions for published appointments
CREATE POLICY "Anyone can read questions for published appointments"
  ON public.booking_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments
      WHERE id = appointment_id AND published = true
    )
  );

-- Organizers can manage questions for their appointments
CREATE POLICY "Organizers can manage own questions"
  ON public.booking_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================
-- Users can read their own bookings
CREATE POLICY "Users can read own bookings"
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

-- Organizers can read bookings for their appointments
CREATE POLICY "Organizers can read bookings for own appointments"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- Organizers can update bookings for their appointments (for confirmation)
CREATE POLICY "Organizers can update bookings for own appointments"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE a.id = appointment_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- BOOKING_ANSWERS TABLE POLICIES
-- =====================================================
-- Users can read their own booking answers
CREATE POLICY "Users can read own booking answers"
  ON public.booking_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

-- Users can create booking answers
CREATE POLICY "Users can create booking answers"
  ON public.booking_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

-- Organizers can read answers for bookings of their appointments
CREATE POLICY "Organizers can read answers for own appointment bookings"
  ON public.booking_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.appointments a ON b.appointment_id = a.id
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE b.id = booking_id AND o.user_id = auth.uid()
    )
  );

-- =====================================================
-- PAYMENTS TABLE POLICIES
-- =====================================================
-- Users can read their own payments
CREATE POLICY "Users can read own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

-- Organizers can read payments for their appointments
CREATE POLICY "Organizers can read payments for own appointments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.appointments a ON b.appointment_id = a.id
      JOIN public.organizers o ON a.organizer_id = o.id
      WHERE b.id = booking_id AND o.user_id = auth.uid()
    )
  );

-- System can create and update payments
CREATE POLICY "System can manage payments"
  ON public.payments FOR ALL
  USING (true)
  WITH CHECK (true);
