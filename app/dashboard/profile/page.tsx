'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, Clock, MapPin, LogOut, X } from 'lucide-react'
import { getUserBookings, cancelBooking } from '@/lib/actions/appointments'
import { signOut } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate, formatTime } from '@/lib/utils'

interface Booking {
    id: string
    status: string
    created_at: string
    appointments: {
        title: string
        location: string
    }
    time_slots: {
        slot_date: string
        start_time: string
        end_time: string
    }
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadUserAndBookings()
    }, [])

    const loadUserAndBookings = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            setUser(user)
            const bookingsData = await getUserBookings(user.id)
            setBookings(bookingsData as Booking[])
        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load bookings')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return
        }

        try {
            const result = await cancelBooking(bookingId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Booking cancelled successfully')
                loadUserAndBookings()
            }
        } catch (error) {
            toast.error('Failed to cancel booking')
        }
    }

    const handleLogout = async () => {
        await signOut()
    }

    const upcomingBookings = bookings.filter(b => {
        if (!b.time_slots) return false
        const bookingDate = new Date(b.time_slots.slot_date)
        return bookingDate >= new Date() && b.status !== 'cancelled'
    })

    const pastBookings = bookings.filter(b => {
        if (!b.time_slots) return false
        const bookingDate = new Date(b.time_slots.slot_date)
        return bookingDate < new Date() || b.status === 'cancelled'
    })

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse text-white">
                <Skeleton className="h-12 w-64 mb-8 bg-neutral-800" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-32 w-full bg-neutral-800" />
                    ))}
                </div>
            </div>
        )
    }

    const renderBookingCard = (booking: Booking, showCancel: boolean = true) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow bg-mongodb-slate/30 border-neutral-800">
            <CardContent className="py-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {booking.appointments.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Badge variant={
                                booking.status === 'confirmed' ? 'success' :
                                    booking.status === 'cancelled' ? 'danger' :
                                        'warning'
                            }>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                        </div>
                    </div>
                    {showCancel && booking.status !== 'cancelled' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                        </Button>
                    )}
                </div>

                <div className="space-y-2 text-sm text-neutral-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-mongodb-spring" />
                        <span>{formatDate(new Date(booking.time_slots.slot_date))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-mongodb-spring" />
                        <span>
                            {formatTime(booking.time_slots.start_time)} - {formatTime(booking.time_slots.end_time)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-mongodb-spring" />
                        <span>{booking.appointments.location || 'Online'}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="max-w-4xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-display font-bold text-white">
                        My Profile
                    </h1>
                </div>

                {/* User Info */}
                <Card className="bg-mongodb-slate/30 border-neutral-800">
                    <CardContent className="py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mongodb-spring to-teal-600 flex items-center justify-center text-white font-semibold text-2xl shadow-lg shadow-mongodb-spring/20">
                                {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    {user?.user_metadata?.full_name || 'User'}
                                </h2>
                                <p className="text-neutral-400">{user?.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings Tabs */}
            <Tabs defaultValue="upcoming">
                <TabsList className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                    <TabsTrigger value="upcoming" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                        Upcoming ({upcomingBookings.length})
                    </TabsTrigger>
                    <TabsTrigger value="past" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">
                        Past ({pastBookings.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    {upcomingBookings.length === 0 ? (
                        <Card className="bg-mongodb-slate/30 border-neutral-800">
                            <CardContent className="py-12 text-center">
                                <Calendar className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No Upcoming Bookings
                                </h3>
                                <p className="text-neutral-400 mb-6">
                                    You don't have any upcoming appointments
                                </p>
                                <Button onClick={() => router.push('/')} variant="primary">
                                    Browse Appointments
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map(booking => renderBookingCard(booking, true))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past">
                    {pastBookings.length === 0 ? (
                        <Card className="bg-mongodb-slate/30 border-neutral-800">
                            <CardContent className="py-12 text-center">
                                <Calendar className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No Past Bookings
                                </h3>
                                <p className="text-neutral-400">
                                    Your booking history will appear here
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {pastBookings.map(booking => renderBookingCard(booking, false))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
