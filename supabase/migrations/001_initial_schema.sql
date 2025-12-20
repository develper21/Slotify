-- =====================================================
-- SLOTIFY DATABASE SCHEMA
-- Complete appointment booking system
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: users (extends auth.users)
-- =====================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'organizer', 'admin')) DEFAULT 'customer',
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: organizers
-- =====================================================
CREATE TABLE public.organizers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- TABLE: appointments
-- =====================================================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTERVAL NOT NULL DEFAULT '30 minutes',
  location TEXT DEFAULT 'Online',
  published BOOLEAN NOT NULL DEFAULT false,
  booking_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: appointment_settings
-- =====================================================
CREATE TABLE public.appointment_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
  auto_assignment BOOLEAN NOT NULL DEFAULT false,
  capacity_enabled BOOLEAN NOT NULL DEFAULT false,
  max_capacity INTEGER DEFAULT 1,
  manual_confirmation BOOLEAN NOT NULL DEFAULT false,
  paid_booking BOOLEAN NOT NULL DEFAULT false,
  price DECIMAL(10, 2) DEFAULT 0.00,
  introduction_message TEXT,
  confirmation_message TEXT,
  meeting_type TEXT CHECK (meeting_type IN ('online', 'offline')) DEFAULT 'online',
  meeting_instructions TEXT,
  venue_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: appointment_images
-- =====================================================
CREATE TABLE public.appointment_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: resources
-- =====================================================
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: users_assignments
-- =====================================================
CREATE TABLE public.users_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(appointment_id, user_id)
);

-- =====================================================
-- TABLE: schedules
-- =====================================================
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working_day BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(appointment_id, day_of_week)
);

-- =====================================================
-- TABLE: time_slots
-- =====================================================
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available_capacity INTEGER NOT NULL DEFAULT 1,
  max_capacity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(appointment_id, slot_date, start_time)
);

-- =====================================================
-- TABLE: capacity_rules
-- =====================================================
CREATE TABLE public.capacity_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: booking_questions
-- =====================================================
CREATE TABLE public.booking_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single_line', 'multi_line', 'phone', 'radio', 'checkbox')),
  options JSONB,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: bookings
-- =====================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  capacity_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: booking_answers
-- =====================================================
CREATE TABLE public.booking_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.booking_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: payments
-- =====================================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_appointments_organizer ON public.appointments(organizer_id);
CREATE INDEX idx_appointments_published ON public.appointments(published);
CREATE INDEX idx_time_slots_appointment ON public.time_slots(appointment_id);
CREATE INDEX idx_time_slots_date ON public.time_slots(slot_date);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_appointment ON public.bookings(appointment_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_schedules_appointment ON public.schedules(appointment_id);

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_settings_updated_at BEFORE UPDATE ON public.appointment_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Generate time slots for an appointment
-- =====================================================
CREATE OR REPLACE FUNCTION generate_slots_for_appointment(
  p_appointment_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS INTEGER AS $$
DECLARE
  v_schedule RECORD;
  v_current_date DATE;
  v_current_time TIME;
  v_slot_duration INTERVAL;
  v_max_capacity INTEGER;
  v_slots_created INTEGER := 0;
BEGIN
  -- Get appointment duration and capacity
  SELECT duration INTO v_slot_duration
  FROM public.appointments
  WHERE id = p_appointment_id;

  SELECT COALESCE(max_capacity, 1) INTO v_max_capacity
  FROM public.appointment_settings
  WHERE appointment_id = p_appointment_id;

  -- Loop through each date in the range
  v_current_date := p_start_date;
  WHILE v_current_date <= p_end_date LOOP
    -- Get schedule for this day of week
    SELECT * INTO v_schedule
    FROM public.schedules
    WHERE appointment_id = p_appointment_id
      AND day_of_week = EXTRACT(DOW FROM v_current_date)
      AND is_working_day = true;

    -- If working day, generate slots
    IF FOUND THEN
      v_current_time := v_schedule.start_time;
      WHILE v_current_time + v_slot_duration <= v_schedule.end_time LOOP
        -- Insert slot if not exists
        INSERT INTO public.time_slots (
          appointment_id,
          slot_date,
          start_time,
          end_time,
          available_capacity,
          max_capacity
        )
        VALUES (
          p_appointment_id,
          v_current_date,
          v_current_time,
          v_current_time + v_slot_duration,
          v_max_capacity,
          v_max_capacity
        )
        ON CONFLICT (appointment_id, slot_date, start_time) DO NOTHING;

        v_slots_created := v_slots_created + 1;
        v_current_time := v_current_time + v_slot_duration;
      END LOOP;
    END IF;

    v_current_date := v_current_date + 1;
  END LOOP;

  RETURN v_slots_created;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Check slot availability
-- =====================================================
CREATE OR REPLACE FUNCTION check_slot_availability(
  p_slot_id UUID,
  p_capacity_needed INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available_capacity INTEGER;
BEGIN
  SELECT available_capacity INTO v_available_capacity
  FROM public.time_slots
  WHERE id = p_slot_id;

  RETURN v_available_capacity >= p_capacity_needed;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Decrement slot capacity
-- =====================================================
CREATE OR REPLACE FUNCTION decrement_slot_capacity(
  p_slot_id UUID,
  p_amount INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.time_slots
  SET available_capacity = available_capacity - p_amount
  WHERE id = p_slot_id
    AND available_capacity >= p_amount;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCTION: Restore slot capacity
-- =====================================================
CREATE OR REPLACE FUNCTION restore_slot_capacity(
  p_slot_id UUID,
  p_amount INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.time_slots
  SET available_capacity = LEAST(available_capacity + p_amount, max_capacity)
  WHERE id = p_slot_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: Auto-restore capacity on booking cancellation
-- =====================================================
CREATE OR REPLACE FUNCTION restore_capacity_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    PERFORM restore_slot_capacity(NEW.slot_id, NEW.capacity_count);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_cancel_restore_capacity
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION restore_capacity_on_cancel();
