import { beforeEach, describe, expect, it, jest } from '@jest/globals'

type BookingAccessRecord = {
    customerId: string
    appointment: { organizerId: string } | null
}

const mockGetSession = jest.fn<() => Promise<unknown>>()
const mockFindAppointment = jest.fn<() => Promise<{ organizerId: string } | undefined>>()
const mockFindBooking = jest.fn<() => Promise<BookingAccessRecord | undefined>>()

jest.doMock('next/navigation', () => ({
    redirect: jest.fn((url: string) => {
        throw new Error(`NEXT_REDIRECT:${url}`)
    }),
}))

jest.doMock('@/lib/auth', () => ({
    getSession: mockGetSession,
}))

jest.doMock('@/lib/db', () => ({
    db: {
        query: {
            appointments: { findFirst: mockFindAppointment },
            bookings: { findFirst: mockFindBooking },
        },
    },
}))

const { getSession } = require('@/lib/auth') as typeof import('@/lib/auth')
const { db } = require('@/lib/db') as typeof import('@/lib/db')
const {
    assertAppointmentOwnership,
    assertBookingAccess,
    isSelfOrAdmin,
    requireAdmin,
    requireOrganizer,
    requireUser,
} = require('@/lib/guards') as typeof import('@/lib/guards')

describe('server authorization guards', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockGetSession.mockResolvedValue({ user: { id: 'current-user', role: 'organizer' } })
    })

    it('requires a signed-in user', async () => {
        mockGetSession.mockResolvedValue(null)

        await expect(requireUser()).rejects.toThrow('NEXT_REDIRECT:/login')
    })

    it('allows organizers and admins through the organizer guard', async () => {
        await expect(requireOrganizer()).resolves.toMatchObject({ user: { role: 'organizer' } })

        mockGetSession.mockResolvedValue({ user: { id: 'admin-user', role: 'admin' } })
        await expect(requireOrganizer()).resolves.toMatchObject({ user: { role: 'admin' } })
    })

    it('rejects customers from organizer and admin guards', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'customer', role: 'customer' } })
        await expect(requireOrganizer()).rejects.toThrow('NEXT_REDIRECT:/dashboard')

        await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT:/dashboard')
    })

    it('allows only admins through the admin guard', async () => {
        mockGetSession.mockResolvedValue({ user: { id: 'admin-user', role: 'admin' } })

        await expect(requireAdmin()).resolves.toMatchObject({ user: { role: 'admin' } })
    })

    it('recognizes the same user or an admin as authorized for a user record', async () => {
        await expect(isSelfOrAdmin('current-user')).resolves.toBe(true)
        await expect(isSelfOrAdmin('another-user')).resolves.toBe(false)

        mockGetSession.mockResolvedValue({ user: { id: 'admin-user', role: 'admin' } })
        await expect(isSelfOrAdmin('another-user')).resolves.toBe(true)

        mockGetSession.mockResolvedValue(null)
        await expect(isSelfOrAdmin('current-user')).resolves.toBe(false)
    })

    it('allows an appointment owner or admin and rejects other users', async () => {
        mockFindAppointment.mockResolvedValue({ organizerId: 'current-user' })
        await expect(assertAppointmentOwnership('appointment-1')).resolves.toMatchObject({
            user: { id: 'current-user' },
        })

        mockFindAppointment.mockResolvedValue({ organizerId: 'other-user' })
        await expect(assertAppointmentOwnership('appointment-1')).rejects.toThrow('Unauthorized')

        mockGetSession.mockResolvedValue({ user: { id: 'admin-user', role: 'admin' } })
        await expect(assertAppointmentOwnership('appointment-1')).resolves.toMatchObject({
            user: { role: 'admin' },
        })
        expect(mockFindAppointment).toHaveBeenCalledTimes(2)
    })

    it('allows booking customers, appointment organizers, and admins', async () => {
        mockFindBooking.mockResolvedValue({
            customerId: 'current-user',
            appointment: { organizerId: 'appointment-owner' },
        })
        await expect(assertBookingAccess('booking-1')).resolves.toMatchObject({
            booking: { customerId: 'current-user' },
        })

        mockGetSession.mockResolvedValue({ user: { id: 'appointment-owner', role: 'organizer' } })
        await expect(assertBookingAccess('booking-1')).resolves.toBeDefined()

        mockGetSession.mockResolvedValue({ user: { id: 'admin-user', role: 'admin' } })
        await expect(assertBookingAccess('booking-1')).resolves.toBeDefined()
    })

    it('rejects missing bookings and users without booking access', async () => {
        mockFindBooking.mockResolvedValue(undefined)
        await expect(assertBookingAccess('missing-booking')).rejects.toThrow('Booking not found.')

        mockFindBooking.mockResolvedValue({
            customerId: 'customer',
            appointment: { organizerId: 'organizer' },
        })
        mockGetSession.mockResolvedValue({ user: { id: 'unrelated-user', role: 'customer' } })
        await expect(assertBookingAccess('booking-1')).rejects.toThrow('Unauthorized')
    })
})
