'use server'

import { db } from '@/lib/db'
import { appointments, bookings, profiles, bookingQuestions, schedules } from '@/lib/db/schema'
import { eq, and, or, ilike, gte, ne, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getOrganizerId(userId: string) {
    return userId
}

export async function getOrganizerAppointments(organizerId: string, searchQuery?: string) {
    try {
        const results = await db.query.appointments.findMany({
            where: and(
                eq(appointments.organizerId, organizerId),
                searchQuery
                    ? or(
                        ilike(appointments.title, `%${searchQuery}%`),
                        ilike(appointments.description, `%${searchQuery}%`)
                    )
                    : undefined
            ),
            orderBy: (appointments, { desc }) => [desc(appointments.createdAt)]
        })
        return results
    } catch (error) {
        console.error('Error fetching organizer appointments:', error)
        return []
    }
}

export async function createAppointment(organizerId: string, data: {
    title: string
    description?: string
    duration: number
    locationDetails?: string
    imageUrl?: string
    price?: number
}) {
    try {
        const [appointment] = await db.insert(appointments).values({
            organizerId: organizerId,
            title: data.title,
            description: data.description,
            duration: data.duration || 60,
            locationDetails: data.locationDetails || 'Online',
            imageUrl: data.imageUrl,
            price: (data.price || 0).toString(),
            isActive: true
        }).returning()

        revalidatePath('/dashboard')
        return { success: true, appointmentId: appointment.id }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function updateAppointment(appointmentId: string, data: any) {
    try {
        await db.update(appointments)
            .set(data)
            .where(eq(appointments.id, appointmentId))

        revalidatePath('/dashboard')
        revalidatePath(`/appointments/${appointmentId}/edit`)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function toggleActiveStatus(appointmentId: string, currentStatus: boolean) {
    try {
        await db.update(appointments)
            .set({ isActive: !currentStatus })
            .where(eq(appointments.id, appointmentId))

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function deleteAppointment(appointmentId: string) {
    try {
        await db.delete(appointments)
            .where(eq(appointments.id, appointmentId))

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function getAppointmentForEdit(appointmentId: string) {
    try {
        const result = await db.query.appointments.findFirst({
            where: eq(appointments.id, appointmentId),
            with: {
                schedules: true,
                questions: true
            }
        })
        return result
    } catch (error) {
        console.error('Error fetching appointment:', error)
        return null
    }
}

export async function upsertBookingQuestions(appointmentId: string, questions: any[]) {
    try {
        await db.update(appointments)
            .set({ questions })
            .where(eq(appointments.id, appointmentId))

        revalidatePath(`/appointments/${appointmentId}/edit`)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function createBookingQuestion(appointmentId: string, data: any) {
    try {
        await db.insert(bookingQuestions).values({
            appointmentId: appointmentId,
            ...data
        })

        revalidatePath(`/dashboard/appointments/${appointmentId}/questions`)
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updateBookingQuestion(questionId: string, data: any) {
    try {
        await db.update(bookingQuestions)
            .set(data)
            .where(eq(bookingQuestions.id, questionId))

        revalidatePath('/dashboard/appointments')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteBookingQuestion(questionId: string) {
    try {
        await db.delete(bookingQuestions)
            .where(eq(bookingQuestions.id, questionId))

        revalidatePath('/dashboard/appointments')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updateAppointmentSettings(appointmentId: string, data: any) {
    return updateAppointment(appointmentId, data)
}

export async function upsertSchedule(appointmentId: string, schedulesData: any[]) {
    try {
        await db.delete(schedules)
            .where(eq(schedules.appointmentId, appointmentId))

        if (schedulesData.length > 0) {
            await db.insert(schedules).values(
                schedulesData.map(s => ({
                    appointmentId: appointmentId,
                    dayOfWeek: s.day_of_week,
                    isWorkingDay: s.is_working_day,
                    startTime: s.start_time,
                    endTime: s.end_time
                }))
            )
        }

        revalidatePath(`/dashboard/appointments/${appointmentId}/schedule`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getOrganizerStats(organizerId: string) {
    try {
        const totalAppointments = await db.select({ count: sql<number>`count(*)` })
            .from(appointments)
            .where(eq(appointments.organizerId, organizerId))

        const publishedAppointments = await db.select({ count: sql<number>`count(*)` })
            .from(appointments)
            .where(and(eq(appointments.organizerId, organizerId), eq(appointments.isActive, true)))

        const totalBookings = await db.select({ count: sql<number>`count(*)` })
            .from(bookings)
            .innerJoin(appointments, eq(bookings.appointmentId, appointments.id))
            .where(eq(appointments.organizerId, organizerId))

        const upcomingBookings = await db.select({ count: sql<number>`count(*)` })
            .from(bookings)
            .innerJoin(appointments, eq(bookings.appointmentId, appointments.id))
            .where(and(
                eq(appointments.organizerId, organizerId),
                gte(bookings.startTime, new Date()),
                ne(bookings.status, 'cancelled')
            ))

        return {
            totalAppointments: Number(totalAppointments[0]?.count || 0),
            publishedAppointments: Number(publishedAppointments[0]?.count || 0),
            totalBookings: Number(totalBookings[0]?.count || 0),
            upcomingBookings: Number(upcomingBookings[0]?.count || 0),
        }
    } catch (error) {
        console.error('Error fetching organizer stats:', error)
        return {
            totalAppointments: 0,
            publishedAppointments: 0,
            totalBookings: 0,
            upcomingBookings: 0,
        }
    }
}

export async function updateAppointmentAvailability(appointmentId: string, schedulesData: any[]) {
    try {
        const availability: any = {}
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

        schedulesData.forEach(s => {
            const dayName = days[s.dayOfWeek]
            availability[dayName] = {
                active: !!s.isWorkingDay,
                slots: !!s.isWorkingDay ? [{ start: s.startTime, end: s.endTime }] : []
            }
        })

        await db.update(appointments)
            .set({ availability })
            .where(eq(appointments.id, appointmentId))

        revalidatePath(`/dashboard/appointments/${appointmentId}/schedule`)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function getOrganizerRecentBookings(organizerId: string, limit: number = 10) {
    try {
        const results = await db.query.bookings.findMany({
            with: {
                appointment: true,
                customer: {
                    columns: {
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
            limit: limit
        })

        // Filter by organizerId through appointment relation
        return results.filter(b => b.appointment.organizerId === organizerId)
    } catch (error) {
        console.error('Error fetching recent bookings:', error)
        return []
    }
}

export async function getOrganizerBookingsChartData(organizerId: string) {
    try {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const results = await db.query.bookings.findMany({
            where: (bookings, { gte }) => gte(bookings.createdAt, thirtyDaysAgo),
            with: {
                appointment: true
            }
        })

        const filtered = results.filter(b => b.appointment.organizerId === organizerId)

        const grouped: { [key: string]: number } = {}
        filtered.forEach((booking: any) => {
            const date = new Date(booking.createdAt).toISOString().split('T')[0]
            grouped[date] = (grouped[date] || 0) + 1
        })

        const chartData = Object.entries(grouped).map(([date, count]) => ({
            date,
            bookings: count,
        })).sort((a, b) => a.date.localeCompare(b.date))

        return chartData
    } catch (error) {
        console.error('Error fetching chart data:', error)
        return []
    }
}
