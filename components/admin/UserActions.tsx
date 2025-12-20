'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { updateUserRole, updateUserStatus } from '@/lib/actions/admin'
import { toast } from 'sonner'

export function UserActions({
    userId,
    currentRole,
    currentStatus,
}: {
    userId: string
    currentRole: string
    currentStatus: string
}) {
    const [loading, setLoading] = useState(false)

    const handleRoleChange = async (newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            return
        }

        setLoading(true)
        const result = await updateUserRole(userId, newRole as any)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('User role updated successfully')
            window.location.reload()
        }

        setLoading(false)
    }

    const handleStatusToggle = async () => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

        setLoading(true)
        const result = await updateUserStatus(userId, newStatus)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
            window.location.reload()
        }

        setLoading(false)
    }

    return (
        <div className="flex items-center gap-2">
            <Select
                options={[
                    { value: 'customer', label: 'Customer' },
                    { value: 'organizer', label: 'Organizer' },
                    { value: 'admin', label: 'Admin' },
                ]}
                value={currentRole}
                onChange={handleRoleChange}
                disabled={loading}
            />
            <Button
                variant={currentStatus === 'active' ? 'danger' : 'secondary'}
                size="sm"
                onClick={handleStatusToggle}
                isLoading={loading}
            >
                {currentStatus === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
        </div>
    )
}
