-- =====================================================
-- DROP ALL EXISTING TABLES
-- Run this FIRST before running 001_initial_schema.sql
-- =====================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.booking_answers CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.booking_questions CASCADE;
DROP TABLE IF EXISTS public.time_slots CASCADE;
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.appointment_settings CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.organizers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop old tables that were removed in optimization
DROP TABLE IF EXISTS public.appointment_images CASCADE;
DROP TABLE IF EXISTS public.capacity_rules CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.users_assignments CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS generate_slots_for_appointment CASCADE;
DROP FUNCTION IF EXISTS check_slot_availability CASCADE;
DROP FUNCTION IF EXISTS decrement_slot_capacity CASCADE;
DROP FUNCTION IF EXISTS restore_slot_capacity CASCADE;
DROP FUNCTION IF EXISTS restore_capacity_on_cancel CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS add_appointment_image CASCADE;
DROP FUNCTION IF EXISTS remove_appointment_image CASCADE;
DROP FUNCTION IF EXISTS get_primary_image CASCADE;

-- Note: This will delete ALL data!
-- Use only for fresh setup or development
