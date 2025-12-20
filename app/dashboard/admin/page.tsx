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

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header - now integrated into the page flow */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-neutral-400 mt-1">
                        System overview and management
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-mongodb-spring/10 border border-mongodb-spring/20">
                    <UserCheck className="w-5 h-5 text-mongodb-spring" />
                    <span className="text-sm font-medium text-mongodb-spring">Administrator</span>
                </div>
            </div>

            {/* Stats */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="bg-mongodb-slate/50 border-neutral-800">
                            <CardContent className="py-6">
                                <Skeleton className="h-20 w-full bg-neutral-800" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            }>
                <SystemStats />
            </Suspense>

            {/* Management Tabs */}
            <Tabs defaultValue="users">
                <TabsList className="mb-6 bg-neutral-900 border border-neutral-800">
                    <TabsTrigger value="users" className="data-[state=active]:bg-mongodb-spring data-[state=active]:text-mongodb-black text-neutral-400">
                        <Users className="w-4 h-4 mr-2" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="organizers" className="data-[state=active]:bg-mongodb-spring data-[state=active]:text-mongodb-black text-neutral-400">
                        <Building2 className="w-4 h-4 mr-2" />
                        Organizers
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <Suspense fallback={
                        <Card className="bg-mongodb-slate/50 border-neutral-800">
                            <CardContent className="py-12">
                                <Skeleton className="h-64 w-full bg-neutral-800" />
                            </CardContent>
                        </Card>
                    }>
                        <UsersManagement />
                    </Suspense>
                </TabsContent>

                <TabsContent value="organizers">
                    <Suspense fallback={
                        <Card className="bg-mongodb-slate/50 border-neutral-800">
                            <CardContent className="py-12">
                                <Skeleton className="h-64 w-full bg-neutral-800" />
                            </CardContent>
                        </Card>
                    }>
                        <OrganizersManagement />
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}

async function SystemStats() {
    const stats = await getSystemStats()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Total Users</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.activeUsers} active</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Organizers</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalOrganizers}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.approvedOrganizers} approved</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Appointments</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalAppointments}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.publishedAppointments} published</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-900/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400">Bookings</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalBookings}</p>
                            <p className="text-xs text-neutral-500 mt-1">{stats.confirmedBookings} confirmed</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-900/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
