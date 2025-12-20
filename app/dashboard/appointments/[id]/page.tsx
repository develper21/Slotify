import { notFound } from 'next/navigation'
import { getAppointmentById } from '@/lib/actions/appointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Clock, MapPin, User, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'
import Image from 'next/image'

export default async function AppointmentDetailPage({
    params,
}: {
    params: { id: string }
}) {
    const appointment: any = await getAppointmentById(params.id)

    if (!appointment) {
        notFound()
    }

    const settings = appointment.appointment_settings
    const images = appointment.appointment_images || []
    const primaryImage = images.find((img: any) => img.is_primary) || images[0]
    const organizerName = appointment.organizers?.users?.full_name || appointment.organizers?.business_name || 'Unknown'

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Image */}
            {primaryImage ? (
                <div className="relative h-96 bg-gradient-primary">
                    <Image
                        src={primaryImage.image_url}
                        alt={appointment.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="container mx-auto">
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                                {appointment.title}
                            </h1>
                            <p className="text-white/90 text-lg">by {organizerName}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-primary py-20">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                            {appointment.title}
                        </h1>
                        <p className="text-white/90 text-lg">by {organizerName}</p>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Appointment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    {appointment.description || 'No description provided.'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Introduction Message */}
                        {settings?.introduction_message && (
                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-blue-900">Before You Book</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-blue-800 whitespace-pre-wrap">
                                        {settings.introduction_message}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Image Gallery */}
                        {images.length > 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gallery</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {images.map((image: any, index: number) => (
                                            <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                                                <Image
                                                    src={image.image_url}
                                                    alt={`${appointment.title} - Image ${index + 1}`}
                                                    fill
                                                    className="object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Book This Appointment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-neutral-700">
                                        <Clock className="w-5 h-5 text-primary-600" />
                                        <span>{formatDuration(appointment.duration)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-700">
                                        <MapPin className="w-5 h-5 text-primary-600" />
                                        <span>{appointment.location || 'Online'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-700">
                                        <User className="w-5 h-5 text-primary-600" />
                                        <span>{organizerName}</span>
                                    </div>
                                    {settings?.paid_booking && settings.price && (
                                        <div className="flex items-center gap-3 text-neutral-700">
                                            <DollarSign className="w-5 h-5 text-primary-600" />
                                            <span className="font-semibold">${settings.price}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Features */}
                                <div className="pt-4 border-t border-neutral-200 space-y-2">
                                    {settings?.capacity_enabled && (
                                        <Badge variant="info">Group Booking Available</Badge>
                                    )}
                                    {settings?.manual_confirmation && (
                                        <Badge variant="warning">Manual Confirmation Required</Badge>
                                    )}
                                    {!settings?.paid_booking && (
                                        <Badge variant="success">Free Booking</Badge>
                                    )}
                                </div>

                                {/* Book Button */}
                                <Link href={`/book/${appointment.id}/date`} className="block">
                                    <Button className="w-full" size="lg">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Book Now
                                    </Button>
                                </Link>

                                {/* Meeting Info */}
                                {settings?.meeting_type && (
                                    <div className="pt-4 border-t border-neutral-200">
                                        <p className="text-sm font-medium text-neutral-700 mb-2">
                                            Meeting Type: {settings.meeting_type === 'online' ? 'Online' : 'In-Person'}
                                        </p>
                                        {settings.meeting_instructions && (
                                            <p className="text-sm text-neutral-600 whitespace-pre-wrap">
                                                {settings.meeting_instructions}
                                            </p>
                                        )}
                                        {settings.meeting_type === 'offline' && settings.venue_details && (
                                            <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                                                <p className="text-sm font-medium text-neutral-700">Venue:</p>
                                                <p className="text-sm text-neutral-600">{settings.venue_details}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Organizer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About the Organizer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-lg">
                                        {organizerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900">{organizerName}</p>
                                        {appointment.organizers?.business_name && (
                                            <p className="text-sm text-neutral-600">{appointment.organizers.business_name}</p>
                                        )}
                                    </div>
                                </div>
                                {appointment.organizers?.users?.email && (
                                    <p className="text-sm text-neutral-600">
                                        Contact: {appointment.organizers.users.email}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
