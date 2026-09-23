'use server'

import { db } from '@/lib/db'
import { bookings, appointments, profiles } from '@/lib/db/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireUser, assertBookingAccess, isSelfOrAdmin } from '@/lib/guards'

export async function getOrganizerBookings(organizerId: string, filters?: {
    status?: string
    appointmentId?: string
    startDate?: string
    endDate?: string
}) {
    try {
        const results = await db.query.bookings.findMany({
            where: (bookings, { and, eq, gte, lte }) => {
                const conditions = []

                // We need to join with appointments to filter by organizerId
                // findMany with 'with' is good, but filtering by nested relation is tricky in findMany 'where'
                // Better use db.select if nested filter is needed, or filter post-query if small data.
                // However, Drizzle findMany doesn't support filtering by 'with' relations directly in 'where'.

                if (filters?.status) conditions.push(eq(bookings.status, filters.status as any))
                if (filters?.appointmentId) conditions.push(eq(bookings.appointmentId, filters.appointmentId))
                if (filters?.startDate) conditions.push(gte(bookings.startTime, new Date(filters.startDate)))
                if (filters?.endDate) conditions.push(lte(bookings.startTime, new Date(filters.endDate)))

                return and(...conditions)
            },
            with: {
                appointment: true,
                customer: {
                    columns: {
                        fullName: true,
                        email: true,
                    }
                }
            },
            orderBy: [desc(bookings.createdAt)]
        })

        // Manual filter for organizerId since Drizzle findMany doesn't support nested where easily
        return results.filter(b => b.appointment.organizerId === organizerId)
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return []
    }
}

export async function getCustomerBookings(userId: string) {
    try {
        const results = await db.query.bookings.findMany({
            where: eq(bookings.customerId, userId),
            with: {
                appointment: true
            },
            orderBy: [desc(bookings.startTime)]
        })
        return results
    } catch (error) {
        console.error('Error fetching customer bookings:', error)
        return []
    }
}

export async function updateBookingStatus(bookingId: string, status: string) {
    try {
        // Security: only the appointment's organizer (or an admin) may change booking status
        const session = await requireUser()
        const booking = await db.query.bookings.findFirst({
            where: eq(bookings.id, bookingId),
            columns: { customerId: true },
            with: { appointment: { columns: { organizerId: true } } },
        })
        if (!booking) return { success: false, message: 'Booking not found' }

        const isOrganizer = booking.appointment?.organizerId === session.user.id
        if (!isOrganizer && session.user.role !== 'admin') {
            return { success: false, message: 'Not authorized to update this booking' }
        }

        await db.update(bookings)
            .set({ status: status as any })
            .where(eq(bookings.id, bookingId))

        revalidatePath('/dashboard/bookings')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function getBookingDetails(bookingId: string) {
    try {
        const result = await db.query.bookings.findFirst({
            where: eq(bookings.id, bookingId),
            with: {
                appointment: {
                    columns: {
                        title: true,
                        description: true,
                        locationDetails: true,
                        duration: true,
                    }
                },
                customer: {
                    columns: {
                        fullName: true,
                        email: true,
                    }
                }
            }
        })

        return result
    } catch (error) {
        console.error('Error fetching booking details:', error)
        return null
    }
}

export async function exportBookingsToCSV(organizerId: string) {
    // Security: ignore the client-supplied organizerId; export only the caller's own data
    const session = await requireUser()
    const bookingsData = await getOrganizerBookings(session.user.id)

    const headers = ['Booking ID', 'Customer Name', 'Email', 'Appointment', 'Start Time', 'Status', 'Created At']
    const rows = bookingsData.map((booking: any) => [
        booking.id,
        booking.customer?.fullName || 'N/A',
        booking.customer?.email || 'N/A',
        booking.appointment?.title || 'N/A',
        new Date(booking.startTime).toLocaleString(),
        booking.status,
        new Date(booking.createdAt).toLocaleDateString()
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    return csv
}

export async function deleteBooking(bookingId: string) {
    try {
        // Security: customer, appointment's organizer, ya admin hi delete kar sakta hai
        await assertBookingAccess(bookingId)

        await db.delete(bookings).where(eq(bookings.id, bookingId))
        revalidatePath('/dashboard/bookings')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
