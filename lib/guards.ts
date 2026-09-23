import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { appointments, bookings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Centralized authorization guards (Layer 3 of RBAC defense).
 * These run inside server actions / server components so that even if
 * proxy.ts (edge) is bypassed, no unauthorized mutation can happen.
 */

export async function requireUser() {
    const session = await getSession()
    if (!session?.user?.id) {
        redirect('/login')
    }
    return session
}

export async function requireOrganizer() {
    const session = await requireUser()
    const role = session.user?.role
    if (role !== 'organizer' && role !== 'admin') {
        redirect('/dashboard')
    }
    return session
}

export async function requireAdmin() {
    const session = await requireUser()
    if (session.user?.role !== 'admin') {
        redirect('/dashboard')
    }
    return session
}

/** Returns true if the current session is the given user or an admin. */
export async function isSelfOrAdmin(userId: string) {
    const session = await getSession()
    if (!session?.user?.id) return false
    return session.user.id === userId || session.user.role === 'admin'
}

/** Ensures the caller owns the appointment (admins bypass). Throws if not. */
export async function assertAppointmentOwnership(appointmentId: string) {
    const session = await requireUser()
    if (session.user.role === 'admin') return session

    const apt = await db.query.appointments.findFirst({
        where: eq(appointments.id, appointmentId),
        columns: { organizerId: true },
    })

    if (!apt || apt.organizerId !== session.user.id) {
        throw new Error('Unauthorized: You do not have access to this appointment.')
    }
    return session
}

/** Ensures the caller is the booking's customer, the appointment's organizer, or an admin. */
export async function assertBookingAccess(bookingId: string) {
    const session = await requireUser()

    const booking = await db.query.bookings.findFirst({
        where: eq(bookings.id, bookingId),
        columns: { customerId: true },
        with: {
            appointment: {
                columns: { organizerId: true },
            },
        },
    })

    if (!booking) {
        throw new Error('Booking not found.')
    }

    const isCustomer = booking.customerId === session.user.id
    const isOrganizerOfAppointment = booking.appointment?.organizerId === session.user.id
    const isAdmin = session.user.role === 'admin'

    if (!isCustomer && !isOrganizerOfAppointment && !isAdmin) {
        throw new Error('Unauthorized: You do not have access to this booking.')
    }

    return { session, booking }
}
