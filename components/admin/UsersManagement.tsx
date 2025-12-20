'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getAllUsers, updateUserStatus, updateUserRole } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface User {
    id: string
    full_name: string
    email: string
    role: string
    status: string
    created_at: string
}

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setIsLoading(true)
        try {
            const data = await getAllUsers()
            setUsers(data as User[])
        } catch (error) {
            toast.error('Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
        try {
            const result = await updateUserStatus(userId, newStatus)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
                loadUsers()
            }
        } catch (error) {
            toast.error('Failed to update user status')
        }
    }

    const handleRoleChange = async (userId: string, newRole: 'customer' | 'organizer' | 'admin') => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            return
        }

        try {
            const result = await updateUserRole(userId, newRole)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('User role updated')
                loadUsers()
            }
        } catch (error) {
            toast.error('Failed to update user role')
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Users Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-neutral-500 py-8">Loading users...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users Management ({users.length} total)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200">
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Role</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Joined</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="py-3 px-4">{user.full_name}</td>
                                    <td className="py-3 px-4 text-neutral-600">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                            className="px-3 py-1 rounded border border-neutral-300 text-sm"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="organizer">Organizer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                                            {user.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-neutral-600 text-sm">
                                        {formatDate(new Date(user.created_at))}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Button
                                            size="sm"
                                            variant={user.status === 'active' ? 'danger' : 'secondary'}
                                            onClick={() => handleStatusChange(
                                                user.id,
                                                user.status === 'active' ? 'inactive' : 'active'
                                            )}
                                        >
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
