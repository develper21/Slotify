'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get all users
export async function getAllUsers() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
        return []
    }

    return data || []
}

// Update user status
export async function updateUserStatus(userId: string, status: 'active' | 'inactive' | 'banned') {
    const supabase = createClient()

    const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

// Update user role
export async function updateUserRole(userId: string, role: 'customer' | 'organizer' | 'admin') {
    const supabase = createClient()

    const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

// Get all organizers
export async function getAllOrganizers() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('organizers')
        .select(`
      *,
      users (full_name, email, status)
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching organizers:', error)
        return []
    }

    return data || []
}

// Approve organizer
export async function approveOrganizer(organizerId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('organizers')
        .update({ approved: true })
        .eq('id', organizerId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

// Reject/disable organizer
export async function disableOrganizer(organizerId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('organizers')
        .update({ approved: false })
        .eq('id', organizerId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

// Get system statistics
export async function getSystemStats() {
    const supabase = createClient()

    // Total users
    const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    // Active users
    const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    // Total organizers
    const { count: totalOrganizers } = await supabase
        .from('organizers')
        .select('*', { count: 'exact', head: true })

    // Approved organizers
    const { count: approvedOrganizers } = await supabase
        .from('organizers')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true)

    // Total appointments
    const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })

    // Published appointments
    const { count: publishedAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)

    // Total bookings
    const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

    // Confirmed bookings
    const { count: confirmedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed')

    return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalOrganizers: totalOrganizers || 0,
        approvedOrganizers: approvedOrganizers || 0,
        totalAppointments: totalAppointments || 0,
        publishedAppointments: publishedAppointments || 0,
        totalBookings: totalBookings || 0,
        confirmedBookings: confirmedBookings || 0,
    }
}
