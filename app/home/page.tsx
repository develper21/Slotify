import { Suspense } from 'react'
import { getPublishedAppointments } from '@/lib/actions/appointments'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Search, Clock, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'

async function AppointmentsList({ searchQuery }: { searchQuery?: string }) {
    const appointments = await getPublishedAppointments(searchQuery)

    if (appointments.length === 0) {
        return (
            <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-700 mb-2">No appointments found</h3>
                <p className="text-neutral-500">Try adjusting your search or check back later</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment: any) => {
                const primaryImage = appointment.appointment_images?.find((img: any) => img.is_primary)
                const organizerName = appointment.organizers?.users?.full_name || appointment.organizers?.business_name

                return (
                    <Card key={appointment.id} hover className="overflow-hidden">
                        {primaryImage && (
                            <div className="h-48 bg-gradient-primary relative overflow-hidden">
                                <img
                                    src={primaryImage.image_url}
                                    alt={appointment.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        {!primaryImage && (
                            <div className="h-48 bg-gradient-primary flex items-center justify-center">
                                <Calendar className="w-16 h-16 text-white/50" />
                            </div>
                        )}

                        <CardHeader>
                            <CardTitle>{appointment.title}</CardTitle>
                            <p className="text-sm text-neutral-600 line-clamp-2">
                                {appointment.description || 'No description available'}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <Clock className="w-4 h-4" />
                                <span>{formatDuration(appointment.duration)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <MapPin className="w-4 h-4" />
                                <span>{appointment.location || 'Online'}</span>
                            </div>
                            {organizerName && (
                                <p className="text-sm text-neutral-500">by {organizerName}</p>
                            )}
                        </CardContent>

                        <CardFooter>
                            <Link href={`/appointments/${appointment.id}`} className="w-full">
                                <Button className="w-full">View Details</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

function AppointmentsLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-xl" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default async function HomePage({
    searchParams,
}: {
    searchParams: { search?: string }
}) {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="bg-gradient-primary text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                            Book Your Perfect Appointment
                        </h1>
                        <p className="text-xl text-white/90 mb-8">
                            Discover and book appointments with ease. Real-time availability, instant confirmation.
                        </p>

                        {/* Search Bar */}
                        <form className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search appointments..."
                                defaultValue={searchParams.search}
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-neutral-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* Appointments Grid */}
            <div className="container mx-auto px-4 py-12">
                <Suspense fallback={<AppointmentsLoading />}>
                    <AppointmentsList searchQuery={searchParams.search} />
                </Suspense>
            </div>
        </div>
    )
}
