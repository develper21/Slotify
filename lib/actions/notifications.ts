'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotifications(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) return []
    return data
}

export async function markAsRead(notificationId: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

    if (error) return { success: false }
    revalidatePath('/dashboard')
    return { success: true }
}

export async function markAllAsRead(userId: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)

    if (error) return { success: false }
    revalidatePath('/dashboard')
    return { success: true }
}
