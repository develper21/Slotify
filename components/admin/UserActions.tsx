'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useConfirmDialog } from '@/components/ui/ConfirmDialog'
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
    const { confirm, confirmDialog } = useConfirmDialog()

    const handleRoleChange = async (newRole: string) => {
        if (newRole === currentRole) return

        const confirmed = await confirm({
            title: 'Change User Role',
            description: `Are you sure you want to change this user's role to ${newRole}? This takes effect immediately.`,
            confirmLabel: 'Change Role',
        })
        if (!confirmed) return

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
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active'

        const confirmed = await confirm({
            title: newStatus === 'active' ? 'Activate User' : 'Suspend User',
            description: newStatus === 'active'
                ? 'This user will be able to sign in and use the platform again.'
                : 'This user will be blocked from signing in until re-activated.',
            confirmLabel: newStatus === 'active' ? 'Activate' : 'Suspend',
        })
        if (!confirmed) return

        setLoading(true)
        const result = await updateUserStatus(userId, newStatus as any)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
            window.location.reload()
        }

        setLoading(false)
    }

    return (
        <>
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
                    isLoading={loading}>
                    {currentStatus === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
            </div>
            {confirmDialog}
        </>
    )
}
