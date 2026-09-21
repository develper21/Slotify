'use server'

import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getNotifications(userId: string) {
    try {
        const results = await db.query.notifications.findMany({
            where: eq(notifications.userId, userId),
            orderBy: [desc(notifications.createdAt)],
            limit: 20
        })
        return results
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return []
    }
}

export async function markAsRead(notificationId: string) {
    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, notificationId))

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error marking notification as read:', error)
        return { success: false }
    }
}

export async function markAllAsRead(userId: string) {
    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId))

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error marking all notifications as read:', error)
        return { success: false }
    }
}
