import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllUsers } from '@/lib/actions/admin'
import { DataTable } from '@/components/ui/DataTable'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'
import { format } from 'date-fns'
import { UserActions } from '@/components/admin/UserActions'

export default async function AdminUsersPage() {
    const supabase = createClient()

    // Check authentication and admin role
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    const { data: userData }: { data: { role?: string } | null } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

    if (userData?.role !== 'admin') {
        redirect('/dashboard')
    }

    // Get all users
    const users = await getAllUsers()

    // Calculate stats
    const stats = {
        total: users.length,
        active: users.filter((u: any) => u.status === 'active').length,
        customers: users.filter((u: any) => u.role === 'customer').length,
        organizers: users.filter((u: any) => u.role === 'organizer').length,
        admins: users.filter((u: any) => u.role === 'admin').length,
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        User Management
                    </h1>
                    <p className="text-neutral-600">
                        Manage all users in the system
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Total Users</p>
                                    <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                                </div>
                                <Users className="w-10 h-10 text-primary/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Active</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                                </div>
                                <UserCheck className="w-10 h-10 text-green-600/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Customers</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.customers}</p>
                                </div>
                                <Users className="w-10 h-10 text-blue-600/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Organizers</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.organizers}</p>
                                </div>
                                <Shield className="w-10 h-10 text-purple-600/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Admins</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
                                </div>
                                <Shield className="w-10 h-10 text-red-600/20" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <DataTable
                    data={users}
                    columns={[
                        {
                            key: 'full_name',
                            header: 'Name',
                            render: (user: any) => (
                                <div>
                                    <p className="font-medium text-neutral-900">{user.full_name}</p>
                                    <p className="text-xs text-neutral-500">{user.email}</p>
                                </div>
                            ),
                            sortable: true
                        },
                        {
                            key: 'role',
                            header: 'Role',
                            render: (user: any) => (
                                <Badge
                                    variant={
                                        user.role === 'admin' ? 'danger' :
                                            user.role === 'organizer' ? 'warning' :
                                                'info'
                                    }
                                >
                                    {user.role}
                                </Badge>
                            ),
                            sortable: true
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (user: any) => (
                                <Badge variant={user.status === 'active' ? 'success' : 'default'}>
                                    {user.status}
                                </Badge>
                            ),
                            sortable: true
                        },
                        {
                            key: 'phone',
                            header: 'Phone',
                            render: (user: any) => user.phone || 'N/A'
                        },
                        {
                            key: 'created_at',
                            header: 'Joined',
                            render: (user: any) => format(new Date(user.created_at), 'MMM d, yyyy'),
                            sortable: true
                        }
                    ]}
                    keyExtractor={(user: any) => user.id}
                    actions={(user: any) => (
                        <UserActions userId={user.id} currentRole={user.role} currentStatus={user.status} />
                    )}
                    emptyMessage="No users found"
                    pageSize={20}
                />
            </div>
        </div>
    )
}
