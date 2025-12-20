-- ==============================================================================
-- SLOTIFY DATABASE SCHEMA & MIGRATION (CLEAN RESET)
-- Robust schema with RLS, helpers, and frontend-aligned columns
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'organizer', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE appointment_location_type AS ENUM ('online', 'offline');
CREATE TYPE question_type AS ENUM ('single_line', 'multi_line', 'phone', 'radio', 'checkbox');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- 3. TABLES

-- Table: users (syncs with auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: organizers
CREATE TABLE public.organizers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table: appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTERVAL NOT NULL DEFAULT '30 minutes',
  location TEXT,
  location_type appointment_location_type NOT NULL DEFAULT 'offline',
  location_details TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  booking_enabled BOOLEAN NOT NULL DEFAULT true,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: appointment_settings
CREATE TABLE public.appointment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  auto_confirmation BOOLEAN NOT NULL DEFAULT false,
  auto_assignment BOOLEAN NOT NULL DEFAULT false,
  capacity_enabled BOOLEAN NOT NULL DEFAULT false,
  min_capacity INTEGER NOT NULL DEFAULT 1,
  max_capacity INTEGER NOT NULL DEFAULT 1,
  manual_confirmation BOOLEAN NOT NULL DEFAULT false,
  paid_booking BOOLEAN NOT NULL DEFAULT false,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  introduction_message TEXT,
  confirmation_message TEXT,
  meeting_instructions TEXT,
  meeting_type TEXT NOT NULL DEFAULT 'online',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: schedules (weekly patterns)
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working_day BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(appointment_id, day_of_week)
);

-- Table: time_slots (concrete slots)
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  current_bookings INTEGER NOT NULL DEFAULT 0,
  max_capacity INTEGER NOT NULL DEFAULT 1,
  available_capacity INTEGER GENERATED ALWAYS AS (GREATEST(max_capacity - current_bookings, 0)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(appointment_id, slot_date, start_time)
);

-- Table: booking_questions
CREATE TABLE public.booking_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL,
  options JSONB,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  guest_count INTEGER NOT NULL DEFAULT 1,
  status booking_status NOT NULL DEFAULT 'pending',
  customer_notes TEXT,
  booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: booking_answers
CREATE TABLE public.booking_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.booking_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  provider TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: appointment_images
CREATE TABLE public.appointment_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: otp_verifications (for custom OTP flows)
CREATE TABLE public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  purpose TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_organizers_user_id ON public.organizers(user_id);
CREATE INDEX idx_appointments_organizer_id ON public.appointments(organizer_id);
CREATE INDEX idx_appointments_published ON public.appointments(published);
CREATE INDEX idx_time_slots_appointment_date ON public.time_slots(appointment_id, slot_date);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_slot_id ON public.bookings(slot_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_otp_verifications_email ON public.otp_verifications(email);

-- 5. AUTOMATIC TIMESTAMP UPDATES
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER t_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER t_organizers_updated_at BEFORE UPDATE ON public.organizers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER t_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER t_appointment_settings_updated_at BEFORE UPDATE ON public.appointment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER t_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER t_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER t_appointment_images_updated_at BEFORE UPDATE ON public.appointment_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. SECURITY: ROW LEVEL SECURITY (RLS)
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
ALTER TABLE public.appointment_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 6.1 USERS POLICIES
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all users" ON public.users FOR UPDATE USING (is_admin());
CREATE POLICY "System can insert users" ON public.users FOR INSERT WITH CHECK (true);

-- 6.2 ORGANIZERS POLICIES
CREATE POLICY "Public can view approved organizers" ON public.organizers FOR SELECT USING (approved = true);
CREATE POLICY "Organizers can view own profile" ON public.organizers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Organizers can update own profile" ON public.organizers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can register as organizer" ON public.organizers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage organizers" ON public.organizers FOR ALL USING (is_admin());

-- 6.3 APPOINTMENTS POLICIES
CREATE POLICY "Public can view published appointments" ON public.appointments FOR SELECT USING (published = true);
CREATE POLICY "Organizers can view own appointments" ON public.appointments FOR SELECT USING (organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()));
CREATE POLICY "Organizers can insert appointments" ON public.appointments FOR INSERT WITH CHECK (organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()));
CREATE POLICY "Organizers can update own appointments" ON public.appointments FOR UPDATE USING (organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()));
CREATE POLICY "Organizers can delete own appointments" ON public.appointments FOR DELETE USING (organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL USING (is_admin());

-- 6.4 APPOINTMENT SETTINGS POLICIES
CREATE POLICY "Public can view settings of published" ON public.appointment_settings FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = appointment_settings.appointment_id AND a.published = true)
);
CREATE POLICY "Organizers can manage settings" ON public.appointment_settings FOR ALL USING (
  EXISTS(SELECT 1 FROM public.appointments a JOIN public.organizers o ON a.organizer_id = o.id WHERE a.id = appointment_settings.appointment_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can manage settings" ON public.appointment_settings FOR ALL USING (is_admin());

-- 6.5 SCHEDULES & TIME SLOTS
CREATE POLICY "Public can view schedules" ON public.schedules FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = schedules.appointment_id AND a.published = true)
);
CREATE POLICY "Organizers can manage schedules" ON public.schedules FOR ALL USING (
  EXISTS(SELECT 1 FROM public.appointments a JOIN public.organizers o ON a.organizer_id = o.id WHERE a.id = schedules.appointment_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can manage schedules" ON public.schedules FOR ALL USING (is_admin());

CREATE POLICY "Public can view slots" ON public.time_slots FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = time_slots.appointment_id AND a.published = true)
);
CREATE POLICY "Organizers can manage slots" ON public.time_slots FOR ALL USING (
  EXISTS(SELECT 1 FROM public.appointments a JOIN public.organizers o ON a.organizer_id = o.id WHERE a.id = time_slots.appointment_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can manage slots" ON public.time_slots FOR ALL USING (is_admin());

-- 6.6 BOOKING QUESTIONS
CREATE POLICY "Public can view questions" ON public.booking_questions FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = booking_questions.appointment_id AND a.published = true)
);
CREATE POLICY "Organizers can manage questions" ON public.booking_questions FOR ALL USING (
  EXISTS(SELECT 1 FROM public.appointments a JOIN public.organizers o ON a.organizer_id = o.id WHERE a.id = booking_questions.appointment_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can manage questions" ON public.booking_questions FOR ALL USING (is_admin());

-- 6.7 BOOKINGS
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Organizers can view bookings for their events" ON public.bookings FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.appointments a JOIN public.organizers o ON a.organizer_id = o.id WHERE a.id = bookings.appointment_id AND o.user_id = auth.uid())
);
CREATE POLICY "Organizers can update bookings" ON public.bookings FOR UPDATE USING (
  EXISTS(SELECT 1 FROM public.appointments a JOIN public.organizers o ON a.organizer_id = o.id WHERE a.id = bookings.appointment_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL USING (is_admin());

-- 6.8 BOOKING ANSWERS
CREATE POLICY "Users can manage own answers" ON public.booking_answers FOR ALL USING (
  EXISTS(SELECT 1 FROM public.bookings b WHERE b.id = booking_answers.booking_id AND b.user_id = auth.uid())
);
CREATE POLICY "Organizers can view answers" ON public.booking_answers FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.bookings b JOIN public.appointments a ON b.appointment_id = a.id JOIN public.organizers o ON a.organizer_id = o.id WHERE b.id = booking_answers.booking_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can view answers" ON public.booking_answers FOR SELECT USING (is_admin());

-- 6.9 PAYMENTS
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid())
);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS(SELECT 1 FROM public.bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid())
);
CREATE POLICY "Organizers can view payments" ON public.payments FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.bookings b JOIN public.appointments a ON b.appointment_id = a.id JOIN public.organizers o ON a.organizer_id = o.id WHERE b.id = payments.booking_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (is_admin());

-- 6.10 APPOINTMENT IMAGES
CREATE POLICY "Public can view images of published appointments" ON public.appointment_images FOR SELECT USING (
  EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = appointment_images.appointment_id AND a.published = true)
);
CREATE POLICY "Organizers can manage images" ON public.appointment_images FOR ALL USING (
  EXISTS(SELECT 1 FROM public.appointments a JOIN public.organizers o ON a.organizer_id = o.id WHERE a.id = appointment_images.appointment_id AND o.user_id = auth.uid())
);
CREATE POLICY "Admins can manage images" ON public.appointment_images FOR ALL USING (is_admin());

-- 6.11 OTP VERIFICATIONS (Service role only)
CREATE POLICY "Service role full access" ON public.otp_verifications FOR ALL USING (auth.role() = 'service_role');

-- 7. FUNCTIONS (Business Logic)

-- 7.1 Sync User from Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7.2 Composite view for frontend
CREATE OR REPLACE VIEW public.appointment_details_view AS
SELECT 
  a.id,
  a.title,
  a.description,
  a.organizer_id,
  a.duration,
  a.location,
  a.location_type,
  a.location_details,
  a.published,
  a.booking_enabled,
  a.images,
  a.created_at,
  a.updated_at,
  o.business_name,
  o.logo_url as organizer_logo,
  s.price,
  s.currency,
  s.introduction_message,
  s.confirmation_message,
  s.meeting_instructions
FROM public.appointments a
JOIN public.organizers o ON a.organizer_id = o.id
LEFT JOIN public.appointment_settings s ON a.id = s.appointment_id;

-- 7.3 Generate Slots Function
CREATE OR REPLACE FUNCTION generate_slots(
  p_appointment_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS INTEGER AS $$
DECLARE
  v_rec RECORD;
  v_day_of_week INT;
  v_curr_date DATE := p_start_date;
  v_curr_time TIME;
  v_duration INTERVAL;
  v_max_cap INTEGER;
  v_count INTEGER := 0;
BEGIN
  SELECT a.duration, COALESCE(s.max_capacity, 1) 
  INTO v_duration, v_max_cap
  FROM public.appointments a
  LEFT JOIN public.appointment_settings s ON a.id = s.appointment_id
  WHERE a.id = p_appointment_id;

  IF v_duration IS NULL THEN RAISE EXCEPTION 'Appointment not found'; END IF;

  WHILE v_curr_date <= p_end_date LOOP
    v_day_of_week := EXTRACT(DOW FROM v_curr_date);

    FOR v_rec IN (
      SELECT start_time, end_time 
      FROM public.schedules 
      WHERE appointment_id = p_appointment_id 
        AND day_of_week = v_day_of_week 
        AND is_working_day = true
    ) LOOP
      v_curr_time := v_rec.start_time;
      WHILE v_curr_time + v_duration <= v_rec.end_time LOOP
        INSERT INTO public.time_slots (appointment_id, slot_date, start_time, end_time, max_capacity, current_bookings)
        VALUES (p_appointment_id, v_curr_date, v_curr_time, v_curr_time + v_duration, v_max_cap, 0)
        ON CONFLICT DO NOTHING;

        v_count := v_count + 1;
        v_curr_time := v_curr_time + v_duration;
      END LOOP;
    END LOOP;

    v_curr_date := v_curr_date + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- 7.4 Atomic Booking Function (concurrency-safe)
CREATE OR REPLACE FUNCTION book_slot(
  p_slot_id UUID,
  p_user_id UUID,
  p_guest_count INTEGER DEFAULT 1
)
RETURNS UUID AS $$
DECLARE
  v_slot public.time_slots%ROWTYPE;
  v_booking_id UUID;
BEGIN
  SELECT * INTO v_slot FROM public.time_slots WHERE id = p_slot_id FOR UPDATE;

  IF v_slot IS NULL THEN RAISE EXCEPTION 'Slot not found'; END IF;
  IF v_slot.current_bookings + p_guest_count > v_slot.max_capacity THEN
    RAISE EXCEPTION 'Slot capacity exceeded';
  END IF;

  INSERT INTO public.bookings (appointment_id, slot_id, user_id, guest_count, status)
  VALUES (v_slot.appointment_id, p_slot_id, p_user_id, p_guest_count, 'pending')
  RETURNING id INTO v_booking_id;

  UPDATE public.time_slots 
  SET current_bookings = current_bookings + p_guest_count 
  WHERE id = p_slot_id;

  RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7.5 Decrement slot capacity (for cancellations)
CREATE OR REPLACE FUNCTION decrement_slot_capacity(
  p_slot_id UUID,
  p_amount INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.time_slots
  SET current_bookings = GREATEST(current_bookings - p_amount, 0)
  WHERE id = p_slot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
