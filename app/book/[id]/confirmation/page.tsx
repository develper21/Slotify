'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Calendar, Clock, MapPin, Home } from 'lucide-react'
import Link from 'next/link'
import { getBookingDetails } from '@/lib/actions/bookings'
import { formatDate, formatTime } from '@/lib/utils'

export default function ConfirmationPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams()
    const router = useRouter()
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

    // ... (keep the rest of the render logic)

    return (
        <div className="min-h-screen bg-mongodb-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Success Animation */}
                <div className="text-center mb-8 animate-scale-in">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-mongodb-spring/10 rounded-full mb-6 relative">
                        <div className="absolute inset-0 rounded-full bg-mongodb-spring/5 animate-ping"></div>
                        <CheckCircle className="w-16 h-16 text-mongodb-spring" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white mb-3">
                        Booking Confirmed!
                    </h1>
                    <p className="text-xl text-neutral-400">
                        Your appointment has been successfully reserved
                    </p>
                </div>

                {/* Booking Details Card */}
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
                                            {formatDate(bookingDetails.time_slots?.slot_date) || 'Date pending'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-mongodb-black rounded-lg border border-neutral-700">
                                    <Clock className="w-6 h-6 text-mongodb-spring mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-400">Time</p>
                                        <p className="text-lg font-semibold text-white">
                                            {bookingDetails.time_slots?.start_time && bookingDetails.time_slots?.end_time
                                                ? `${formatTime(bookingDetails.time_slots.start_time)} - ${formatTime(bookingDetails.time_slots.end_time)}`
                                                : 'Time pending'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-mongodb-black rounded-lg border border-neutral-700">
                                    <MapPin className="w-6 h-6 text-mongodb-spring mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-neutral-400">Location</p>
                                        <p className="text-lg font-semibold text-white">
                                            {bookingDetails.appointments?.location || 'Online'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-400">Could not load booking details</p>
                        )}

                        {/* Confirmation Message */}
                        <div className="mt-6 p-4 bg-mongodb-spring/10 border border-mongodb-spring/20 rounded-lg">
                            <p className="text-mongodb-spring text-sm font-medium">
                                📧 A confirmation email has been sent to your email address with all the details.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-6">
                        <h3 className="font-semibold text-white mb-4">What's Next?</h3>
                        <ul className="space-y-3 text-neutral-300">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-mongodb-spring flex items-center justify-center text-sm font-semibold border border-neutral-700">
                                    1
                                </span>
                                <span>Check your email for confirmation and meeting details</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-mongodb-spring flex items-center justify-center text-sm font-semibold border border-neutral-700">
                                    2
                                </span>
                                <span>Add the appointment to your calendar</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-800 text-mongodb-spring flex items-center justify-center text-sm font-semibold border border-neutral-700">
                                    3
                                </span>
                                <span>You can view or cancel your booking from your profile</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/profile" className="flex-1">
                        <Button variant="secondary" className="w-full bg-neutral-800 text-white hover:bg-neutral-700">
                            <Calendar className="w-5 h-5 mr-2" />
                            View My Bookings
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button className="w-full" variant="primary">
                            <Home className="w-5 h-5 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
