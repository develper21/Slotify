import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerId, getOrganizerAppointments } from '@/lib/actions/organizer'
import { getOrganizerBookings } from '@/lib/actions/bookings'
import { DataTable } from '@/components/ui/DataTable'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { BookingFilters, StatusUpdateButton, ExportButton } from '@/components/bookings/BookingActions'

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
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Bookings Management
                    </h1>
                    <p className="text-neutral-600">
                        View and manage all your appointment bookings
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Total Bookings</p>
                                    <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                                </div>
                                <Calendar className="w-10 h-10 text-primary/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Confirmed</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                                </div>
                                <Calendar className="w-10 h-10 text-green-600/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <Clock className="w-10 h-10 text-yellow-600/20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">Cancelled</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                                </div>
                                <Calendar className="w-10 h-10 text-red-600/20" />
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
                </Card>

                {/* Bookings Table */}
                <DataTable
                    data={bookings}
                    columns={[
                        {
                            key: 'id',
                            header: 'Booking ID',
                            render: (booking: any) => (
                                <span className="font-mono text-xs">{booking.id.slice(0, 8)}</span>
                            ),
                            width: 'w-24'
                        },
                        {
                            key: 'customer',
                            header: 'Customer',
                            render: (booking: any) => (
                                <div>
                                    <p className="font-medium text-neutral-900">
                                        {booking.users?.full_name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-neutral-500">{booking.users?.email}</p>
                                </div>
                            ),
                            sortable: true
                        },
                        {
                            key: 'appointment',
                            header: 'Appointment',
                            render: (booking: any) => booking.appointments?.title || 'N/A',
                            sortable: true
                        },
                        {
                            key: 'date',
                            header: 'Date & Time',
                            render: (booking: any) => (
                                <div>
                                    <p className="text-sm text-neutral-900">
                                        {format(new Date(booking.time_slots?.slot_date), 'MMM d, yyyy')}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        {booking.time_slots?.start_time} - {booking.time_slots?.end_time}
                                    </p>
                                </div>
                            ),
                            sortable: true
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            render: (booking: any) => (
                                <Badge
                                    variant={
                                        booking.status === 'confirmed' ? 'success' :
                                            booking.status === 'pending' ? 'warning' :
                                                booking.status === 'cancelled' ? 'danger' :
                                                    'default'
                                    }
                                >
                                    {booking.status}
                                </Badge>
                            ),
                            sortable: true
                        }
                    ]}
                    keyExtractor={(booking: any) => booking.id}
                    actions={(booking: any) => (
                        <StatusUpdateButton bookingId={booking.id} currentStatus={booking.status} />
                    )}
                    emptyMessage="No bookings found"
                    pageSize={15}
                />
            </div>
        </div>
    )
}
