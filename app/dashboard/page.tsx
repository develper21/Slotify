import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerAppointments, getOrganizerStats } from '@/lib/actions/organizer'
import { getSystemStats } from '@/lib/actions/admin'
import { getCustomerBookings } from '@/lib/actions/bookings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Plus, Search, Calendar, Users, TrendingUp, Clock, ArrowUpRight, Filter, Shield, Activity, User } from 'lucide-react'
import Link from 'next/link'
import AppointmentCard from '@/components/organizer/AppointmentCard'
import { formatDate } from '@/lib/utils'

// --- Organizer Components ---
async function OrganizerStats({ organizerId }: { organizerId: string }) {
    const stats = await getOrganizerStats(organizerId)
    const statCards = [
        { label: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-mongodb-spring', bg: 'bg-mongodb-spring/10' },
        { label: 'Active Slots', value: stats.publishedAppointments, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Upcoming sessions', value: stats.upcomingBookings, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat) => (
                <Card key={stat.label} hover={false} className="relative overflow-hidden group bg-mongodb-slate/50 border-neutral-800">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150`} />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-mongodb ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                +Live
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
                            <p className="text-3xl font-display font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

async function OrganizerAppointmentsList({ organizerId, searchQuery }: { organizerId: string; searchQuery?: string }) {
    const appointments = await getOrganizerAppointments(organizerId, searchQuery)

    if (appointments.length === 0) {
        return (
            <div className="text-center py-20 bg-mongodb-slate/20 border border-dashed border-neutral-700/50 rounded-mongodb">
                <Calendar className="w-16 h-16 mx-auto text-neutral-700 mb-4 opacity-30" />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                    No Appointments Yet
                </h3>
                <p className="text-neutral-400 mb-8 max-w-sm mx-auto">
                    Launch your professional booking experience by creating your first appointment slot.
                </p>
                <Link href="/dashboard/appointments/new">
                    <Button variant="primary" size="lg" className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Appointment
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map((appointment: any) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </div>
    )
}

// --- Admin Components ---
async function AdminStats() {
    const stats = await getSystemStats()
    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-mongodb-spring', bg: 'bg-mongodb-spring/10' },
        { label: 'Organizers', value: stats.totalOrganizers, icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat) => (
                <Card key={stat.label} hover={false} className="relative overflow-hidden group bg-mongodb-slate/50 border-neutral-800">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150`} />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-mongodb ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
                            <p className="text-3xl font-display font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// --- Customer Components ---
async function CustomerRecentBookings({ userId }: { userId: string }) {
    const bookings = await getCustomerBookings(userId)

    if (bookings.length === 0) {
        return (
            <div className="text-center py-20 bg-mongodb-slate/20 border border-dashed border-neutral-700/50 rounded-mongodb">
                <Calendar className="w-16 h-16 mx-auto text-neutral-700 mb-4 opacity-30" />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                    No Bookings Yet
                </h3>
                <p className="text-neutral-400 mb-6 max-w-sm mx-auto">
                    Search for experts and book your first appointment.
                </p>
                <Link href="/">
                    <Button variant="primary" className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                        Find Sessions
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Recent Appointments</h2>
            <div className="grid grid-cols-1 gap-4">
                {bookings.slice(0, 5).map((booking: any) => (
                    <Card key={booking.id} className="bg-mongodb-slate/50 border-neutral-800 hover:border-neutral-700 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-mongodb-spring/10 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-mongodb-spring" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {booking.appointment?.title || 'Appointment'}
                                    </h3>
                                    <p className="text-sm text-neutral-400">
                                        {formatDate(booking.start_time)}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={booking.status === 'confirmed' ? 'success' : 'info'}>
                                {booking.status}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-4">
                <Link href="/dashboard/bookings">
                    <Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                        View Full History
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { search?: string }
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'customer'

    if (role === 'admin') {
        return (
            <div className="container mx-auto p-2">
                <header className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white">
                        System <span className="gradient-text">Admin</span>
                    </h1>
                </header>
                <Suspense fallback={<div className="text-white">Loading stats...</div>}>
                    <AdminStats />
                </Suspense>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-mongodb-slate/50 border-neutral-800 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
                        <div className="space-y-3">
                            <Link href="/dashboard/admin/users" className="block">
                                <Button variant="outline" className="w-full justify-start border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                                    <Users className="w-4 h-4 mr-2" /> Manage Users
                                </Button>
                            </Link>
                            <Link href="/dashboard/admin/organizers" className="block">
                                <Button variant="outline" className="w-full justify-start border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                                    <Shield className="w-4 h-4 mr-2" /> Manage Organizers
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    if (role === 'customer') {
        return (
            <div className="container mx-auto p-2">
                <header className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white">
                        User <span className="gradient-text">Dashboard</span>
                    </h1>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Suspense fallback={<div className="text-white">Loading bookings...</div>}>
                            <CustomerRecentBookings userId={user.id} />
                        </Suspense>
                    </div>
                    <div>
                        <Card className="bg-mongodb-slate/50 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-white">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href="/">
                                    <Button className="w-full bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                                        <Search className="w-4 h-4 mr-2" /> Browse Appointments
                                    </Button>
                                </Link>
                                <Link href="/dashboard/profile">
                                    <Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                                        <User className="w-4 h-4 mr-2" /> Manage Profile
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Organizer View
    return (
        <div className="animate-in fade-in duration-500">
            {/* Dashboard Header */}
            <header className="bg-mongodb-slate/30 border-b border-neutral-700/50 pt-8 pb-20 rounded-xl mb-[-3rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-mongodb-spring/5 blur-3xl -mr-32 -mt-32" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-mongodb-spring animate-pulse" />
                                <span className="text-xs font-bold text-mongodb-spring uppercase tracking-widest">Organizer Mode</span>
                            </div>
                            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                                Business <span className="gradient-text">Intelligence</span>
                            </h1>
                            <p className="text-neutral-400 mt-1">
                                Monitor performance and manage your sessions.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/appointments/new">
                                <Button variant="primary" className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90 shadow-lg shadow-mongodb-spring/20">
                                    <Plus className="w-5 h-5 mr-2" />
                                    New Slot
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Suspense fallback={<div className="h-32 w-full bg-neutral-900 rounded-xl animate-pulse" />}>
                        <OrganizerStats organizerId={user.id} />
                    </Suspense>
                </div>
            </header>

            {/* Main Dashboard Content */}
            <div className="container mx-auto px-4 relative z-20">
                <Card className="mb-8 border-mongodb-spring/10 bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800 mb-6">
                        <div>
                            <CardTitle className="text-white">Your Appointments</CardTitle>
                            <CardDescription className="text-neutral-400">Quickly filter and manage your booking types.</CardDescription>
                        </div>
                        <div className="w-full md:w-96 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Filter by title..."
                                defaultValue={searchParams.search}
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-mongodb-black border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-mongodb-spring transition-all"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="space-y-4 animate-pulse">
                                        <Skeleton className="h-48 w-full rounded-mongodb bg-neutral-800" />
                                        <Skeleton className="h-6 w-3/4 bg-neutral-800" />
                                    </div>
                                ))}
                            </div>
                        }>
                            <OrganizerAppointmentsList organizerId={user.id} searchQuery={searchParams.search} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
