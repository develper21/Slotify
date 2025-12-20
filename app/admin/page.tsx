import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSystemStats } from '@/lib/actions/admin'
import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Users, Building2, Calendar, CheckCircle, UserCheck, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import UsersManagement from '@/components/admin/UsersManagement'
import OrganizersManagement from '@/components/admin/OrganizersManagement'

async function SystemStats() {
    const stats = await getSystemStats()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Total Users</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalUsers}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.activeUsers} active</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Organizers</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalOrganizers}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.approvedOrganizers} approved</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Appointments</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalAppointments}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.publishedAppointments} published</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Bookings</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalBookings}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.confirmedBookings} confirmed</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default async function AdminDashboard() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is admin
    const { data: userData }: { data: { role?: string } | null } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-900">
                                Admin Dashboard
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                System overview and management
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-primary-600" />
                            <span className="text-sm font-medium text-neutral-700">Administrator</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <Card key={i}>
                                <CardContent className="py-6">
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                }>
                    <SystemStats />
                </Suspense>

                {/* Management Tabs */}
                <Tabs defaultValue="users">
                    <TabsList className="mb-6">
                        <TabsTrigger value="users">
                            <Users className="w-4 h-4 mr-2" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="organizers">
                            <Building2 className="w-4 h-4 mr-2" />
                            Organizers
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <Suspense fallback={
                            <Card>
                                <CardContent className="py-12">
                                    <Skeleton className="h-64 w-full" />
                                </CardContent>
                            </Card>
                        }>
                            <UsersManagement />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="organizers">
                        <Suspense fallback={
                            <Card>
                                <CardContent className="py-12">
                                    <Skeleton className="h-64 w-full" />
                                </CardContent>
                            </Card>
                        }>
                            <OrganizersManagement />
                        </Suspense>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
