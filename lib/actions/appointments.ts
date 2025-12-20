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

export async function getAvailableSlots(appointmentId: string, date: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('appointment_id', appointmentId)
        .eq('slot_date', date)
        .gt('available_capacity', 0)
        .order('start_time')

    if (error) {
        console.error('Error fetching slots:', error)
        return []
    }

    return data || []
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

export async function createBooking(bookingData: {
    appointmentId: string
    userId: string
    slotId: string
    capacityCount: number
    answers: { questionId: string; answer: string }[]
}) {
    const supabase = createClient()

    // Check availability
    const { data: slot } = await supabase
        .from('time_slots')
        .select('available_capacity')
        .eq('id', bookingData.slotId)
        .single()

    if (!slot || slot.available_capacity < bookingData.capacityCount) {
        return { error: 'Slot not available' }
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            appointment_id: bookingData.appointmentId,
            user_id: bookingData.userId,
            slot_id: bookingData.slotId,
            capacity_count: bookingData.capacityCount,
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
        p_slot_id: bookingData.slotId,
        p_amount: bookingData.capacityCount,
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