import { Suspense } from 'react'
import { getAppointmentById } from '@/lib/actions/mock-appointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'

async function AppointmentContent({ id }: { id: string }) {
    const appointment = await getAppointmentById(id)

    if (!appointment) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-white mb-4">Appointment Not Found</h1>
                <p className="text-neutral-400 mb-6">The appointment you're looking for doesn't exist.</p>
                <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            </div>
        )
    }

    const organizerName = appointment.organizers?.business_name || 'Unknown Organizer'
    const settings = appointment.appointment_settings

    return (
        <div className="min-h-screen bg-mongodb-black">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Appointments
                        </Button>
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{appointment.title}</h1>
                            <p className="text-neutral-400">{appointment.description}</p>
                        </div>
                        <Badge variant="primary" className="mt-4 md:mt-0">
                            {appointment.location_type === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Appointment Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-white">Appointment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center text-neutral-300">
                                    <Clock className="w-5 h-5 mr-3 text-mongodb-spring" />
                                    <span>{formatDuration(appointment.duration)}</span>
                                </div>
                                
                                <div className="flex items-center text-neutral-300">
                                    <MapPin className="w-5 h-5 mr-3 text-mongodb-spring" />
                                    <span>{appointment.location_details || 'Location details not specified'}</span>
                                </div>
                                
                                <div className="flex items-center text-neutral-300">
                                    <Users className="w-5 h-5 mr-3 text-mongodb-spring" />
                                    <span>Max Capacity: {settings?.max_capacity || 1} person</span>
                                </div>
                                
                                {settings?.paid_booking && settings.price > 0 && (
                                    <div className="flex items-center text-neutral-300">
                                        <span className="text-mongodb-spring font-semibold">
                                            ${settings.price} {settings.currency}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Organizer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-white">About {organizerName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-neutral-300">
                                    {appointment.organizers?.description || 'Professional service provider'}
                                </p>
                                {appointment.organizers?.website_url && (
                                    <a
                                        href={appointment.organizers.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-mongodb-spring hover:text-mongodb-spring/80 mt-2 inline-block"
                                    >
                                        Visit Website
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-white">Book This Appointment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-neutral-400">
                                    <p>• Select your preferred date and time</p>
                                    <p>• Answer booking questions</p>
                                    <p>• Confirm your booking</p>
                                </div>
                                
                                <Link href={`/book/${id}/time`}>
                                    <Button className="w-full">
                                        Start Booking
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AppointmentPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-mongodb-black flex items-center justify-center">
            <div className="text-white">Loading...</div>
        </div>}>
            <AppointmentContent id={params.id} />
        </Suspense>
    )
}
