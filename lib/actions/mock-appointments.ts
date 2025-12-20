import { mockAppointments, mockTimeSlots, mockBookingQuestions } from '@/lib/data/mock'

export async function getPublishedAppointments(searchQuery?: string) {
    let appointments = mockAppointments.filter(apt => apt.published && apt.booking_enabled)
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase()
        appointments = appointments.filter(apt => 
            apt.title.toLowerCase().includes(query) || 
            apt.description?.toLowerCase().includes(query)
        )
    }
    
    return appointments
}

export async function getAppointmentById(id: string) {
    const appointment = mockAppointments.find(apt => apt.id === id)
    return appointment || null
}

export async function getAvailableSlots(appointmentId: string, date: string) {
    const slots = mockTimeSlots.filter(slot => 
        slot.appointment_id === appointmentId && 
        slot.slot_date === date && 
        (slot.available_capacity ?? 0) > 0
    )
    return slots
}

export async function getBookingQuestions(appointmentId: string) {
    const questions = mockBookingQuestions.filter(q => q.appointment_id === appointmentId)
    return questions.sort((a, b) => a.order_index - b.order_index)
}

export async function createBooking(bookingData: {
    appointmentId: string
    userId: string
    slotId: string
    capacityCount: number
    answers: { questionId: string; answer: string }[]
}) {
    // Mock booking creation
    const booking = {
        id: Date.now().toString(),
        appointment_id: bookingData.appointmentId,
        user_id: bookingData.userId,
        slot_id: bookingData.slotId,
        guest_count: bookingData.capacityCount,
        status: 'pending' as const,
        customer_notes: null,
        booking_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
    
    // Simulate success
    return { success: true, bookingId: booking.id }
}

export async function cancelBooking(bookingId: string) {
    // Mock booking cancellation
    return { success: true }
}

export async function getUserBookings(userId: string) {
    // Mock user bookings - return empty for now
    return []
}
