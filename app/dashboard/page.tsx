import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerId, getOrganizerAppointments, getOrganizerStats } from '@/lib/actions/organizer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Plus, Search, Calendar, Users, TrendingUp, Clock, ArrowUpRight, Filter, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import AppointmentCard from '@/components/organizer/AppointmentCard'
import { Navbar } from '@/components/Navbar'

async function DashboardStats({ organizerId }: { organizerId: string }) {
    const stats = await getOrganizerStats(organizerId)

    const statCards = [
        { label: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-mongodb-spring', bg: 'bg-mongodb-spring/10' },
        { label: 'Published Slots', value: stats.publishedAppointments, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Upcoming', value: stats.upcomingBookings, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat) => (
                <Card key={stat.label} hover={false} className="relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150`} />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-mongodb ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                +12%
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

async function AppointmentsList({ organizerId, searchQuery }: { organizerId: string; searchQuery?: string }) {
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
                <Link href="/appointments/new">
                    <Button variant="primary" size="lg">
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

export default async function OrganizerDashboard({
    searchParams,
}: {
    searchParams: { search?: string }
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: userData }: { data: { role?: string } | null } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'organizer') {
        redirect('/')
    }

    const organizerId = await getOrganizerId(user.id)

    if (!organizerId) {
        return (
            <div className="min-h-screen bg-mongodb-black flex items-center justify-center p-4">
                <Card className="max-w-md border-mongodb-spring/20">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 bg-mongodb-spring/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-mongodb-spring" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white mb-4">
                            Organizer Portal
                        </h2>
                        <p className="text-neutral-400 mb-8 leading-relaxed">
                            You need an organizer account to access the professional management dashboard.
                        </p>
                        <Link href="/">
                            <Button className="w-full">Return Home</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <>
            {/* Dashboard Header */}
            <header className="bg-mongodb-slate/30 border-b border-neutral-700/50 pt-8 pb-20 rounded-xl mb-[-3rem]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-mongodb-spring animate-pulse" />
                                <span className="text-xs font-bold text-mongodb-spring uppercase tracking-widest">Live Dashboard</span>
                            </div>
                            <h1 className="text-3xl font-display font-bold text-white">
                                Welcome back, <span className="gradient-text">Organizer</span>
                            </h1>
                            <p className="text-neutral-400 mt-1">
                                Monitor your performance and manage your schedule in real-time.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                            <Link href="/appointments/new">
                                <Button variant="primary">
                                    <Plus className="w-5 h-5 mr-2" />
                                    New Appointment
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Suspense fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <Card key={i} className="animate-pulse bg-neutral-800/50">
                                    <CardContent className="p-6">
                                        <Skeleton className="h-4 w-24 mb-4 bg-neutral-700" />
                                        <Skeleton className="h-8 w-16 bg-neutral-700" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    }>
                        <DashboardStats organizerId={organizerId} />
                    </Suspense>
                </div>
            </header>

            {/* Main Dashboard Content */}
            <div className="container mx-auto px-4 relative z-20">
                <Card className="mb-8 border-mongodb-spring/10">
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Manage Slots</CardTitle>
                            <CardDescription>Search and manage your active appointment types</CardDescription>
                        </div>
                        <div className="w-full md:w-96 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Filter by title..."
                                defaultValue={searchParams.search}
                                className="w-full pl-11 pr-4 py-2.5 rounded-mongodb bg-mongodb-black/50 border border-neutral-700/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-mongodb-spring transition-all"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
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
                            <AppointmentsList organizerId={organizerId} searchQuery={searchParams.search} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
