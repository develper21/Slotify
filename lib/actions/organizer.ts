'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * GET ORGANIZER DETAILS
 * Profiles table contains both User and Organizer data.
 */
export async function getOrganizerId(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .eq('role', 'organizer')
        .single()

    if (error) return null
    return data?.id
}

/**
 * GET ALL APPOINTMENTS FOR AN ORGANIZER
 * Simplified query with no joins to extra settings/images tables.
 */
export async function getOrganizerAppointments(organizerId: string, searchQuery?: string) {
    const supabase = createClient()

    let query = supabase
        .from('appointments')
        .select(`
            *,
            bookings_count:bookings(count)
        `)
        .eq('organizer_id', organizerId)

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching appointments:', error)
        return []
    }

    return data || []
}

/**
 * CREATE NEW APPOINTMENT
 * Consolidates settings into the main appointments table.
 */
export async function createAppointment(organizerId: string, data: {
    title: string
    description?: string
    duration: number
    location_details?: string
    image_url?: string
    price?: number
}) {
    const supabase = createClient()

    const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
            organizer_id: organizerId,
            title: data.title,
            description: data.description,
            duration: data.duration || 60,
            location_details: data.location_details || 'Online',
            image_url: data.image_url,
            price: data.price || 0,
            is_active: true
        })
        .select()
        .single()

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true, appointmentId: appointment.id }
}

/**
 * UPDATE APPOINTMENT
 */
export async function updateAppointment(appointmentId: string, data: any) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', appointmentId)

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/appointments/${appointmentId}/edit`)
    return { success: true }
}

/**
 * TOGGLE ACTIVE STATUS
 */
export async function toggleActiveStatus(appointmentId: string, currentStatus: boolean) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointments')
        .update({ is_active: !currentStatus })
        .eq('id', appointmentId)

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

/**
 * DELETE APPOINTMENT
 */
export async function deleteAppointment(appointmentId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

/**
 * GET APPOINTMENT FOR EDITING
 */
export async function getAppointmentForEdit(appointmentId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single()

    if (error) {
        console.error('Error fetching appointment:', error)
        return null
    }

    return data
}

/**
 * UPSERT BOOKING QUESTIONS (Stored as JSONB in the appointment)
 */
export async function upsertBookingQuestions(appointmentId: string, questions: any[]) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointments')
        .update({ questions })
        .eq('id', appointmentId)

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath(`/appointments/${appointmentId}/edit`)
    return { success: true }
}

/**
 * GET ORGANIZER STATISTICS
 * Calculated directly from consolidated tables.
 */
export async function getOrganizerStats(organizerId: string) {
    const supabase = createClient()

    // Total appointments
    const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', organizerId)

    // Active appointments
    const { count: activeAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', organizerId)
        .eq('is_active', true)

    // Total bookings (using join-less query where possible or single join)
    const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, start_time')
        .eq('appointment.organizer_id', organizerId)

    const now = new Date().toISOString()
    const upcomingCount = bookingsData?.filter((b: any) => b.start_time >= now).length || 0

    return {
        totalAppointments: totalAppointments || 0,
        publishedAppointments: activeAppointments || 0,
        totalBookings: bookingsData?.length || 0,
        upcomingBookings: upcomingCount,
    }
}
