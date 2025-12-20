import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOrganizerId } from '@/lib/actions/organizer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, TrendingUp, Users, Clock, DollarSign, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import BookingsChart from '@/components/organizer/BookingsChart'
import RecentBookings from '@/components/organizer/RecentBookings'

export const dynamic = 'force-dynamic'

async function ReportingStats({ organizerId }: { organizerId: string }) {
    const supabase = createClient()

    // Get all appointments for this organizer
    const { data: appointments }: { data: any[] | null } = await supabase
        .from('appointments')
        .select('id')
        .eq('organizer_id', organizerId)

    const appointmentIds = appointments?.map(a => a.id) || []

    // Total bookings
    const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('appointment_id', appointmentIds)

    // Confirmed bookings
    const { count: confirmedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('appointment_id', appointmentIds)
        .eq('status', 'confirmed')

    // Pending bookings
    const { count: pendingBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('appointment_id', appointmentIds)
        .eq('status', 'pending')

    // Cancelled bookings
    const { count: cancelledBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('appointment_id', appointmentIds)
        .eq('status', 'cancelled')

    // This month bookings
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const { count: thisMonthBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .in('appointment_id', appointmentIds)
        .gte('created_at', firstDayOfMonth.toISOString())

    // Revenue (if paid bookings)
    const { data: paidBookings } = await supabase
        .from('bookings')
        .select(`
      id,
      appointments!inner(
        appointment_settings(price, paid_booking)
      )
    `)
        .in('appointment_id', appointmentIds)
        .eq('status', 'confirmed')

    let totalRevenue = 0
    paidBookings?.forEach((booking: any) => {
        const settings = booking.appointments?.appointment_settings
        if (settings?.paid_booking && settings?.price) {
            totalRevenue += settings.price
        }
    })

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Total Bookings</p>
                            <p className="text-3xl font-bold text-neutral-900 mt-2">{totalBookings || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Confirmed</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">{confirmedBookings || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Pending</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingBookings || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">This Month</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">{thisMonthBookings || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Cancelled</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">{cancelledBookings || 0}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500">Total Revenue</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default async function ReportsPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const organizerId = await getOrganizerId(user.id)

    if (!organizerId) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-900">
                                Reports & Analytics
                            </h1>
                            <p className="text-neutral-600 mt-1">
                                Track your bookings and performance
                            </p>
                        </div>
                        <Link href="/dashboard">
                            <button className="text-neutral-600 hover:text-neutral-900">
                                Back to Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Card key={i}>
                                <CardContent className="py-6">
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                }>
                    <ReportingStats organizerId={organizerId} />
                </Suspense>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Suspense fallback={
                        <Card>
                            <CardHeader>
                                <CardTitle>Bookings Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>
                    }>
                        <BookingsChart organizerId={organizerId} />
                    </Suspense>

                    <Suspense fallback={
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>
                    }>
                        <RecentBookings organizerId={organizerId} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
