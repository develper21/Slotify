'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Calendar, Clock, MapPin, Home } from 'lucide-react'
import Link from 'next/link'
import { getBookingDetails } from '@/lib/actions/bookings'
import { formatDate } from '@/lib/utils'
import { format } from 'date-fns'

export default function ConfirmationPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams()
    const bookingId = searchParams.get('booking')
    const [bookingDetails, setBookingDetails] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDetails = async () => {
            if (!bookingId) return
            try {
                const data = await getBookingDetails(bookingId)
                setBookingDetails(data)
            } catch (error) {
                console.error('Failed to fetch booking:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDetails()
    }, [bookingId])

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 animate-scale-in">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-mongodb-spring/10 rounded-full mb-6 relative">
                    <div className="absolute inset-0 rounded-full bg-mongodb-spring/5 animate-ping"></div>
                    <CheckCircle className="w-16 h-16 text-mongodb-spring" />
                </div>
                <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
                    Booking <span className="gradient-text">Confirmed</span>
                </h1>
                <p className="text-xl text-neutral-400">
                    Your appointment has been successfully reserved
                </p>
            </div>

            <Card className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                <CardContent className="py-8">
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Appointment Details
                    </h2>

                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-16 bg-neutral-800 rounded-lg"></div>
                            <div className="h-16 bg-neutral-800 rounded-lg"></div>
                            <div className="h-16 bg-neutral-800 rounded-lg"></div>
                        </div>
                    ) : bookingDetails ? (
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-mongodb-black rounded-lg border border-neutral-700">
                                <Calendar className="w-6 h-6 text-mongodb-spring mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-400">Date</p>
                                    <p className="text-lg font-semibold text-white">
                                        {formatDate(bookingDetails.start_time)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-mongodb-black rounded-lg border border-neutral-700">
                                <Clock className="w-6 h-6 text-mongodb-spring mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-400">Time</p>
                                    <p className="text-lg font-semibold text-white">
                                        {format(new Date(bookingDetails.start_time), 'hh:mm a')} - {format(new Date(bookingDetails.end_time), 'hh:mm a')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-mongodb-black rounded-lg border border-neutral-700">
                                <MapPin className="w-6 h-6 text-mongodb-spring mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-400">Location</p>
                                    <p className="text-lg font-semibold text-white">
                                        {bookingDetails.appointment?.location_details || 'Online / Online Details Provided'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-400">Could not load booking details</p>
                    )}

                    <div className="mt-8 p-6 bg-mongodb-spring/5 border border-mongodb-spring/10 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-mongodb-spring/5 blur-3xl -mr-16 -mt-16" />
                        <p className="text-mongodb-spring text-sm font-medium relative z-10 flex items-center gap-2">
                            📧 Confirmation email sent to your address.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-10 bg-mongodb-slate/50 border-neutral-800">
                <CardContent className="py-6">
                    <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/bookings">
                            <Button variant="outline" className="w-full border-neutral-800 text-neutral-300 hover:bg-neutral-800 h-12">
                                <Calendar className="w-4 h-4 mr-2" />
                                My Bookings
                            </Button>
                        </Link>
                        <Link href="/home">
                            <Button className="w-full bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90 h-12 font-bold">
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
