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
        return { success: false, message: error.message }
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
 * GET SYSTEM STATISTICS
 * Consolidates data from profiles, appointments, and bookings.
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

    return {
        totalUsers: totalUsers || 0,
        totalOrganizers: totalOrganizers || 0,
        totalAppointments: totalAppointments || 0,
        totalBookings: totalBookings || 0,
    }
}
