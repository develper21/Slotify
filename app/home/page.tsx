import { Suspense } from 'react'
import { getPublishedAppointments } from '@/lib/actions/appointments'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Search, Clock, MapPin, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'
import { Navbar } from '@/components/Navbar'

async function AppointmentsList({ searchQuery }: { searchQuery?: string }) {
    const appointments = await getPublishedAppointments(searchQuery)

    if (appointments.length === 0) {
        return (
            <div className="text-center py-20 bg-mongodb-slate/30 border border-dashed border-neutral-700/50 rounded-mongodb">
                <Calendar className="w-16 h-16 mx-auto text-neutral-600 mb-4 opacity-50" />
                <h3 className="text-xl font-display font-bold text-white mb-2">No appointments found</h3>
                <p className="text-neutral-400">Try adjusting your search or check back later</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map((appointment: any) => {
                const images = appointment.images || []
                const primaryImage = images.find((img: any) => img.is_primary) || images[0]
                const organizerName = appointment.organizers?.users?.full_name || appointment.organizers?.business_name

                return (
                    <Card key={appointment.id} hover className="group flex flex-col h-full overflow-hidden">
                        {primaryImage && (
                            <div className="h-52 relative overflow-hidden">
                                <img
                                    src={primaryImage.url}
                                    alt={appointment.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-mongodb-black/80 to-transparent" />
                            </div>
                        )}
                        {!primaryImage && (
                            <div className="h-52 bg-mongodb-forest/20 flex items-center justify-center">
                                <Calendar className="w-16 h-16 text-mongodb-spring/30" />
                            </div>
                        )}

                        <CardHeader className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <CardTitle className="text-xl">{appointment.title}</CardTitle>
                            </div>
                            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                                {appointment.description || 'Professional appointment booking with real-time availability.'}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm text-neutral-300">
                                    <div className="w-8 h-8 rounded-mongodb bg-mongodb-black/50 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-mongodb-spring" />
                                    </div>
                                    <span>{formatDuration(appointment.duration)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-300">
                                    <div className="w-8 h-8 rounded-mongodb bg-mongodb-black/50 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-mongodb-spring" />
                                    </div>
                                    <span className="truncate">{appointment.location || 'Online'}</span>
                                </div>
                            </div>
                            {organizerName && (
                                <div className="pt-4 border-t border-neutral-700/50 flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-mongodb-spring/20 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-mongodb-spring">
                                            {organizerName[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-xs text-neutral-500 font-medium tracking-wide uppercase">
                                        by {organizerName}
                                    </span>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter>
                            <Link href={`/appointments/${appointment.id}`} className="w-full">
                                <Button className="w-full group/btn" variant="primary">
                                    Book Now
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                    <Skeleton className="h-52 w-full rounded-t-mongodb bg-neutral-800" />
                    <CardHeader>
                        <Skeleton className="h-7 w-3/4 mb-2 bg-neutral-800" />
                        <Skeleton className="h-4 w-full bg-neutral-800" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full bg-neutral-800" />
                        <Skeleton className="h-6 w-1/2 bg-neutral-800" />
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
        <div className="min-h-screen bg-mongodb-black">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 lg:py-32">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mongodb-spring/5 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mongodb-forest/10 blur-[120px] rounded-full" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="primary" className="mb-6 animate-fade-in">
                            Trusted by 10,000+ Businesses
                        </Badge>
                        <h1 className="text-6xl md:text-7xl font-display font-bold mb-8 tracking-tight animate-slide-up">
                            Scale Your <span className="gradient-text">Bookings</span> Fast
                        </h1>
                        <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Discover and book professional appointments with instant confirmation and seamless scheduling technology.
                        </p>

                        {/* Search Bar */}
                        <form className="relative max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by title, location or business..."
                                    defaultValue={searchParams.search}
                                    className="w-full pl-14 pr-6 py-5 rounded-mongodb bg-mongodb-slate border border-neutral-700/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all shadow-xl"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Button type="submit" size="sm" className="hidden sm:flex">
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 pb-24 relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Featured Appointments</h2>
                        <p className="text-neutral-400">Hand-picked slots from top-rated professionals</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Filter</Button>
                        <Button variant="outline" size="sm">Sort by</Button>
                    </div>
                </div>

                <Suspense fallback={<AppointmentsLoading />}>
                    <AppointmentsList searchQuery={searchParams.search} />
                </Suspense>

                {/* Bottom CTA */}
                <section className="mt-32 p-12 rounded-mongodb bg-gradient-dark border border-neutral-700/50 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-mongodb" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-display font-bold text-white mb-4">Are you a professional?</h3>
                        <p className="text-neutral-400 mb-8">
                            Join thousands of organizers and start managing your appointments with the world's most advanced booking system.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup">
                                <Button size="lg" className="px-12">Get Started Free</Button>
                            </Link>
                            <Link href="/misc">
                                <Button variant="ghost" size="lg">Learn More</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-700/50 py-12 bg-mongodb-black/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-6 h-6 bg-mongodb-spring rounded-mongodb flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-mongodb-black" />
                        </div>
                        <span className="text-lg font-display font-bold text-white tracking-tighter">
                            SLOTIFY
                        </span>
                    </div>
                    <p className="text-neutral-500 text-sm">
                        © 2025 Slotify Inc. Built for the modern professional.
                    </p>
                </div>
            </footer>
        </div>
    )
}
