import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Search, Calendar, Users, TrendingUp, Clock, Shield, Activity, User, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import AppointmentCard from '@/components/organizer/AppointmentCard'
import { formatDate } from '@/lib/utils'
import { MOCK_APPOINTMENTS, MOCK_BOOKINGS, MOCK_STATS, MOCK_USER } from '@/lib/mock-data'

async function OrganizerStats() {
    const stats = MOCK_STATS
    const statCards = [
        { label: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-mongodb-spring', bg: 'bg-mongodb-spring/10' },
        { label: 'Active Slots', value: stats.publishedAppointments, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Upcoming sessions', value: stats.upcomingBookings, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat) => (
                <Card key={stat.label} hover={false} className="relative overflow-hidden group bg-mongodb-slate/50 border-neutral-800">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150`} />
                    <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-mongodb ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
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

function OrganizerAppointmentsList() {
    const appointments = MOCK_APPOINTMENTS
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map((appointment: any) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </div>
    )
}

async function AdminStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
                { label: 'Total Users', value: 156, icon: Users, color: 'text-mongodb-spring', bg: 'bg-mongodb-spring/10' },
                { label: 'Organizers', value: 24, icon: Shield, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Total Bookings', value: 412, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { label: 'Appointments', value: 85, icon: Calendar, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            ].map((stat) => (
                <Card key={stat.label} hover={false} className="relative overflow-hidden group bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                        <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
                        <p className="text-3xl font-display font-bold text-white mt-1">{stat.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function CustomerRecentBookings() {
    const bookings = MOCK_BOOKINGS
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Recent Appointments</h2>
            {bookings.map((booking: any) => (
                <Card key={booking.id} className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Calendar className="w-6 h-6 text-mongodb-spring" />
                            <div>
                                <h3 className="text-lg font-semibold text-white">{booking.appointment.title}</h3>
                                <p className="text-sm text-neutral-400">{formatDate(booking.start_time)}</p>
                            </div>
                        </div>
                        <Badge variant="success">{booking.status}</Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { role?: string; search?: string }
}) {
    const role = searchParams.role || 'organizer'

    if (role === 'admin') {
        return (
            <div className="container mx-auto p-2">
                <h1 className="text-4xl font-display font-bold text-white mb-8">System <span className="gradient-text">Admin</span></h1>
                <AdminStats />
                <Card className="bg-mongodb-slate/50 border-neutral-800 p-6 max-w-md">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
                    <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start border-neutral-700 text-neutral-300"><Users className="w-4 h-4 mr-2" /> Manage Users</Button>
                        <Button variant="outline" className="w-full justify-start border-neutral-700 text-neutral-300"><Shield className="w-4 h-4 mr-2" /> Manage Organizers</Button>
                    </div>
                </Card>
            </div>
        )
    }

    if (role === 'customer') {
        return (
            <div className="container mx-auto p-2">
                <h1 className="text-4xl font-display font-bold text-white mb-8">User <span className="gradient-text">Dashboard</span></h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2"><CustomerRecentBookings /></div>
                    <Card className="bg-mongodb-slate/50 border-neutral-800 h-fit">
                        <CardHeader><CardTitle className="text-white">Quick Actions</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full bg-mongodb-spring text-mongodb-black"><Search className="w-4 h-4 mr-2" /> Browse Appointments</Button>
                            <Button variant="outline" className="w-full border-neutral-700 text-neutral-300"><User className="w-4 h-4 mr-2" /> Manage Profile</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-2">
            <header className="mb-12">
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Business <span className="gradient-text">Intelligence</span></h1>
                <p className="text-neutral-400 mt-1">Mock Mode: Monitoring performance and managing sessions.</p>
            </header>
            <OrganizerStats />
            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardHeader><CardTitle className="text-white">Your Appointments</CardTitle></CardHeader>
                <CardContent><OrganizerAppointmentsList /></CardContent>
            </Card>
        </div>
    )
}
