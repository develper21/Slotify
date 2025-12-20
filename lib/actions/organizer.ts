'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get organizer ID from user ID
export async function getOrganizerId(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', userId)
        .single()

    if (error) return null
    return data?.id
}

// Get all appointments for organizer
export async function getOrganizerAppointments(organizerId: string, searchQuery?: string) {
    const supabase = createClient()

    let query = supabase
        .from('appointments')
        .select(`
      *,
      appointment_settings (*),
      appointment_images (image_url, is_primary),
      _count:bookings(count)
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

// Create new appointment
export async function createAppointment(organizerId: string, data: {
    title: string
    description?: string
    duration: string
    location?: string
}) {
    const supabase = createClient()

    const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
            organizer_id: organizerId,
            title: data.title,
            description: data.description,
            duration: data.duration,
            location_details: data.location || 'Online',
            published: false,
            booking_enabled: true,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    // Create default settings
    await supabase
        .from('appointment_settings')
        .insert({
            appointment_id: appointment.id,
            auto_assignment: false,
            capacity_enabled: false,
            max_capacity: 1,
            manual_confirmation: false,
            paid_booking: false,
            price: 0,
            meeting_type: 'online',
        })

    revalidatePath('/dashboard')
    return { success: true, appointmentId: appointment.id }
}

// Update appointment
export async function updateAppointment(appointmentId: string, data: any) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', appointmentId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/appointments/${appointmentId}/edit`)
    return { success: true }
}

// Update appointment settings
export async function updateAppointmentSettings(appointmentId: string, settings: any) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointment_settings')
        .update(settings)
        .eq('appointment_id', appointmentId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/appointments/${appointmentId}/edit`)
    return { success: true }
}

// Toggle publish status
export async function togglePublishStatus(appointmentId: string, currentStatus: boolean) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointments')
        .update({ published: !currentStatus })
        .eq('id', appointmentId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

// Delete appointment
export async function deleteAppointment(appointmentId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

// Get appointment for editing
export async function getAppointmentForEdit(appointmentId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('appointments')
        .select(`
      *,
      appointment_settings (*),
      appointment_images (*),
      schedules (*),
      booking_questions (*)
    `)
        .eq('id', appointmentId)
        .single()

    if (error) {
        console.error('Error fetching appointment:', error)
        return null
    }

    return data
}

// Create/Update schedule
export async function upsertSchedule(appointmentId: string, schedules: any[]) {
    const supabase = createClient()

    // Delete existing schedules
    await supabase
        .from('schedules')
        .delete()
        .eq('appointment_id', appointmentId)

    // Insert new schedules
    const { error } = await supabase
        .from('schedules')
        .insert(
            schedules.map(s => ({
                appointment_id: appointmentId,
                day_of_week: s.day_of_week,
                start_time: s.start_time,
                end_time: s.end_time,
                is_active: s.is_working_day,
            }))
        )

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/appointments/${appointmentId}/edit`)
    return { success: true }
}

// Create booking question
export async function createBookingQuestion(appointmentId: string, question: {
    question_text: string
    question_type: string
    options?: string[]
    is_mandatory: boolean
    order_index: number
}) {
    const supabase = createClient()

    const { error } = await supabase
        .from('booking_questions')
        .insert({
            appointment_id: appointmentId,
            question_text: question.question_text,
            question_type: question.question_type as "single_line" | "multi_line" | "phone" | "radio" | "checkbox",
            options: question.options ? JSON.stringify(question.options) : null,
            is_mandatory: question.is_mandatory,
            order_index: question.order_index,
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/appointments/${appointmentId}/edit`)
    return { success: true }
}

// Update booking question
export async function updateBookingQuestion(questionId: string, question: any) {
    const supabase = createClient()

    const { error } = await supabase
        .from('booking_questions')
        .update({
            ...question,
            options: question.options ? JSON.stringify(question.options) : null,
        })
        .eq('id', questionId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

// Delete booking question
export async function deleteBookingQuestion(questionId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('booking_questions')
        .delete()
        .eq('id', questionId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

// Get bookings for appointment
export async function getAppointmentBookings(appointmentId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      users (full_name, email),
      time_slots (slot_date, start_time, end_time)
    `)
        .eq('appointment_id', appointmentId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching bookings:', error)
        return []
    }

    return data || []
}

// Get organizer statistics
export async function getOrganizerStats(organizerId: string) {
    const supabase = createClient()

    // Total appointments
    const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', organizerId)

    // Published appointments
    const { count: publishedAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', organizerId)
        .eq('published', true)

    // Total bookings
    const { count: totalBookings } = await supabase
        .from('bookings')
        .select('appointment_id, appointments!inner(organizer_id)', { count: 'exact', head: true })
        .eq('appointments.organizer_id', organizerId)

    // Upcoming bookings
    const { count: upcomingBookings } = await supabase
        .from('bookings')
        .select('appointment_id, time_slots!inner(slot_date), appointments!inner(organizer_id)', { count: 'exact', head: true })
        .eq('appointments.organizer_id', organizerId)
        .gte('time_slots.slot_date', new Date().toISOString().split('T')[0])

    return {
        totalAppointments: totalAppointments || 0,
        publishedAppointments: publishedAppointments || 0,
        totalBookings: totalBookings || 0,
        upcomingBookings: upcomingBookings || 0,
    }
}
