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
    fullName: string | null
    email: string | null
    role: string | null
    status: string | null
    createdAt: Date | null
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

    const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
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
            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white">Users Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-neutral-400 py-8">Loading users...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-mongodb-slate/50 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-white">Users Management ({users.length} total)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-800">
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Role</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Joined</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                                    <td className="py-3 px-4 text-white">{user.fullName}</td>
                                    <td className="py-3 px-4 text-neutral-400">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={user.role || 'customer'}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                                            className="px-3 py-1 rounded border border-neutral-700 bg-neutral-900 text-white text-sm focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring outline-none">
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
                                    <td className="py-3 px-4 text-neutral-400 text-sm">
                                        {user.createdAt ? formatDate(user.createdAt) : '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Button
                                            size="sm"
                                            variant={user.status === 'active' ? 'danger' : 'secondary'}
                                            onClick={() => handleStatusChange(
                                                user.id,
                                                user.status === 'active' ? 'suspended' : 'active'
                                            )}
                                            className={user.status === 'active' ? "" : "bg-neutral-800 text-white hover:bg-neutral-700"}>
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
