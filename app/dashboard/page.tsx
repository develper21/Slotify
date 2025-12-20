import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerId, getOrganizerAppointments, getOrganizerStats } from '@/lib/actions/organizer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Plus, Search, Calendar, Users, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import AppointmentCard from '@/components/organizer/AppointmentCard'

async function DashboardStats({ organizerId }: { organizerId: string }) {
    const stats = await getOrganizerStats(organizerId)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Total Appointments</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalAppointments}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Published</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.publishedAppointments}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Total Bookings</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.totalBookings}</p>
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
                            <p className="text-sm font-medium text-neutral-500">Upcoming</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{stats.upcomingBookings}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

async function AppointmentsList({ organizerId, searchQuery }: { organizerId: string; searchQuery?: string }) {
    const appointments = await getOrganizerAppointments(organizerId, searchQuery)

    if (appointments.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                        No Appointments Yet
                    </h3>
                    <p className="text-neutral-500 mb-6">
                        Create your first appointment to start accepting bookings
                    </p>
                    <Link href="/appointments/new">
                        <Button>
                            <Plus className="w-5 h-5 mr-2" />
                            Create Appointment
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

    const organizerId = await getOrganizerId(user.id)

    if (!organizerId) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <Card className="max-w-md">
                    <CardContent className="py-8 text-center">
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                            Organizer Account Required
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            You need to be registered as an organizer to access this dashboard.
                        </p>
                        <Link href="/">
                            <Button>Go to Home</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-900">
                                Dashboard
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                Manage your appointments and bookings
                            </p>
                        </div>
                        <Link href="/appointments/new">
                            <Button size="lg">
                                <Plus className="w-5 h-5 mr-2" />
                                New Appointment
                            </Button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search appointments..."
                            defaultValue={searchParams.search}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                        />
                    </form>
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
                    <DashboardStats organizerId={organizerId} />
                </Suspense>

                {/* Appointments */}
                <div className="mb-6">
                    <h2 className="text-2xl font-display font-semibold text-neutral-900 mb-4">
                        Your Appointments
                    </h2>
                </div>

                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <Card key={i}>
                                <Skeleton className="h-48 w-full rounded-t-xl" />
                                <CardContent className="py-6">
                                    <Skeleton className="h-6 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                }>
                    <AppointmentsList organizerId={organizerId} searchQuery={searchParams.search} />
                </Suspense>
            </div>
        </div>
    )
}
