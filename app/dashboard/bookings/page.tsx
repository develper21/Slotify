import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerId, getOrganizerAppointments } from '@/lib/actions/organizer'
import { getOrganizerBookings, getCustomerBookings } from '@/lib/actions/bookings'
import { Card, CardContent } from '@/components/ui/Card'
import { Calendar, Clock } from 'lucide-react'
import { BookingFilters, ExportButton } from '@/components/bookings/BookingActions'
import { BookingsList } from '@/components/dashboard/BookingsList'

export const dynamic = 'force-dynamic'

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: { status?: string; appointment?: string }
}) {
    const supabase = createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    // Check User Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

    const userRole = profile?.role || 'customer'

    let bookings: any[] = []
    let appointments: any[] = []
    let organizerId = null

    if (userRole === 'organizer') {
        // Get organizer ID
        organizerId = await getOrganizerId(session.user.id)
        if (!organizerId) {
            // If organizer user but no organizer record, maybe redirect to profile setup?
            // For now, redirect dashboard
            redirect('/dashboard')
        }

        // Get appointments for filter
        appointments = await getOrganizerAppointments(organizerId)

        // Get bookings with filters
        bookings = await getOrganizerBookings(organizerId, {
            status: searchParams.status,
            appointmentId: searchParams.appointment,
        })
    } else if (userRole === 'customer') {
        bookings = await getCustomerBookings(session.user.id)
        // Check for client-side filtering if needed, or implement filter support in getCustomerBookings
        if (searchParams.status) {
            bookings = bookings.filter((b: any) => b.status === searchParams.status)
        }
    } else {
        // generic fallback or redirect
        redirect('/dashboard')
    }

    // Calculate stats
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
        pending: bookings.filter((b: any) => b.status === 'pending').length,
        cancelled: bookings.filter((b: any) => b.status === 'cancelled').length,
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    {userRole === 'organizer' ? 'Bookings Management' : 'My Bookings'}
                </h1>
                <p className="text-neutral-400">
                    {userRole === 'organizer'
                        ? 'View and manage all your appointment bookings'
                        : 'View and track your appointment history'
                    }
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Total Bookings</p>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-mongodb-spring/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Confirmed</p>
                                <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-green-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                            </div>
                            <Clock className="w-10 h-10 text-yellow-500/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-neutral-400 mb-1">Cancelled</p>
                                <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-red-500/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & List */}
            <Card className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                <CardContent className="p-6">
                    {userRole === 'organizer' ? (
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <BookingFilters
                                    appointments={appointments}
                                    currentStatus={searchParams.status}
                                    currentAppointment={searchParams.appointment}
                                />
                            </div>
                            <ExportButton organizerId={organizerId!} />
                        </div>
                    ) : (
                        // Customer specific filters? Just status for now
                        <div className="flex items-center gap-4">
                            <div className="flex bg-mongodb-black p-1 rounded-lg border border-neutral-800">
                                {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                                    <a
                                        key={status}
                                        href={status === 'all' ? '/dashboard/bookings' : `/dashboard/bookings?status=${status}`}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${(status === 'all' && !searchParams.status) || searchParams.status === status
                                            ? 'bg-neutral-800 text-white'
                                            : 'text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <BookingsList bookings={bookings} />
            </Card>
        </div>
    )
}
