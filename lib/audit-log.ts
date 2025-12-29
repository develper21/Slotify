import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'
import { eq, and, desc } from 'drizzle-orm'

export async function logAudit(
    { title, message, type = 'info', metadata = {} }: {
        title: string
        message: string
        type?: string
        metadata?: any
    }
) {
    try {
        const session = await getSession()
        if (!session?.user?.id) return

        await db.insert(notifications).values({
            userId: session.user.id,
            title,
            message,
            type,
            metadata: JSON.stringify(metadata),
        })
    } catch (error) {
        console.error('Error logging audit:', error)
    }
}

export async function getUserAuditLogs(userId: string) {
    try {
        return await db.query.notifications.findMany({
            where: eq(notifications.userId, userId),
            orderBy: [desc(notifications.createdAt)],
        })
    } catch (error) {
        console.error('Error fetching user audit logs:', error)
        return []
    }
}

export async function getResourceAuditLogs(resourceId: string, resourceType: string) {
    try {
        const logs = await db.select().from(notifications).orderBy(desc(notifications.createdAt))
        return logs.filter(log => {
            const meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata
            return meta?.resourceId === resourceId && meta?.resourceType === resourceType
        })
    } catch (error) {
        console.error('Error fetching resource audit logs:', error)
        return []
    }
}
