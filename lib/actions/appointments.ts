'use server'

import { db } from '@/lib/db'
import { appointments, bookings, profiles } from '@/lib/db/schema'
import { eq, and, or, ilike, gte, lte, ne, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redis } from '@/lib/redis'

export async function getPublishedAppointments(searchQuery?: string) {
    try {
        const results = await db.query.appointments.findMany({
            where: and(
                eq(appointments.isActive, true),
                searchQuery
                    ? or(
                        ilike(appointments.title, `%${searchQuery}%`),
                        ilike(appointments.description, `%${searchQuery}%`)
                    )
                    : undefined
            ),
            with: {
                organizer: {
                    columns: {
                        businessName: true,
                        avatarUrl: true,
                        fullName: true,
                        role: true,
                    }
                }
            },
            orderBy: (appointments, { desc }) => [desc(appointments.createdAt)]
        })

        return results
    } catch (error) {
        console.error('Error fetching appointments:', error)
        return []
    }
}

export async function getAppointmentById(id: string) {
    try {
        const result = await db.query.appointments.findFirst({
            where: eq(appointments.id, id),
            with: {
                organizer: {
                    columns: {
                        businessName: true,
                        businessDescription: true,
                        avatarUrl: true,
                        fullName: true,
                        websiteUrl: true,
                    }
                }
            }
        })

        return result
    } catch (error) {
        console.error('Error fetching appointment:', error)
        return null
    }
}

export async function getBookingQuestions(appointmentId: string) {
    try {
        const result = await db.query.appointments.findFirst({
            where: eq(appointments.id, appointmentId),
            columns: {
                questions: true,
            }
        })

        const questions = result?.questions || []
        return Array.isArray(questions) ? questions : []
    } catch (error) {
        console.error('Error fetching questions:', error)
        return []
    }
}

export async function getAvailableSlots(appointmentId: string, date: string) {
    try {
        const appointment = await db.query.appointments.findFirst({
            where: eq(appointments.id, appointmentId),
            columns: {
                duration: true,
                maxCapacity: true,
                availability: true,
            }
        })

        if (!appointment) return []

        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        const availability = appointment.availability as any
        const dayConfig = availability?.[dayName]

        if (!dayConfig || !dayConfig.active || !dayConfig.slots) return []

        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const existingBookings = await db.query.bookings.findMany({
            where: and(
                eq(bookings.appointmentId, appointmentId),
                gte(bookings.startTime, startOfDay),
                lte(bookings.startTime, endOfDay),
                ne(bookings.status, 'cancelled')
            ),
            columns: {
                startTime: true,
                endTime: true,
            }
        })

        const slots = []
        const duration = appointment.duration || 60
        const maxCapacity = appointment.maxCapacity || 1

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

                const overlappingCount = existingBookings.filter((b: any) => {
                    const bStart = new Date(b.startTime).toISOString()
                    const bEnd = new Date(b.endTime).toISOString()
                    return (currentSlotStart < bEnd && currentSlotEnd > bStart)
                }).length

                if (overlappingCount < maxCapacity) {
                    slots.push({
                        id: currentSlotStart,
                        startTime: currentSlotStart,
                        endTime: currentSlotEnd,
                        availableCapacity: maxCapacity - overlappingCount,
                        maxCapacity: maxCapacity
                    })
                }
                currentTime = new Date(currentTime.getTime() + duration * 60000)
            }
        }

        return slots
    } catch (error) {
        console.error('Error getting available slots:', error)
        return []
    }
}

export async function createBooking(bookingData: {
    appointmentId: string
    userId: string
    slotId: string
    answers: any
}) {
    const lockKey = `lock:booking:${bookingData.appointmentId}:${bookingData.slotId}`
    let lockAcquired = false

    try {
        if (process.env.UPSTASH_REDIS_REST_URL) {
            const result = await redis.set(lockKey, 'locked', { nx: true, ex: 15 })
            if (!result) {
                return { success: false, message: 'Slot is currently being booked by another user. Please try again in a few seconds.' }
            }
            lockAcquired = true
        }

        const appointment = await db.query.appointments.findFirst({
            where: eq(appointments.id, bookingData.appointmentId),
            columns: {
                title: true,
                duration: true,
                price: true,
                maxCapacity: true,
            }
        })

        if (!appointment) {
            return { success: false, message: 'Appointment not found' }
        }

        const startTime = new Date(bookingData.slotId)
        const endTime = new Date(startTime.getTime() + (appointment.duration || 60) * 60000)

        const existingCountResult = await db.select({ count: sql<number>`count(*)` })
            .from(bookings)
            .where(
                and(
                    eq(bookings.appointmentId, bookingData.appointmentId),
                    eq(bookings.startTime, startTime),
                    ne(bookings.status, 'cancelled')
                )
            )

        const existingCount = Number(existingCountResult[0]?.count || 0)

        if (existingCount >= (appointment.maxCapacity || 1)) {
            return { success: false, message: 'Sorry, this slot just got fully booked.' }
        }

        const isPaid = Number(appointment.price || 0) > 0
        const initialStatus = isPaid ? 'pending_payment' : 'confirmed'

        const [newBooking] = await db.insert(bookings).values({
            appointmentId: bookingData.appointmentId,
            customerId: bookingData.userId,
            startTime: startTime,
            endTime: endTime,
            answers: bookingData.answers,
            totalPrice: appointment.price || '0.00',
            status: initialStatus as any
        }).returning()

        revalidatePath('/dashboard/bookings')

        return {
            success: true,
            bookingId: newBooking.id,
            requiresPayment: isPaid,
            price: appointment.price,
            title: appointment.title
        }

    } catch (err: any) {
        console.error('Race condition check or booking failed:', err)
        return { success: false, message: 'An error occurred during booking. Please try again.' }
    } finally {
        if (lockAcquired) {
            await redis.del(lockKey)
        }
    }
}

export async function getUserBookings(userId: string) {
    try {
        const results = await db.query.bookings.findMany({
            where: eq(bookings.customerId, userId),
            with: {
                appointment: {
                    with: {
                        organizer: {
                            columns: {
                                businessName: true
                            }
                        }
                    }
                }
            },
            orderBy: (bookings, { desc }) => [desc(bookings.startTime)]
        })

        return results
    } catch (error) {
        console.error('Error fetching user bookings:', error)
        return []
    }
}

export async function cancelBooking(bookingId: string) {
    try {
        await db.update(bookings)
            .set({ status: 'cancelled' })
            .where(eq(bookings.id, bookingId))

        revalidatePath('/dashboard/bookings')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}