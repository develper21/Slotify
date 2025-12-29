import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getOrganizerId } from '@/lib/actions/organizer'
import { getOrganizerBookings } from '@/lib/actions/bookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function SchedulePage() {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    const organizerId = await getOrganizerId(session.user.id)
    if (!organizerId) {
        redirect('/dashboard')
    }

    let bookingsData = await getOrganizerBookings(organizerId, { status: 'confirmed' })

    const groupedBookings: Record<string, any[]> = {}

    bookingsData.forEach((booking: any) => {
        const date = new Date(booking.startTime).toISOString().split('T')[0]
        if (!groupedBookings[date]) {
            groupedBookings[date] = []
        }
        groupedBookings[date].push(booking)
    })

    const sortedDates = Object.keys(groupedBookings).sort()

    return (
        <div className="min-h-screen bg-mongodb-black py-12">
            <div className="container mx-auto px-4 max-w-4xl animate-in fade-in duration-500">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">
                            My Schedule
                        </h1>
                        <p className="text-neutral-400">
                            Upcoming appointments and agenda
                        </p>
                    </div>
                </div>

                {sortedDates.length === 0 ? (
                    <Card className="bg-mongodb-slate/50 border-neutral-800 text-center py-12">
                        <CardContent>
                            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                            <h3 className="text-xl font-medium text-white mb-2">No Upcoming Appointments</h3>
                            <p className="text-neutral-400">You don't have any confirmed bookings scheduled.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-8">
                        {sortedDates.map((date) => {
                            const dateObj = parseISO(date)
                            let dateLabel = format(dateObj, 'EEEE, MMMM d, yyyy')
                            if (isToday(dateObj)) dateLabel = 'Today, ' + format(dateObj, 'MMMM d')
                            if (isTomorrow(dateObj)) dateLabel = 'Tomorrow, ' + format(dateObj, 'MMMM d')

                            return (
                                <div key={date}>
                                    <h3 className="text-mongodb-spring font-medium mb-4 sticky top-4 bg-mongodb-black/80 backdrop-blur py-2 z-10">{dateLabel}</h3>
                                    <div className="space-y-4">
                                        {groupedBookings[date].map((booking: any) => (
                                            <div key={booking.id} className="bg-mongodb-black border border-neutral-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover:border-neutral-700 transition-colors">
                                                <div className="w-40 flex-shrink-0 flex flex-col justify-center border-r border-neutral-800 pr-4">
                                                    <p className="text-lg font-bold text-white">
                                                        {format(new Date(booking.startTime), 'HH:mm')} - {format(new Date(booking.endTime), 'HH:mm')}
                                                    </p>
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="text-lg font-medium text-white mb-1">{booking.appointment?.title}</h4>

                                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mt-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <User className="w-4 h-4" />
                                                            <span>{booking.customer?.fullName || 'Guest'}</span>
                                                        </div>
                                                        {booking.appointment?.locationDetails && (
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-4 h-4" />
                                                                <span>{booking.appointment.locationDetails}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-center pl-2">
                                                    <Button variant="outline" size="sm" className="border-neutral-700 text-neutral-300 hover:text-white">
                                                        Details
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
