import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAllUsers } from '@/lib/actions/admin'
import { DataTable } from '@/components/ui/DataTable'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, UserCheck, UserX, Shield } from 'lucide-react'
import { format } from 'date-fns'
import { UserActions } from '@/components/admin/UserActions'

export default async function AdminUsersPage() {
    const session = await getSession()

    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard')
    }

    const users = await getAllUsers()

    const stats = {
        total: users.length,
        active: users.filter((u: any) => u.status === 'active').length,
        customers: users.filter((u: any) => u.role === 'customer').length,
        organizers: users.filter((u: any) => u.role === 'organizer').length,
        admins: users.filter((u: any) => u.role === 'admin').length,
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    User Management
                </h1>
                <p className="text-neutral-400">
                    Manage all users in the system
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Total Users</p>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                            </div>
                            <Users className="w-10 h-10 text-mongodb-spring/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Active</p>
                                <p className="text-2xl font-bold text-green-500">{stats.active}</p>
                            </div>
                            <UserCheck className="w-10 h-10 text-green-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Customers</p>
                                <p className="text-2xl font-bold text-blue-500">{stats.customers}</p>
                            </div>
                            <Users className="w-10 h-10 text-blue-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Organizers</p>
                                <p className="text-2xl font-bold text-purple-500">{stats.organizers}</p>
                            </div>
                            <Shield className="w-10 h-10 text-purple-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Admins</p>
                                <p className="text-2xl font-bold text-red-500">{stats.admins}</p>
                            </div>
                            <Shield className="w-10 h-10 text-red-500/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DataTable
                data={users}
                columns={[
                    {
                        key: 'fullName',
                        header: 'Name',
                        render: (user: any) => (
                            <div>
                                <p className="font-medium text-white">{user.fullName}</p>
                                <p className="text-xs text-neutral-400">{user.email}</p>
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
                                            'primary'
                                }>
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
                        key: 'createdAt',
                        header: 'Joined',
                        render: (user: any) => <span className="text-neutral-300">{user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}</span>,
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
    )
}
