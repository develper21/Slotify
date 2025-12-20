import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerAppointments } from '@/lib/actions/organizer'
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

    // 1. Check authentication and get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Fetch appointments (using user.id as organizerId since profiles.id == auth.users.id)
    const appointments = await getOrganizerAppointments(user.id, searchParams.search)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                        My <span className="gradient-text">Appointments</span>
                    </h1>
                    <p className="text-neutral-400 mt-1">
                        Control your schedules, pricing, and visibility.
                    </p>
                </div>
                <Link href="/dashboard/appointments/new">
                    <Button variant="primary" size="lg" className="rounded-xl shadow-mongodb-spring/20 shadow-lg">
                        <Plus className="w-5 h-5 mr-2" />
                        New Appointment
                    </Button>
                </Link>
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by title or description..."
                        defaultValue={searchParams.search}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-700 bg-mongodb-black text-white focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all placeholder:text-neutral-600"
                    />
                </form>
            </div>

            {/* Content Area */}
            {appointments.length === 0 ? (
                <Card className="bg-mongodb-slate/50 border-neutral-800 border-dashed">
                    <CardContent className="py-24 text-center">
                        <Calendar className="w-16 h-16 mx-auto text-neutral-700 mb-6 opacity-40" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Ready to start booking?
                        </h3>
                        <p className="text-neutral-400 mb-8 max-w-sm mx-auto">
                            {searchParams.search
                                ? "No appointments match your search criteria. Try a different term."
                                : "You haven't created any appointments yet. Create one to start accepting bookings."}
                        </p>
                        {!searchParams.search && (
                            <Link href="/dashboard/appointments/new">
                                <Button variant="primary" size="lg">
                                    Create Your First Appointment
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((appointment: any) => (
                        <Card key={appointment.id} className="group hover:border-mongodb-spring/30 transition-all duration-300 bg-mongodb-slate/40 border-neutral-800 overflow-hidden relative">
                            {/* Status Indicator Bar */}
                            <div className={`absolute top-0 left-0 w-full h-1 ${appointment.is_active ? 'bg-mongodb-spring' : 'bg-yellow-500/50'}`} />

                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-mongodb-spring transition-colors">
                                            {appointment.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={appointment.is_active ? 'success' : 'warning'}
                                                className="rounded-md"
                                            >
                                                {appointment.is_active ? 'Active' : 'Hidden'}
                                            </Badge>
                                            <span className="text-xs font-bold text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                {appointment.price > 0 ? `$${appointment.price}` : 'Free'}
                                            </span>
                                        </div>
                                    </div>
                                    <TogglePublishButton
                                        appointmentId={appointment.id}
                                        currentStatus={appointment.is_active}
                                    />
                                </div>

                                <p className="text-sm text-neutral-400 mb-6 line-clamp-2 min-h-[2.5rem]">
                                    {appointment.description || 'No description provided.'}
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 bg-mongodb-black/50 p-2 rounded-lg border border-neutral-700/30">
                                        <Clock className="w-3.5 h-3.5 text-mongodb-spring" />
                                        <span>{formatDuration(appointment.duration)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 bg-mongodb-black/50 p-2 rounded-lg border border-neutral-700/30">
                                        <MapPin className="w-3.5 h-3.5 text-mongodb-spring" />
                                        <span className="truncate">{appointment.location_details || 'Online'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                                    <Link href={`/dashboard/appointments/${appointment.id}/edit`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full border-neutral-700 hover:bg-neutral-800 rounded-lg">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Configure
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
    )
}
