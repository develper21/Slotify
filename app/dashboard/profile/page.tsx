'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, Clock, MapPin, X } from 'lucide-react'
import { getUserBookings, cancelBooking } from '@/lib/actions/appointments'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { format } from 'date-fns'

interface Booking {
    id: string
    status: string
    created_at: string
    start_time: string
    end_time: string
    appointment: {
        title: string
        location_details: string
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
            if (!result.success) {
                toast.error(result.message || 'Failed to cancel')
            } else {
                toast.success('Booking cancelled successfully')
                loadUserAndBookings()
            }
        } catch (error) {
            toast.error('Failed to cancel booking')
        }
    }

    const upcomingBookings = bookings.filter(b => {
        const bookingDate = new Date(b.start_time)
        return bookingDate >= new Date() && b.status !== 'cancelled'
    })

    const pastBookings = bookings.filter(b => {
        const bookingDate = new Date(b.start_time)
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
        <Card key={booking.id} className="hover:shadow-md transition-shadow bg-mongodb-slate/30 border-neutral-800 overflow-hidden">
            <CardContent className="py-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {booking.appointment?.title || 'Appointment'}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-neutral-400">
                    <div className="flex items-center gap-2 bg-mongodb-black/30 p-2 rounded-lg border border-neutral-700/50">
                        <Calendar className="w-4 h-4 text-mongodb-spring" />
                        <span>{formatDate(booking.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-mongodb-black/30 p-2 rounded-lg border border-neutral-700/50">
                        <Clock className="w-4 h-4 text-mongodb-spring" />
                        <span>
                            {format(new Date(booking.start_time), 'hh:mm a')} - {format(new Date(booking.end_time), 'hh:mm a')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-mongodb-black/30 p-2 rounded-lg border border-neutral-700/50">
                        <MapPin className="w-4 h-4 text-mongodb-spring" />
                        <span className="truncate">{booking.appointment?.location_details || 'Online'}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="max-w-4xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-white mb-6">
                    Account <span className="gradient-text">Profile</span>
                </h1>

                {/* User Info */}
                <Card className="bg-mongodb-slate/30 border-neutral-800 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-mongodb-spring/5 blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <CardContent className="py-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-mongodb-spring to-teal-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-mongodb-spring/20 rotate-3 group-hover:rotate-0 transition-transform">
                                {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {user?.user_metadata?.full_name || 'User'}
                                </h2>
                                <p className="text-neutral-400 font-medium">{user?.email}</p>
                                <div className="mt-2 text-xs font-bold text-neutral-500 uppercase tracking-widest bg-neutral-800/50 inline-block px-2 py-1 rounded">
                                    Personal Account
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bookings Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
                <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-2">
                    <TabsList className="bg-transparent border-none">
                        <TabsTrigger value="upcoming" className="data-[state=active]:bg-transparent data-[state=active]:text-mongodb-spring data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-mongodb-spring rounded-none px-6">
                            Upcoming
                        </TabsTrigger>
                        <TabsTrigger value="past" className="data-[state=active]:bg-transparent data-[state=active]:text-mongodb-spring data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-mongodb-spring rounded-none px-6">
                            History
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="upcoming">
                    {upcomingBookings.length === 0 ? (
                        <div className="py-20 text-center bg-mongodb-slate/20 border border-dashed border-neutral-700/50 rounded-xl">
                            <Calendar className="w-16 h-16 mx-auto text-neutral-700 mb-4 opacity-30" />
                            <h3 className="text-xl font-bold text-white mb-2">
                                No Upcoming Appointments
                            </h3>
                            <p className="text-neutral-400 mb-8 max-w-xs mx-auto">
                                Ready to schedule your next session? Browse available experts.
                            </p>
                            <Button onClick={() => router.push('/')} variant="primary" className="px-8 h-12">
                                Browse Now
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {upcomingBookings.map(booking => renderBookingCard(booking, true))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past">
                    {pastBookings.length === 0 ? (
                        <div className="py-20 text-center bg-mongodb-slate/20 border border-dashed border-neutral-700/50 rounded-xl">
                            <Calendar className="w-16 h-16 mx-auto text-neutral-700 mb-4 opacity-30" />
                            <h3 className="text-xl font-bold text-white mb-2">
                                Empty History
                            </h3>
                            <p className="text-neutral-400">
                                Completed or cancelled appointments will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {pastBookings.map(booking => renderBookingCard(booking, false))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
