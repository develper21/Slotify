'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * FETCHES ALL PUBLISHED APPOINTMENTS
 * Includes organizer profiles using a single optimized join
 */
export async function getPublishedAppointments(searchQuery?: string) {
    const supabase = createClient()

    let query = supabase
        .from('appointments')
        .select(`
            *,
            profiles:organizer_id (
                business_name,
                avatar_url,
                full_name,
                role
            )
        `)
        .eq('is_active', true)

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching appointments:', error)
        return []
    }

    return data
}

/**
 * FETCHES A SINGLE APPOINTMENT BY ID
 */
export async function getAppointmentById(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('appointments')
        .select(`
            *,
            profiles:organizer_id (
                business_name,
                business_description,
                avatar_url,
                full_name,
                website_url
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching appointment:', error)
        return null
    }

    return data
}

/**
 * FETCHES BOOKING QUESTIONS STORED AS JSONB IN THE APPOINTMENT TABLE
 */
export async function getBookingQuestions(appointmentId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('appointments')
        .select('questions')
        .eq('id', appointmentId)
        .single()

    if (error) {
        console.error('Error fetching questions:', error)
        return []
    }

    // Sort questions by order_index if they are objects in the array
    const questions = data.questions || []
    return Array.isArray(questions) ? questions : []
}

/**
 * GENERATES AVAILABLE SLOTS ON THE FLY
 * Avoids having a dedicated "slots" table to maintain high performance.
 * Calculates availability by checking the 'bookings' table.
 */
export async function getAvailableSlots(appointmentId: string, date: string) {
    const supabase = createClient()

    // 1. Get Appointment details (duration and capacity)
    const { data: appointment, error: aptError } = await supabase
        .from('appointments')
        .select('duration, max_capacity')
        .eq('id', appointmentId)
        .single()

    if (aptError || !appointment) return []

    // 2. Get existing bookings for that date to calculate overlapping availability
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('appointment_id', appointmentId)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .neq('status', 'cancelled')

    if (bookingsError) return []

    // 3. Generate slots based on duration (from 9:00 AM to 6:00 PM)
    const slots = []
    const duration = appointment.duration || 60
    const maxCapacity = appointment.max_capacity || 1

    let currentTime = new Date(date)
    currentTime.setHours(9, 0, 0, 0)

    const dayEndTime = new Date(date)
    dayEndTime.setHours(18, 0, 0, 0)

    while (currentTime < dayEndTime) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000)

        // Performance optimization: Filter overlapping bookings in memory
        const currentSlotStart = currentTime.toISOString()
        const currentSlotEnd = slotEnd.toISOString()

        const overlappingCount = bookings.filter((b: any) => {
            return (currentSlotStart < b.end_time && currentSlotEnd > b.start_time)
        }).length

        if (overlappingCount < maxCapacity) {
            const timeString = currentTime.toTimeString().split(' ')[0] // HH:mm:ss
            const endTimeString = slotEnd.toTimeString().split(' ')[0] // HH:mm:ss

            slots.push({
                id: currentSlotStart, // Unique ID for React keys
                appointment_id: appointmentId,
                start_time: timeString,
                end_time: endTimeString,
                available_capacity: maxCapacity - overlappingCount,
                max_capacity: maxCapacity, // Added for UI
                full_start_time: currentSlotStart,
                full_end_time: currentSlotEnd
            })
        }

        // Increment by duration
        currentTime = new Date(currentTime.getTime() + duration * 60000)
    }

    return slots
}

/**
 * CREATES A NEW BOOKING
 * Answers are stored as JSONB directly in the booking record.
 */
export async function createBooking(bookingData: {
    appointmentId: string
    userId: string
    slotId: string // This is the start_time ISO string
    answers: any
}) {
    const supabase = createClient()

    // 1. Fetch appointment details for duration and price
    const { data: appointment, error: aptError } = await supabase
        .from('appointments')
        .select('duration, price')
        .eq('id', bookingData.appointmentId)
        .single()

    if (aptError || !appointment) {
        return { success: false, message: 'Appointment not found' }
    }

    const startTime = new Date(bookingData.slotId)
    const endTime = new Date(startTime.getTime() + (appointment.duration || 60) * 60000)

    const { data, error } = await supabase
        .from('bookings')
        .insert({
            appointment_id: bookingData.appointmentId,
            customer_id: bookingData.userId,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            answers: bookingData.answers,
            total_price: appointment.price || 0,
            status: 'confirmed'
        })
        .select()
        .single()

    if (error) {
        console.error('Booking creation error:', error)
        return { success: false, message: error.message }
    }

    revalidatePath('/dashboard/bookings')
    return { success: true, bookingId: data.id }
}

/**
 * FETCHES BOOKINGS FOR A LOGGED-IN USER
 */
export async function getUserBookings(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            appointment:appointment_id (
                title,
                duration,
                image_url,
                profiles:organizer_id (
                    business_name
                )
            )
        `)
        .eq('customer_id', userId)
        .order('start_time', { ascending: false })

    if (error) {
        console.error('Error fetching user bookings:', error)
        return []
    }

    return data
}

/**
 * CANCEL A BOOKING
 */
export async function cancelBooking(bookingId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/dashboard/bookings')
    return { success: true }
}