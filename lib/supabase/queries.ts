import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

// Initialize client
const supabase = createClient();

type Appointment = Database['public']['Tables']['appointments']['Row'];
type AppointmentDetails = Database['public']['Views']['appointment_details_view']['Row'];

/**
 * ==========================================
 * USER & AUTH QUERIES
 * ==========================================
 */

export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

export async function updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['users']['Insert']>) {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * ==========================================
 * ORGANIZER QUERIES
 * ==========================================
 */

export async function getOrganizerProfile(userId: string) {
    const { data, error } = await supabase
        .from('organizers')
        .select('*')
        .eq('user_id', userId)
        .single();

    // It's possible to not be an organizer yet, so we handle null gracefully if needed
    // But here we throw if the query fails (excluding "Details: result contains 0 rows" if handled)
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function registerOrganizer(organizerData: { business_name: string; description: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('organizers')
        .insert({
            user_id: user.id,
            ...organizerData
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * ==========================================
 * APPOINTMENT QUERIES (PUBLIC)
 * ==========================================
 */

export async function getPublishedAppointments() {
    // Use the view for richer data
    const { data, error } = await supabase
        .from('appointment_details_view')
        .select('*')
        .eq('published', true);

    if (error) throw error;
    return data;
}

export async function getAppointmentDetails(appointmentId: string) {
    const { data, error } = await supabase
        .from('appointment_details_view')
        .select('*')
        .eq('id', appointmentId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * ==========================================
 * SLOT & SCHEDULING QUERIES
 * ==========================================
 */

export async function getAvailableSlots(appointmentId: string, startDate: Date, endDate: Date) {
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    // First, ensure slots are generated for this range
    // We call the RPC function to generate if missing.
    // Note: Usually this should be done by the organizer or a cron job, but doing it on demand is safe with our idempotent function.
    const { error: genError } = await supabase.rpc('generate_slots', {
        p_appointment_id: appointmentId,
        p_start_date: startStr,
        p_end_date: endStr
    });

    if (genError) console.error('Error generating slots:', genError);

    // Now fetch the slots
    const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('appointment_id', appointmentId)
        .gte('slot_date', startStr)
        .lte('slot_date', endStr)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) throw error;
    return data;
}

/**
 * ==========================================
 * BOOKING QUERIES
 * ==========================================
 */

export async function submitBooking(slotId: string, guestCount: number = 1) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to book');

    // Use the atomic RPC function
    const { data, error } = await supabase.rpc('book_slot', {
        p_slot_id: slotId,
        p_user_id: user.id,
        p_guest_count: guestCount
    });

    if (error) throw error;
    return data; // Returns booking_id
}

export async function getUserBookings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      appointment:appointments (
        title,
        location_type,
        organizer:organizers ( business_name )
      ),
      slot:time_slots (
        slot_date,
        start_time,
        end_time
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function cancelBooking(bookingId: string) {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

    // Note: The database trigger will automatically restore the slot capacity.

    if (error) throw error;
    return data;
}

/**
 * ==========================================
 * APPOINTMENT MANAGEMENT (ORGANIZER)
 * ==========================================
 */

export async function createAppointment(appointmentData: Database['public']['Tables']['appointments']['Insert']) {
    const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

    if (error) throw error;
    return data;
}
