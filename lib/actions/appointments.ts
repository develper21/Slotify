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

    // 1. Get Appointment details including working hours (availability JSONB)
    const { data: appointment, error: aptError } = await supabase
        .from('appointments')
        .select('duration, max_capacity, availability')
        .eq('id', appointmentId)
        .single()

    if (aptError || !appointment) return []

    // 2. Determine Day of Week
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const dayConfig = appointment.availability?.[dayName]

    if (!dayConfig || !dayConfig.active || !dayConfig.slots) return []

    // 3. Get existing bookings for overlapping
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

    // 4. Generate slots based on the organizer's custom configuration for THIS specific day
    const slots = []
    const duration = appointment.duration || 60
    const maxCapacity = appointment.max_capacity || 1

    for (const range of dayConfig.slots) {
        let currentTime = new Date(date)
        const [startH, startM] = range.start.split(':').map(Number)
        const [endH, endM] = range.end.split(':').map(Number)

        currentTime.setHours(startH, startM, 0, 0)
        const rangeEndTime = new Date(date)
        rangeEndTime.setHours(endH, endM, 0, 0)

        while (currentTime < rangeEndTime) {
            const slotEnd = new Date(currentTime.getTime() + duration * 60000)
            if (slotEnd > rangeEndTime) break

            const currentSlotStart = currentTime.toISOString()
            const currentSlotEnd = slotEnd.toISOString()

            const overlappingCount = bookings.filter((b: any) => {
                return (currentSlotStart < b.end_time && currentSlotEnd > b.start_time)
            }).length

            if (overlappingCount < maxCapacity) {
                slots.push({
                    id: currentSlotStart,
                    start_time: currentTime.toTimeString().split(' ')[0],
                    end_time: slotEnd.toTimeString().split(' ')[0],
                    available_capacity: maxCapacity - overlappingCount,
                    max_capacity: maxCapacity,
                    full_start_time: currentSlotStart,
                    full_end_time: currentSlotEnd
                })
            }
            currentTime = new Date(currentTime.getTime() + duration * 60000)
        }
    }

    return slots
}

import { redis } from '@/lib/redis'

/**
 * CREATES A NEW BOOKING
 */
export async function createBooking(bookingData: {
    appointmentId: string
    userId: string
    slotId: string // This is the start_time ISO string
    answers: any
}) {
    const supabase = createClient()

    // 1. Concurrency Control: Try to acquire a lock for this specific slot
    const lockKey = `lock:booking:${bookingData.appointmentId}:${bookingData.slotId}`
    let lockAcquired = false

    try {
        // Only attempt redis if configured
        if (process.env.UPSTASH_REDIS_REST_URL) {
            const result = await redis.set(lockKey, 'locked', { nx: true, ex: 15 })
            if (!result) {
                return { success: false, message: 'Slot is currently being booked by another user. Please try again in a few seconds.' }
            }
            lockAcquired = true
        }

        // 2. Double-Check Availability in Supabase (inside the lock)
        const { data: appointment, error: aptError } = await supabase
            .from('appointments')
            .select('title, duration, price, max_capacity')
            .eq('id', bookingData.appointmentId)
            .single()

        if (aptError || !appointment) {
            return { success: false, message: 'Appointment not found' }
        }

        const startTime = new Date(bookingData.slotId)
        const endTime = new Date(startTime.getTime() + (appointment.duration || 60) * 60000)

        // Count existing confirmed bookings for this exact slot
        const { count: existingCount, error: countError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('appointment_id', bookingData.appointmentId)
            .eq('start_time', startTime.toISOString())
            .neq('status', 'cancelled')

        if (countError) throw countError

        if ((existingCount || 0) >= (appointment.max_capacity || 1)) {
            return { success: false, message: 'Sorry, this slot just got fully booked.' }
        }

        // 3. Perform the Booking
        const isPaid = (appointment.price || 0) > 0
        const initialStatus = isPaid ? 'pending_payment' : 'confirmed'

        const { data, error } = await supabase
            .from('bookings')
            .insert({
                appointment_id: bookingData.appointmentId,
                customer_id: bookingData.userId,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                answers: bookingData.answers,
                total_price: appointment.price || 0,
                status: initialStatus
            })
            .select()
            .single()

        if (error) {
            console.error('Booking creation error:', error)
            return { success: false, message: error.message }
        }

        revalidatePath('/dashboard/bookings')

        return {
            success: true,
            bookingId: data.id,
            requiresPayment: isPaid,
            price: appointment.price,
            title: appointment.title
        }

    } catch (err: any) {
        console.error('Race condition check failed:', err)
        return { success: false, message: 'An error occurred during booking. Please try again.' }
    } finally {
        // 4. Release lock
        if (lockAcquired) {
            await redis.del(lockKey)
        }
    }
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