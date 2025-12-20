'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get all bookings for organizer
export async function getOrganizerBookings(organizerId: string, filters?: {
    status?: string
    appointmentId?: string
    startDate?: string
    endDate?: string
}) {
    const supabase = createClient()

    let query = supabase
        .from('bookings')
        .select(`
            *,
            appointments!inner (
                id,
                title,
                organizer_id
            ),
            users (
                full_name,
                email
            ),
            time_slots (
                slot_date,
                start_time,
                end_time
            )
        `)
        .eq('appointments.organizer_id', organizerId)
        .order('created_at', { ascending: false })

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    if (filters?.appointmentId) {
        query = query.eq('appointment_id', filters.appointmentId)
    }

    if (filters?.startDate) {
        query = query.gte('time_slots.slot_date', filters.startDate)
    }

    if (filters?.endDate) {
        query = query.lte('time_slots.slot_date', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching bookings:', error)
        return []
    }

    return data || []
}

// Get all bookings for customer
export async function getCustomerBookings(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            appointments (
                id,
                title,
                organizer_id
            ),
            users (
                full_name,
                email
            ),
            time_slots (
                slot_date,
                start_time,
                end_time
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching customer bookings:', error)
        return []
    }

    return data || []
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/bookings')
    return { success: true }
}

// Get booking details with answers
export async function getBookingDetails(bookingId: string) {
    const supabase = createClient()

    const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
            *,
            appointments (
                title,
                description,
                location,
                duration
            ),
            users (
                full_name,
                email,
                phone
            ),
            time_slots (
                slot_date,
                start_time,
                end_time
            ),
            booking_answers (
                answer_text,
                booking_questions (
                    question_text,
                    question_type
                )
            )
        `)
        .eq('id', bookingId)
        .single()

    if (error) {
        console.error('Error fetching booking details:', error)
        return null
    }

    return booking
}

// Export bookings to CSV
export async function exportBookingsToCSV(organizerId: string) {
    const bookings = await getOrganizerBookings(organizerId)

    const headers = ['Booking ID', 'Customer Name', 'Email', 'Appointment', 'Date', 'Time', 'Status', 'Created At']
    const rows = bookings.map((booking: any) => [
        booking.id,
        booking.users?.full_name || 'N/A',
        booking.users?.email || 'N/A',
        booking.appointments?.title || 'N/A',
        booking.time_slots?.slot_date || 'N/A',
        `${booking.time_slots?.start_time} - ${booking.time_slots?.end_time}`,
        booking.status,
        new Date(booking.created_at).toLocaleDateString()
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    return csv
}
