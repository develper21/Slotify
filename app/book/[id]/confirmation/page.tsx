'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Calendar, Clock, MapPin, Home } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmationPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const bookingId = searchParams.get('booking')
    const [bookingDetails, setBookingDetails] = useState<any>(null)

    useEffect(() => {
        // TODO: Fetch booking details
        // For now, show generic confirmation
    }, [bookingId])

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Success Animation */}
                <div className="text-center mb-8 animate-scale-in">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-neutral-900 mb-3">
                        Booking Confirmed!
                    </h1>
                    <p className="text-xl text-neutral-600">
                        Your appointment has been successfully reserved
                    </p>
                </div>

                {/* Booking Details Card */}
                <Card className="mb-6">
                    <CardContent className="py-8">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                            Appointment Details
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                                <Calendar className="w-6 h-6 text-primary-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Date</p>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {/* TODO: Display actual date */}
                                        To be confirmed
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                                <Clock className="w-6 h-6 text-primary-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Time</p>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {/* TODO: Display actual time */}
                                        To be confirmed
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                                <MapPin className="w-6 h-6 text-primary-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">Location</p>
                                    <p className="text-lg font-semibold text-neutral-900">
                                        {/* TODO: Display actual location */}
                                        Online / Venue TBD
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Message */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-900 text-sm">
                                📧 A confirmation email has been sent to your email address with all the details.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="mb-6">
                    <CardContent className="py-6">
                        <h3 className="font-semibold text-neutral-900 mb-4">What's Next?</h3>
                        <ul className="space-y-3 text-neutral-700">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                                    1
                                </span>
                                <span>Check your email for confirmation and meeting details</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                                    2
                                </span>
                                <span>Add the appointment to your calendar</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
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
                        <Button variant="secondary" className="w-full">
                            <Calendar className="w-5 h-5 mr-2" />
                            View My Bookings
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button className="w-full">
                            <Home className="w-5 h-5 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
