import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getOrganizerAppointments } from '@/lib/actions/organizer'
import { getOrganizerBookings, getCustomerBookings } from '@/lib/actions/bookings'
import { Card, CardContent } from '@/components/ui/Card'
import { Calendar, Clock, CheckCircle, XCircle, Users } from 'lucide-react'
import Link from 'next/link'
import { BookingFilters, ExportButton } from '@/components/bookings/BookingActions'
import { BookingsList } from '@/components/dashboard/BookingsList'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function BookingsPage(props: {
    searchParams?: Promise<{ status?: string; appointment?: string }>
}) {
    const searchParams = props.searchParams ? await props.searchParams : {}
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
    } else {
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                        {userRole === 'organizer' ? 'Bookings Console' : 'My Scheduled Sessions'}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        {userRole === 'organizer'
                            ? 'Real-time intake monitoring, schedule confirmations, and customer management.'
                            : 'Track your upcoming appointments, check status, and view session details.'
                        }
                    </p>
                </div>
                {userRole === 'organizer' && organizerId && (
                    <div className="flex items-center gap-3">
                        <ExportButton organizerId={organizerId} />
                    </div>
                )}
            </div>

            {/* Atlas Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-mongodb-slate/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Total Bookings</span>
                            <div className="text-3xl font-display font-black text-white mt-1">{stats.total}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-mongodb-spring/10 border border-mongodb-spring/20 flex items-center justify-center text-mongodb-spring">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-mongodb-slate/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Confirmed</span>
                            <div className="text-3xl font-display font-black text-green-400 mt-1">{stats.confirmed}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-mongodb-slate/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Pending</span>
                            <div className="text-3xl font-display font-black text-yellow-400 mt-1">{stats.pending}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-mongodb-slate/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Cancelled</span>
                            <div className="text-3xl font-display font-black text-red-400 mt-1">{stats.cancelled}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                            <XCircle className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter bar & table */}
            <Card className="bg-mongodb-slate/30 border-neutral-800 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-neutral-800/80 bg-mongodb-black/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {userRole === 'organizer' ? (
                        <BookingFilters
                            appointments={appointments}
                            currentStatus={searchParams.status}
                            currentAppointment={searchParams.appointment}
                        />
                    ) : (
                        <div className="flex bg-mongodb-black/70 p-1 rounded-xl border border-neutral-800">
                            {['all', 'confirmed', 'pending', 'cancelled'].map((status) => {
                                const isActive = (status === 'all' && !searchParams.status) || searchParams.status === status
                                return (
                                    <Link
                                        key={status}
                                        href={status === 'all' ? '/dashboard/bookings' : `/dashboard/bookings?status=${status}`}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            isActive
                                                ? 'bg-mongodb-spring text-mongodb-black shadow-md'
                                                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    <span className="text-xs text-neutral-500 font-medium">
                        Showing {bookings.length} {bookings.length === 1 ? 'record' : 'records'}
                    </span>
                </div>

                <CardContent className="p-0">
                    <BookingsList bookings={bookings} />
                </CardContent>
            </Card>
        </div>
    )
}
