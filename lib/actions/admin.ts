'use server'

import { db } from '@/lib/db'
import { profiles, appointments, bookings } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getAllUsers() {
    try {
        const results = await db.query.profiles.findMany({
            orderBy: (profiles, { desc }) => [desc(profiles.createdAt)]
        })
        return results
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

export async function updateUserRole(userId: string, role: 'customer' | 'organizer' | 'admin') {
    try {
        await db.update(profiles)
            .set({ role })
            .where(eq(profiles.id, userId))

        revalidatePath('/admin')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getAllOrganizers() {
    try {
        const results = await db.query.profiles.findMany({
            where: eq(profiles.role, 'organizer'),
            orderBy: (profiles, { desc }) => [desc(profiles.createdAt)]
        })
        return results
    } catch (error) {
        console.error('Error fetching organizers:', error)
        return []
    }
}

export async function updateUserStatus(userId: string, status: 'active' | 'suspended') {
    try {
        await db.update(profiles)
            .set({ status })
            .where(eq(profiles.id, userId))

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function approveOrganizer(userId: string) {
    try {
        await db.update(profiles)
            .set({
                role: 'organizer',
                status: 'active'
            })
            .where(eq(profiles.id, userId))

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function disableOrganizer(userId: string) {
    try {
        await db.update(profiles)
            .set({ status: 'suspended' })
            .where(eq(profiles.id, userId))

        revalidatePath('/dashboard/admin')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getSystemStats() {
    try {
        const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(profiles)
        const totalOrganizers = await db.select({ count: sql<number>`count(*)` }).from(profiles).where(eq(profiles.role, 'organizer'))
        const totalAppointments = await db.select({ count: sql<number>`count(*)` }).from(appointments)
        const totalBookings = await db.select({ count: sql<number>`count(*)` }).from(bookings)

        return {
            totalUsers: Number(totalUsers[0]?.count || 0),
            totalOrganizers: Number(totalOrganizers[0]?.count || 0),
            totalAppointments: Number(totalAppointments[0]?.count || 0),
            totalBookings: Number(totalBookings[0]?.count || 0),
            activeUsers: Number(totalUsers[0]?.count || 0), // Placeholder logic
            approvedOrganizers: Number(totalOrganizers[0]?.count || 0),
            publishedAppointments: Number(totalAppointments[0]?.count || 0),
            confirmedBookings: Number(totalBookings[0]?.count || 0),
        }
    } catch (error) {
        console.error('Error fetching system stats:', error)
        return {
            totalUsers: 0,
            totalOrganizers: 0,
            totalAppointments: 0,
            totalBookings: 0,
            activeUsers: 0,
            approvedOrganizers: 0,
            publishedAppointments: 0,
            confirmedBookings: 0,
        }
    }
}
