'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatTime } from '@/lib/utils'
import { Calendar, Clock, User } from 'lucide-react'

interface Booking {
    id: string
    status: string
    created_at: string
    users: {
        full_name: string
        email: string
    }
    appointments: {
        title: string
    }
    time_slots: {
        slot_date: string
        start_time: string
    }
}

export default function RecentBookings({ organizerId }: { organizerId: string }) {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadRecentBookings()
    }, [])

    const loadRecentBookings = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()

            // Get appointments
            const { data: appointments } = await supabase
                .from('appointments')
                .select('id')
                .eq('organizer_id', organizerId)

            const appointmentIds = appointments?.map(a => a.id) || []

            // Get recent bookings
            const { data } = await supabase
                .from('bookings')
                .select(`
          id,
          status,
          created_at,
          users (full_name, email),
          appointments (title),
          time_slots (slot_date, start_time)
        `)
                .in('appointment_id', appointmentIds)
                .order('created_at', { ascending: false })
                .limit(10)

            setBookings(data as Booking[] || [])
        } catch (error) {
            console.error('Error loading recent bookings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-neutral-500">Loading...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (bookings.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-neutral-500">No recent bookings</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-neutral-900">
                                        {booking.appointments.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <User className="w-3 h-3 text-neutral-500" />
                                        <p className="text-sm text-neutral-600">
                                            {booking.users.full_name || booking.users.email}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={
                                        booking.status === 'confirmed' ? 'success' :
                                            booking.status === 'cancelled' ? 'danger' :
                                                'warning'
                                    }
                                >
                                    {booking.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(new Date(booking.time_slots.slot_date))}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatTime(booking.time_slots.start_time)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
