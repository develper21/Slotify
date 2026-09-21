import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getOrganizerId, getOrganizerAppointments } from '@/lib/actions/organizer'
import { getOrganizerBookings, getCustomerBookings } from '@/lib/actions/bookings'
import { Card, CardContent } from '@/components/ui/Card'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { BookingFilters, ExportButton } from '@/components/bookings/BookingActions'
import { BookingsList } from '@/components/dashboard/BookingsList'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: { status?: string; appointment?: string }
}) {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    const { user } = session

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id)
    })

    const userRole = profile?.role || 'customer'

    let bookings: any[] = []
    let appointments: any[] = []
    let organizerId = null

    if (userRole === 'organizer') {
        organizerId = user.id
        appointments = await getOrganizerAppointments(organizerId)
        bookings = await getOrganizerBookings(organizerId, {
            status: searchParams.status,
            appointmentId: searchParams.appointment,
        })
    } else if (userRole === 'customer') {
        bookings = await getCustomerBookings(user.id)
        if (searchParams.status) {
            bookings = bookings.filter((b: any) => b.status === searchParams.status)
        }
    }

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
        pending: bookings.filter((b: any) => b.status === 'pending').length,
        cancelled: bookings.filter((b: any) => b.status === 'cancelled').length,
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
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
                        <div className="flex items-center gap-4">
                            <div className="flex bg-mongodb-black p-1 rounded-lg border border-neutral-800">
                                {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                                    <Link
                                        key={status}
                                        href={status === 'all' ? '/dashboard/bookings' : `/dashboard/bookings?status=${status}`}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${(status === 'all' && !searchParams.status) || searchParams.status === status
                                            ? 'bg-neutral-800 text-white'
                                            : 'text-neutral-400 hover:text-white'
                                            }`}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Link>
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
