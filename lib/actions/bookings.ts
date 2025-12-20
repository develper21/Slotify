'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * GET ALL BOOKINGS FOR AN ORGANIZER
 * Uses optimized single-table filtering
 */
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
            appointment:appointment_id (
                id,
                title,
                organizer_id
            ),
            profiles:customer_id (
                full_name,
                email
            )
        `)
        .eq('appointment.organizer_id', organizerId)
        .order('created_at', { ascending: false })

    if (filters?.status) {
        query = query.eq('status', filters.status)
    }

    if (filters?.appointmentId) {
        query = query.eq('appointment_id', filters.appointmentId)
    }

    if (filters?.startDate) {
        query = query.gte('start_time', filters.startDate)
    }

    if (filters?.endDate) {
        query = query.lte('start_time', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching bookings:', error)
        return []
    }

    return data || []
}

/**
 * GET ALL BOOKINGS FOR A CUSTOMER
 */
export async function getCustomerBookings(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            appointment:appointment_id (
                id,
                title,
                organizer_id,
                image_url
            ),
            organizer:appointment_id (
                profiles:organizer_id (
                    business_name,
                    full_name
                )
            )
        `)
        .eq('customer_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching customer bookings:', error)
        return []
    }

    return data || []
}

/**
 * UPDATE BOOKING STATUS
 */
export async function updateBookingStatus(bookingId: string, status: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/dashboard/bookings')
    return { success: true }
}

/**
 * GET BOOKING DETAILS WITH ANSWERS (Stored as JSONB)
 */
export async function getBookingDetails(bookingId: string) {
    const supabase = createClient()

    const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
            *,
            appointment:appointment_id (
                title,
                description,
                location_details,
                duration
            ),
            customer:customer_id (
                full_name,
                email
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

/**
 * EXPORT BOOKINGS TO CSV
 */
export async function exportBookingsToCSV(organizerId: string) {
    const bookings = await getOrganizerBookings(organizerId)

    const headers = ['Booking ID', 'Customer Name', 'Email', 'Appointment', 'Start Time', 'Status', 'Created At']
    const rows = bookings.map((booking: any) => [
        booking.id,
        booking.profiles?.full_name || 'N/A',
        booking.profiles?.email || 'N/A',
        booking.appointment?.title || 'N/A',
        new Date(booking.start_time).toLocaleString(),
        booking.status,
        new Date(booking.created_at).toLocaleDateString()
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    return csv
}
