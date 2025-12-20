'use server'
import { createClient } from '@/lib/supabase/server'

export async function getPublishedAppointments(searchQuery?: string) {
    const supabase = createClient()

    let query = supabase
        .from('appointments')
        .select(`
      *,
      organizers (
        id,
        business_name,
        users (
          full_name
        )
      )
    `)
        .eq('published', true)
        .eq('booking_enabled', true)

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

export async function getAppointmentById(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('appointments')
        .select(`
      *,
      organizers (
        id,
        business_name,
        users (
          full_name,
          email
        )
      ),
      appointment_settings (*)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching appointment:', error)
        return null
    }

    return data
}

import { addMinutes, format, parse, getDay } from 'date-fns'

// ... imports

export async function getAvailableSlots(appointmentId: string, date: string) {
    const supabase = createClient()

    // 1. Get Appointment Configuration (Duration)
    const { data: appointment } = await supabase
        .from('appointments')
        .select('duration')
        .eq('id', appointmentId)
        .single()

    if (!appointment) return []

    // 2. Get Schedule for this Day of Week
    // date string is YYYY-MM-DD
    const dateObj = new Date(date)
    const dayOfWeek = format(dateObj, 'EEEE') // 'Monday', 'Tuesday'...

    const { data: schedule } = await supabase
        .from('schedules')
        .select('*')
        .eq('appointment_id', appointmentId)
        .eq('day_of_week', dayOfWeek)
        .eq('is_active', true)
        .single()

    if (!schedule) return []

    // 3. Get Existing Real Slots from DB (to preserve capacity counts if they were already created/booked)
    const { data: existingSlots } = await supabase
        .from('time_slots')
        .select('*')
        .eq('appointment_id', appointmentId)
        .eq('slot_date', date)

    // 4. Generate All Possible Slots based on Schedule + Duration
    const slots = []
    const startTime = parse(schedule.start_time, 'HH:mm:ss', new Date())
    const endTime = parse(schedule.end_time, 'HH:mm:ss', new Date())
    let currentTime = startTime

    while (currentTime < endTime) {
        const timeString = format(currentTime, 'HH:mm:ss')
        const slotEndTime = addMinutes(currentTime, appointment.duration)

        if (slotEndTime > endTime) break;

        // Check if we have an existing DB record for this slot
        const existingSlot = existingSlots?.find((s: any) => s.start_time === timeString)

        if (existingSlot) {
            if (existingSlot.available_capacity > 0) {
                slots.push(existingSlot)
            }
        } else {
            // Virtual Slot
            slots.push({
                id: `virtual|${date}|${timeString}`,
                appointment_id: appointmentId,
                slot_date: date,
                start_time: timeString,
                end_time: format(slotEndTime, 'HH:mm:ss'),
                available_capacity: 1, // Default capacity? TODO: Fetch from settings
                total_capacity: 1
            })
        }

        currentTime = slotEndTime
    }

    return slots
}

export async function getBookingQuestions(appointmentId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('booking_questions')
        .select('*')
        .eq('appointment_id', appointmentId)
        .order('order_index')

    if (error) {
        console.error('Error fetching questions:', error)
        return []
    }

    return data || []
}

// ... (previous code)

export async function createBooking(bookingData: {
    appointmentId: string
    userId: string
    slotId: string
    capacityCount: number
    answers: { questionId: string; answer: string }[]
    date?: string // Added date to bookingData to allow creating slot
}) {
    const supabase = createClient()
    let realSlotId = bookingData.slotId

    // Handle Virtual Slot Creation
    if (bookingData.slotId.startsWith('virtual|')) {
        const startTime = bookingData.slotId.split('|')[1]

        // We need date to create the slot. It should be passed in bookingData ideally.
        // If not passed, we might be in trouble unless we encoded it in ID.
        // Let's assume we can fetch appointment duration to calculate end time.

        const { data: appointment } = await supabase
            .from('appointments')
            .select('duration')
            .eq('id', bookingData.appointmentId)
            .single()

        if (!appointment) return { error: 'Invalid appointment' }

        // Need the date. Let's rely on the client passing it or encode it in ID?
        // Current virtual ID: `virtual|${startTime}`. It lacks date.
        // RISK: multithreading issues if two people book same virtual slot at same time.
        // Upsert might be better? Or `insert ... on conflict do nothing` then select.

        // Wait, where do we get the date from? 
        // `createBooking` in `BookingFormPage` calls this.
        // `BookingFormPage` has `date` in searchParams.
        // I need to update `createBooking` signature to accept `date` or fix virtual ID to include date: `virtual|YYYY-MM-DD|HH:mm:ss`

        // Let's assume for this fix that I will update `getAvailableSlots` to include date in virtual ID
        // AND `createBooking` traverses it.

        // Wait, looking at `getAvailableSlots` again:
        // `current ID: virtual|${timeString}`

        // I should change logic in `createBooking` to expects `slotId` to be EITHER UUID OR `virtual|DATE|TIME`.
    }

    // Checking `BookingFormPage` (lines 127-133 in previous view), it passes `slotId` from searchParams.
    // So let's update `getAvailableSlots` ID format first to be safer: `virtual|2023-01-01|09:00:00`

    // ...

    // Let's rewrite `createBooking` assuming we fix ID format.

    if (bookingData.slotId.startsWith('virtual|')) {
        const parts = bookingData.slotId.split('|')
        // parts[1] = date, parts[2] = time
        // Actually, let's fix `getAvailableSlots` in next step to return `virtual|DATE|TIME`.
        // If the ID format is `virtual|TIME`, we are missing the date unless we look at `time_slots` logic again.

        // Correction: `createBooking` receives `slotId`.
        // If I update `getAvailableSlots` to return `virtual|YYYY-MM-DD|HH:mm:ss`, then I can parse it here.

        if (parts.length === 3) {
            const date = parts[1]
            const startTime = parts[2]

            const { data: appointment } = await supabase
                .from('appointments')
                .select('duration')
                .eq('id', bookingData.appointmentId)
                .single()

            if (!appointment) return { error: 'Appointment not found' }

            const startDate = parse(startTime, 'HH:mm:ss', new Date())
            const endDate = addMinutes(startDate, appointment.duration)
            const endTime = format(endDate, 'HH:mm:ss')

            // Create the slot
            const { data: newSlot, error: createError } = await supabase
                .from('time_slots')
                .insert({
                    appointment_id: bookingData.appointmentId,
                    slot_date: date,
                    start_time: startTime,
                    end_time: endTime,
                    total_capacity: 1, // Default to 1 for now
                    available_capacity: 1
                })
                .select()
                .single()

            if (createError) {
                // Maybe it was created by another request just now?
                // Try to fetch it
                const { data: existing } = await supabase
                    .from('time_slots')
                    .select('id, available_capacity')
                    .eq('appointment_id', bookingData.appointmentId)
                    .eq('slot_date', date)
                    .eq('start_time', startTime)
                    .single()

                if (existing) {
                    realSlotId = existing.id
                } else {
                    return { error: 'Failed to create time slot' }
                }
            } else {
                realSlotId = newSlot.id
            }
        }
    }

    // Check availability (using realSlotId)
    const { data: slot } = await supabase
        .from('time_slots')
        .select('available_capacity')
        .eq('id', realSlotId)
        .single()

    if (!slot || (slot.available_capacity ?? 0) < bookingData.capacityCount) {
        return { error: 'Slot not available' }
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            appointment_id: bookingData.appointmentId,
            user_id: bookingData.userId,
            slot_id: realSlotId,
            guest_count: bookingData.capacityCount,
            status: 'pending',
        })
        .select()
        .single()

    if (bookingError) {
        return { error: bookingError.message }
    }

    // Save answers
    if (bookingData.answers.length > 0) {
        const answers = bookingData.answers.map(a => ({
            booking_id: booking.id,
            question_id: a.questionId,
            answer_text: a.answer,
        }))

        await supabase.from('booking_answers').insert(answers)
    }

    // Decrement capacity
    await supabase.rpc('decrement_slot_capacity', {
        p_slot_id: realSlotId,
    })

    return { success: true, bookingId: booking.id }
}

export async function cancelBooking(bookingId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function getUserBookings(userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      appointments (
        title,
        location
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
        console.error('Error fetching bookings:', error)
        return []
    }

    return data || []
}