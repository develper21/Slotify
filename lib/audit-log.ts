import { createClient } from '@/lib/supabase/server'

export interface AuditLogEntry {
    userId: string
    action: string
    resourceType?: string
    resourceId?: string
    oldValues?: Record<string, any>
    newValues?: Record<string, any>
    metadata?: Record<string, any>
    ipAddress?: string
    userAgent?: string
}

/**
 * Log an audit entry
 */
export async function logAudit(entry: AuditLogEntry): Promise<string | null> {
    try {
        const supabase = createClient()

        const { data, error } = await (supabase.rpc as any)('log_audit', {
            p_user_id: entry.userId,
            p_action: entry.action,
            p_resource_type: entry.resourceType || null,
            p_resource_id: entry.resourceId || null,
            p_old_values: entry.oldValues ? JSON.stringify(entry.oldValues) : null,
            p_new_values: entry.newValues ? JSON.stringify(entry.newValues) : null,
            p_metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
            p_ip_address: entry.ipAddress || null,
            p_user_agent: entry.userAgent || null,
        })

        if (error) {
            console.error('Audit log error:', error)
            return null
        }

        return data
    } catch (error) {
        console.error('Audit log exception:', error)
        return null
    }
}

/**
 * Common audit actions
 */
export const AuditActions = {
    // User management
    USER_CREATED: 'user_created',
    USER_UPDATED: 'user_updated',
    USER_DELETED: 'user_deleted',
    USER_ROLE_CHANGED: 'user_role_changed',
    USER_STATUS_CHANGED: 'user_status_changed',

    // Organizer management
    ORGANIZER_APPROVED: 'organizer_approved',
    ORGANIZER_REJECTED: 'organizer_rejected',
    ORGANIZER_CREATED: 'organizer_created',
    ORGANIZER_UPDATED: 'organizer_updated',

    // Appointment management
    APPOINTMENT_CREATED: 'appointment_created',
    APPOINTMENT_UPDATED: 'appointment_updated',
    APPOINTMENT_DELETED: 'appointment_deleted',
    APPOINTMENT_PUBLISHED: 'appointment_published',
    APPOINTMENT_UNPUBLISHED: 'appointment_unpublished',

    // Booking management
    BOOKING_CREATED: 'booking_created',
    BOOKING_CONFIRMED: 'booking_confirmed',
    BOOKING_CANCELLED: 'booking_cancelled',

    // Authentication
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILED: 'login_failed',
    LOGOUT: 'logout',
    PASSWORD_RESET: 'password_reset',

    // Security
    UNAUTHORIZED_ACCESS: 'unauthorized_access',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
} as const

/**
 * Helper to log user role change
 */
export async function logUserRoleChange(
    adminId: string,
    userId: string,
    oldRole: string,
    newRole: string,
    metadata?: Record<string, any>
) {
    return logAudit({
        userId: adminId,
        action: AuditActions.USER_ROLE_CHANGED,
        resourceType: 'users',
        resourceId: userId,
        oldValues: { role: oldRole },
        newValues: { role: newRole },
        metadata,
    })
}

/**
 * Helper to log user status change
 */
export async function logUserStatusChange(
    adminId: string,
    userId: string,
    oldStatus: string,
    newStatus: string,
    metadata?: Record<string, any>
) {
    return logAudit({
        userId: adminId,
        action: AuditActions.USER_STATUS_CHANGED,
        resourceType: 'users',
        resourceId: userId,
        oldValues: { status: oldStatus },
        newValues: { status: newStatus },
        metadata,
    })
}

/**
 * Helper to log organizer approval
 */
export async function logOrganizerApproval(
    adminId: string,
    organizerId: string,
    approved: boolean,
    metadata?: Record<string, any>
) {
    return logAudit({
        userId: adminId,
        action: approved ? AuditActions.ORGANIZER_APPROVED : AuditActions.ORGANIZER_REJECTED,
        resourceType: 'organizers',
        resourceId: organizerId,
        oldValues: { approved: !approved },
        newValues: { approved },
        metadata,
    })
}

/**
 * Helper to log appointment publish/unpublish
 */
export async function logAppointmentPublish(
    organizerId: string,
    appointmentId: string,
    published: boolean,
    metadata?: Record<string, any>
) {
    return logAudit({
        userId: organizerId,
        action: published ? AuditActions.APPOINTMENT_PUBLISHED : AuditActions.APPOINTMENT_UNPUBLISHED,
        resourceType: 'appointments',
        resourceId: appointmentId,
        oldValues: { published: !published },
        newValues: { published },
        metadata,
    })
}

/**
 * Helper to log login attempts
 */
export async function logLoginAttempt(
    userId: string | null,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, any>
) {
    if (!userId) return null

    return logAudit({
        userId,
        action: success ? AuditActions.LOGIN_SUCCESS : AuditActions.LOGIN_FAILED,
        ipAddress,
        userAgent,
        metadata,
    })
}

/**
 * Helper to log unauthorized access attempts
 */
export async function logUnauthorizedAccess(
    userId: string | null,
    path: string,
    ipAddress?: string,
    userAgent?: string
) {
    if (!userId) return null

    return logAudit({
        userId,
        action: AuditActions.UNAUTHORIZED_ACCESS,
        metadata: { path },
        ipAddress,
        userAgent,
    })
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(userId: string, limit: number = 100) {
    const supabase = createClient()

    const { data, error } = await (supabase.rpc as any)('get_user_audit_logs', {
        p_user_id: userId,
        p_limit: limit,
    })

    if (error) {
        console.error('Error fetching user audit logs:', error)
        return []
    }

    return data || []
}

/**
 * Get audit logs for a resource
 */
export async function getResourceAuditLogs(
    resourceType: string,
    resourceId: string,
    limit: number = 100
) {
    const supabase = createClient()

    const { data, error } = await (supabase.rpc as any)('get_resource_audit_logs', {
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_limit: limit,
    })

    if (error) {
        console.error('Error fetching resource audit logs:', error)
        return []
    }

    return data || []
}
