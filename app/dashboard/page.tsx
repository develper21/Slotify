import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Search, Calendar, Users, TrendingUp, Clock, Shield, Activity, User, ArrowUpRight, CheckCircle2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatDuration } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { getOrganizerStats, getOrganizerAppointments } from '@/lib/actions/organizer'
import { getOrganizerBookings, getCustomerBookings } from '@/lib/actions/bookings'
import { getSystemStats } from '@/lib/actions/admin'
import { TogglePublishButton } from '@/components/appointments/AppointmentActions'

export const dynamic = 'force-dynamic'

async function OrganizerDashboardView({ userId }: { userId: string }) {
    const stats = await getOrganizerStats(userId)
    const appointments = await getOrganizerAppointments(userId)
    const bookings = await getOrganizerBookings(userId)
    const upcomingBookings = bookings.slice(0, 5)

    const statCards = [
        { label: 'Total Services', value: stats.totalAppointments, icon: Calendar, color: 'text-mongodb-spring', bg: 'bg-mongodb-spring/10', hint: 'All created plans' },
        { label: 'Live Active Slots', value: stats.publishedAppointments, icon: TrendingUp, color: 'text-mongodb-mint', bg: 'bg-mongodb-mint/10', hint: 'Visible on marketplace' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', hint: 'Lifetime reservations' },
        { label: 'Upcoming Sessions', value: stats.upcomingBookings, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', hint: 'Awaiting completion' },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top Stat Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <Card key={stat.label} hover={false} className="bg-[#0C2331] border-white/10 p-5 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-display font-black text-white">{stat.value}</p>
                        <p className="text-[11px] font-mono text-neutral-500 mt-1">{stat.hint}</p>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C2331] to-[#132E3D] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-mongodb-spring/15 flex items-center justify-center text-mongodb-spring font-bold">
                        ⚡
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Organizer Quick Center</h4>
                        <p className="text-xs text-neutral-400">Launch a new session or check schedule availability</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/dashboard/appointments/new">
                        <Button variant="primary" size="sm" className="font-bold">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Create Slot
                        </Button>
                    </Link>
                    <Link href="/dashboard/bookings">
                        <Button variant="subtle" size="sm" className="font-medium">
                            All Bookings
                        </Button>
                    </Link>
                    <Link href="/home">
                        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                            View Marketplace
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Two Column Layout: Recent Bookings & Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Feed (Col 1-2) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-mongodb-spring" />
                            Recent Client Bookings
                        </h2>
                        <Link href="/dashboard/bookings" className="text-xs font-semibold text-mongodb-spring hover:underline">
                            View all ({bookings.length})
                        </Link>
                    </div>

                    {upcomingBookings.length === 0 ? (
                        <Card className="bg-[#0C2331] border-white/10 p-8 text-center border-dashed">
                            <Users className="w-10 h-10 mx-auto text-neutral-600 mb-2 opacity-50" />
                            <p className="text-white font-medium text-sm">No client bookings yet</p>
                            <p className="text-neutral-500 text-xs mt-1">When clients book your services, they will appear here in real-time.</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {upcomingBookings.map((b: any) => (
                                <Card key={b.id} hover={false} className="bg-[#0C2331] border-white/10 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-mongodb-spring/10 border border-mongodb-spring/25 flex items-center justify-center shrink-0 mt-0.5">
                                                <Calendar className="w-4 h-4 text-mongodb-spring" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{b.appointment?.title || 'Appointment'}</h4>
                                                <p className="text-xs text-neutral-400">
                                                    Client: <span className="text-neutral-200 font-semibold">{b.customer?.fullName || b.customer?.email || 'Guest Client'}</span>
                                                </p>
                                                <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                                                    {formatDate(b.startTime)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 sm:self-center">
                                            <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'} dot>
                                                {b.status}
                                            </Badge>
                                            <span className="text-xs font-mono font-bold text-neutral-300">
                                                ${b.totalPrice || '0.00'}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Your Appointments List (Col 3) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-mongodb-mint" />
                            Your Services
                        </h2>
                        <Link href="/dashboard/appointments" className="text-xs font-semibold text-mongodb-spring hover:underline">
                            Manage ({appointments.length})
                        </Link>
                    </div>

                    {appointments.length === 0 ? (
                        <Card className="bg-[#0C2331] border-white/10 p-6 text-center border-dashed">
                            <p className="text-white text-sm font-medium">No services created</p>
                            <Link href="/dashboard/appointments/new" className="mt-3 block">
                                <Button size="sm" variant="primary" className="w-full font-bold">
                                    + Create First Slot
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {appointments.slice(0, 4).map((apt: any) => (
                                <Card key={apt.id} hover={false} className="bg-[#0C2331] border-white/10 p-3.5 flex items-center justify-between">
                                    <div className="min-w-0 flex-1 mr-3">
                                        <h4 className="text-sm font-bold text-white truncate">{apt.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-neutral-400">
                                            <span>{apt.duration || 60}m</span>
                                            <span>•</span>
                                            <span className="text-mongodb-spring">${apt.price || '0.00'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <TogglePublishButton appointmentId={apt.id} currentStatus={apt.isActive} />
                                        <Link href={`/dashboard/appointments/${apt.id}/edit`}>
                                            <Button variant="ghost" size="sm" className="p-1.5 h-8 text-neutral-400 hover:text-white">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

async function CustomerDashboardView({ userId }: { userId: string }) {
    const bookings = await getCustomerBookings(userId)

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0C2331] to-[#132E3D] border border-white/10">
                <div>
                    <Badge variant="primary" className="mb-2">Client Portal</Badge>
                    <h2 className="text-2xl font-display font-bold text-white">Your Scheduled Bookings</h2>
                    <p className="text-sm text-neutral-400 mt-1">Review upcoming appointments, reschedule, or cancel reservations.</p>
                </div>
                <Link href="/home">
                    <Button variant="primary" className="font-bold shadow-mongodb">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Browse More Slots
                    </Button>
                </Link>
            </div>

            {bookings.length === 0 ? (
                <Card className="bg-[#0C2331] border-white/10 p-16 text-center border-dashed">
                    <Calendar className="w-16 h-16 mx-auto text-neutral-600 mb-4 opacity-40" />
                    <h3 className="text-lg font-bold text-white mb-2">You haven't booked any sessions yet</h3>
                    <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">Explore our directory of verified experts and reserve your preferred time slot in seconds.</p>
                    <Link href="/home">
                        <Button variant="primary">Explore Marketplace</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((b: any) => (
                        <Card key={b.id} hover={false} className="bg-[#0C2331] border-white/10 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Badge variant={b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'} dot>
                                        {b.status}
                                    </Badge>
                                    <span className="text-xs font-mono font-bold text-mongodb-spring">
                                        ${b.totalPrice || '0.00'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{b.appointment?.title || 'Appointment'}</h3>
                                <p className="text-xs text-neutral-400 mb-4">{b.appointment?.description || 'Confirmed meeting session.'}</p>

                                <div className="p-3 rounded-lg bg-[#001E2B] border border-white/5 space-y-2 text-xs text-neutral-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-mongodb-spring" />
                                        <span>{formatDate(b.startTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-mongodb-mint" />
                                        <span>{formatDuration(b.appointment?.duration || 60)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                                <Link href={`/book/${b.appointmentId}/confirmation?booking=${b.id}`}>
                                    <Button variant="outline" size="sm">
                                        View Receipt
                                    </Button>
                                </Link>
                                <Link href="/dashboard/bookings">
                                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                                        Details →
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

async function AdminDashboardView() {
    const stats = await getSystemStats()

    const adminCards = [
        { label: 'Platform Users', value: stats.totalUsers, icon: Users, color: 'text-mongodb-spring', bg: 'bg-mongodb-spring/10' },
        { label: 'Active Organizers', value: stats.totalOrganizers, icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Live Slots', value: stats.totalAppointments, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminCards.map((c) => (
                    <Card key={c.label} hover={false} className="bg-[#0C2331] border-white/10 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{c.label}</span>
                            <div className={`p-2 rounded-lg ${c.bg}`}>
                                <c.icon className={`w-4 h-4 ${c.color}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-display font-black text-white">{c.value}</p>
                        <p className="text-[11px] font-mono text-neutral-500 mt-1">Real-time database count</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card hover className="bg-[#0C2331] border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-mongodb-spring" />
                        Manage System Users
                    </h3>
                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                        Modify user roles between Customer, Organizer, and Admin. Suspend or activate accounts.
                    </p>
                    <Link href="/dashboard/admin/users">
                        <Button variant="primary" className="font-bold">
                            View User Directory →
                        </Button>
                    </Link>
                </Card>

                <Card hover className="bg-[#0C2331] border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        Organizer Applications
                    </h3>
                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                        Review pending service providers and organizers wishing to host paid booking slots.
                    </p>
                    <Link href="/dashboard/admin/organizers">
                        <Button variant="subtle" className="font-bold">
                            Manage Organizers →
                        </Button>
                    </Link>
                </Card>
            </div>
        </div>
    )
}

export default async function DashboardPage(props: {
    searchParams?: Promise<{ search?: string }>
}) {
    const session = await getSession()
    if (!session?.user?.id) {
        redirect('/login')
    }

    // Security: role is ALWAYS derived from the authenticated session.
    // The old `searchParams.role` override allowed any customer to view the
    // admin dashboard just by appending ?role=admin to the URL.
    const activeRole = (session.user?.role || 'customer') as 'admin' | 'organizer' | 'customer'
    const userId = session.user.id

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-3xl font-display font-black text-white tracking-tight">
                        {activeRole === 'admin'
                            ? 'Admin Control Center'
                            : activeRole === 'customer'
                            ? 'Client Booking Hub'
                            : 'Host Intelligence Dashboard'}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Real-time operational monitoring on your workspace.
                    </p>
                </div>
            </div>

            {/* Dynamic Role View (server-verified role) */}
            {activeRole === 'admin' && <AdminDashboardView />}
            {activeRole === 'customer' && <CustomerDashboardView userId={userId} />}
            {activeRole === 'organizer' && <OrganizerDashboardView userId={userId} />}
        </div>
    )
}
