import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getOrganizerId } from '@/lib/actions/organizer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, TrendingUp, Users, Clock, DollarSign, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import BookingsChart from '@/components/organizer/BookingsChart'
import RecentBookings from '@/components/organizer/RecentBookings'
import { db } from '@/lib/db'
import { appointments, bookings } from '@/lib/db/schema'
import { eq, inArray, gte, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

async function ReportingStats({ organizerId }: { organizerId: string }) {
    try {
        const organizerAppointments = await db.select({ id: appointments.id })
            .from(appointments)
            .where(eq(appointments.organizerId, organizerId))

        const appointmentIds = organizerAppointments.map(a => a.id)

        if (appointmentIds.length === 0) {
            return <div className="text-white text-center p-8 bg-mongodb-slate/20 rounded-xl">No stats available yet.</div>
        }

        const statsResult = await db.select({
            total: sql<number>`count(*)`,
            confirmed: sql<number>`count(case when status = 'confirmed' then 1 end)`,
            pending: sql<number>`count(case when status = 'pending' then 1 end)`,
            cancelled: sql<number>`count(case when status = 'cancelled' then 1 end)`,
            revenue: sql<string>`sum(case when status = 'confirmed' then total_price else 0 end)`
        })
            .from(bookings)
            .where(inArray(bookings.appointmentId, appointmentIds))

        const firstDayOfMonth = new Date()
        firstDayOfMonth.setDate(1)
        firstDayOfMonth.setHours(0, 0, 0, 0)

        const monthStats = await db.select({ count: sql<number>`count(*)` })
            .from(bookings)
            .where(and(
                inArray(bookings.appointmentId, appointmentIds),
                gte(bookings.createdAt, firstDayOfMonth)
            ))

        const stats = statsResult[0]

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-400">Total Bookings</p>
                                <p className="text-3xl font-bold text-white mt-2">{Number(stats.total) || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Calendar className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-400">Confirmed</p>
                                <p className="text-3xl font-bold text-mongodb-spring mt-2">{Number(stats.confirmed) || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-mongodb-spring/10 flex items-center justify-center border border-mongodb-spring/20">
                                <CheckCircle className="w-6 h-6 text-mongodb-spring" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-400">Pending</p>
                                <p className="text-3xl font-bold text-yellow-500 mt-2">{Number(stats.pending) || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                <Clock className="w-6 h-6 text-yellow-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-400">This Month</p>
                                <p className="text-3xl font-bold text-purple-500 mt-2">{Number(monthStats[0]?.count) || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <TrendingUp className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-400">Cancelled</p>
                                <p className="text-3xl font-bold text-red-500 mt-2">{Number(stats.cancelled) || 0}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <Users className="w-6 h-6 text-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-neutral-400">Total Revenue</p>
                                <p className="text-3xl font-bold text-mongodb-spring mt-2">${Number(stats.revenue || 0).toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-mongodb-spring/10 flex items-center justify-center border border-mongodb-spring/20">
                                <DollarSign className="w-6 h-6 text-mongodb-spring" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    } catch (e: any) {
        return <div className="text-white text-center p-8 bg-red-500/10 rounded-xl border border-red-500/20">Error loading stats: {e.message}</div>
    }
}

export default async function ReportsPage() {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    const { user } = session
    const organizerId = user.id

    return (
        <div className="min-h-screen bg-mongodb-black">
            <div className="border-b border-neutral-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                                Reports & <span className="gradient-text">Analytics</span>
                            </h1>
                            <p className="text-neutral-400 mt-2">
                                Track your bookings and performance
                            </p>
                        </div>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-neutral-400 hover:text-white">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Card key={i} className="bg-mongodb-slate/50 border-neutral-800">
                                <CardContent className="py-6">
                                    <Skeleton className="h-20 w-full bg-neutral-800" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                }>
                    <ReportingStats organizerId={organizerId} />
                </Suspense>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Suspense fallback={
                        <Card className="bg-mongodb-slate/50 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-white">Bookings Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-64 w-full bg-neutral-800" />
                            </CardContent>
                        </Card>
                    }>
                        <BookingsChart organizerId={organizerId} />
                    </Suspense>

                    <Suspense fallback={
                        <Card className="bg-mongodb-slate/50 border-neutral-800">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Bookings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-64 w-full bg-neutral-800" />
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

import { and } from 'drizzle-orm'
