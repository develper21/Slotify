import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerId, getOrganizerAppointments } from '@/lib/actions/organizer'
import { getOrganizerBookings } from '@/lib/actions/bookings'
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

    // Get organizer ID
    const organizerId = await getOrganizerId(session.user.id)
    if (!organizerId) {
        redirect('/dashboard')
    }

    // Get appointments for filter
    const appointments = await getOrganizerAppointments(organizerId)

    // Get bookings with filters
    const bookings = await getOrganizerBookings(organizerId, {
        status: searchParams.status,
        appointmentId: searchParams.appointment,
    })

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
                    Bookings Management
                </h1>
                <p className="text-neutral-400">
                    View and manage all your appointment bookings
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

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <BookingFilters
                                appointments={appointments}
                                currentStatus={searchParams.status}
                                currentAppointment={searchParams.appointment}
                            />
                        </div>
                        <ExportButton organizerId={organizerId} />
                    </div>
                </CardContent>
                <BookingsList bookings={bookings} />
            </Card>
        </div>
    )
}
