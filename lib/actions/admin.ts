'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * GET ALL USERS (PROFILES)
 */
export async function getAllUsers() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
        return []
    }

    return data || []
}

/**
 * UPDATE USER ROLE
 */
export async function updateUserRole(userId: string, role: 'customer' | 'organizer' | 'admin') {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

/**
 * GET ALL ORGANIZERS (PROFILES with role 'organizer')
 */
export async function getAllOrganizers() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'organizer')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching organizers:', error)
        return []
    }

    return data || []
}

/**
 * UPDATE USER STATUS
 */
export async function updateUserStatus(userId: string, status: 'active' | 'suspended') {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/admin')
    return { success: true }
}

/**
 * APPROVE ORGANIZER
 */
export async function approveOrganizer(userId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({
            role: 'organizer',
            status: 'active'
        })
        .eq('id', userId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/admin')
    return { success: true }
}

/**
 * DISABLE ORGANIZER
 */
export async function disableOrganizer(userId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' })
        .eq('id', userId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/admin')
    return { success: true }
}

/**
 * GET SYSTEM STATISTICS
 */
export async function getSystemStats() {
    const supabase = createClient()

    // Total profiles
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // Total organizers
    const { count: totalOrganizers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'organizer')

    // Total appointments
    const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })

    // Total bookings
    const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

    // Extended Stats for Mockup
    const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    const { count: confirmedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed')

    return {
        totalUsers: totalUsers || 0,
        totalOrganizers: totalOrganizers || 0,
        totalAppointments: totalAppointments || 0,
        totalBookings: totalBookings || 0,
        activeUsers: activeUsers || 0,
        approvedOrganizers: totalOrganizers || 0,
        publishedAppointments: totalAppointments || 0,
        confirmedBookings: confirmedBookings || 0,
    }
}
