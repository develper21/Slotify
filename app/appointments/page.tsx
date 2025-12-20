import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerId, getOrganizerAppointments } from '@/lib/actions/organizer'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Search, Calendar, Clock, MapPin, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'
import { TogglePublishButton, DeleteButton } from '@/components/appointments/AppointmentActions'

export default async function AppointmentsPage({
    searchParams,
}: {
    searchParams: { search?: string }
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

    // Get appointments
    const appointments = await getOrganizerAppointments(organizerId, searchParams.search)

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                                My Appointments
                            </h1>
                            <p className="text-neutral-600">
                                Manage all your appointments and bookings
                            </p>
                        </div>
                        <Link href="/appointments/new">
                            <Button>
                                <Plus className="w-5 h-5 mr-2" />
                                Create Appointment
                            </Button>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search appointments..."
                            defaultValue={searchParams.search}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:border-primary"
                        />
                    </form>
                </div>

                {/* Appointments Grid */}
                {appointments.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                                No appointments found
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                {searchParams.search
                                    ? 'Try adjusting your search'
                                    : 'Get started by creating your first appointment'}
                            </p>
                            {!searchParams.search && (
                                <Link href="/appointments/new">
                                    <Button>
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Appointment
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map((appointment: any) => (
                            <Card key={appointment.id} hover className="overflow-hidden">
                                <CardContent className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                                {appointment.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={appointment.published ? 'success' : 'warning'}
                                                >
                                                    {appointment.published ? 'Published' : 'Draft'}
                                                </Badge>
                                                {appointment.booking_enabled && (
                                                    <Badge variant="info">
                                                        Booking Open
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <TogglePublishButton
                                            appointmentId={appointment.id}
                                            currentStatus={appointment.published}
                                        />
                                    </div>

                                    {/* Description */}
                                    {appointment.description && (
                                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                                            {appointment.description}
                                        </p>
                                    )}

                                    {/* Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(appointment.duration)}</span>
                                        </div>
                                        {appointment.location && (
                                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{appointment.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-neutral-200">
                                        <Link href={`/appointments/${appointment.id}/edit`} className="flex-1">
                                            <Button variant="secondary" size="sm" className="w-full">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <DeleteButton appointmentId={appointment.id} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

