import { Suspense } from 'react'
import { getPublishedAppointments } from '@/lib/actions/appointments'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Search, Clock, MapPin, Calendar, ArrowRight, Sparkles, Users, Filter, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'
import { Navbar } from '@/components/Navbar'

export const dynamic = 'force-dynamic'

async function AppointmentsList({ searchQuery }: { searchQuery?: string }) {
    const appointments = await getPublishedAppointments(searchQuery)

    if (appointments.length === 0) {
        return (
            <div className="text-center py-24 bg-[#0C2331]/50 border border-dashed border-white/10 rounded-2xl max-w-2xl mx-auto">
                <Calendar className="w-16 h-16 mx-auto text-neutral-600 mb-4 opacity-50" />
                <h3 className="text-xl font-display font-bold text-white mb-2">No active appointments found</h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
                    {searchQuery ? `No sessions matched "${searchQuery}". Try a different keyword.` : 'There are currently no published sessions available.'}
                </p>
                {searchQuery && (
                    <Link href="/home">
                        <Button variant="outline" size="sm">Clear Search Filter</Button>
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment: any) => {
                const organizerName = appointment.organizer?.businessName || appointment.organizer?.fullName || 'Professional Host'
                const isFree = !appointment.price || Number(appointment.price) === 0
                const capacity = appointment.maxCapacity || 1

                return (
                    <Card
                        key={appointment.id}
                        hover
                        className="bg-[#0C2331] border-white/10 flex flex-col justify-between overflow-hidden group">
                        <div>
                            {/* Card Media Header */}
                            <div className="h-44 -mx-6 -mt-6 mb-5 relative overflow-hidden bg-gradient-to-br from-[#132E3D] to-[#001E2B] flex items-center justify-center border-b border-white/5">
                                {appointment.imageUrl ? (
                                    <img
                                        src={appointment.imageUrl}
                                        alt={appointment.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-neutral-600 group-hover:text-mongodb-spring transition-colors">
                                        <Calendar className="w-12 h-12 mb-2 stroke-1" />
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Live Booking Slot</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0C2331] via-transparent to-transparent opacity-80" />

                                {/* Top Badges */}
                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                    <Badge variant={isFree ? 'success' : 'primary'} dot>
                                        {isFree ? 'Free Slot' : `$${appointment.price}`}
                                    </Badge>
                                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-neutral-300 border border-white/10 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-mongodb-spring" />
                                        {formatDuration(appointment.duration || 60)}
                                    </span>
                                </div>
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-mongodb-spring transition-colors line-clamp-1">
                                {appointment.title}
                            </h3>
                            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-6">
                                {appointment.description || 'Seamless one-on-one booking session with instant confirmation.'}
                            </p>

                            {/* Service Specs */}
                            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#001E2B]/60 border border-white/5 text-xs text-neutral-300 mb-6">
                                <div className="flex items-center gap-2 truncate">
                                    <MapPin className="w-3.5 h-3.5 text-mongodb-spring shrink-0" />
                                    <span className="truncate">{appointment.locationDetails || 'Online Meeting'}</span>
                                </div>
                                <div className="flex items-center gap-2 truncate">
                                    <Users className="w-3.5 h-3.5 text-mongodb-mint shrink-0" />
                                    <span className="truncate">{capacity === 1 ? '1-on-1 Private' : `Up to ${capacity} seats`}</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-mongodb-spring/15 border border-mongodb-spring/30 flex items-center justify-center text-xs font-bold text-mongodb-spring">
                                        {organizerName[0]?.toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                                            {organizerName}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 font-mono">
                                            Verified Host
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link href={`/book/${appointment.id}`} className="block w-full">
                                <Button variant="primary" className="w-full font-bold shadow-mongodb">
                                    Book Slot
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                            </Link>
                        </div>
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
                <div key={i} className="bg-[#0C2331] border border-white/10 rounded-xl p-6 animate-pulse">
                    <div className="h-44 -mx-6 -mt-6 mb-5 bg-[#132E3D] rounded-t-xl" />
                    <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />
                    <div className="h-4 w-full bg-white/5 rounded mb-2" />
                    <div className="h-4 w-2/3 bg-white/5 rounded mb-6" />
                    <div className="h-10 w-full bg-white/10 rounded" />
                </div>
            ))}
        </div>
    )
}

export default async function HomePage(props: {
    searchParams?: Promise<{ search?: string }>
}) {
    const searchParams = props.searchParams ? await props.searchParams : {}
    const query = searchParams.search || ''

    return (
        <div className="min-h-screen bg-[#001E2B] text-white selection:bg-mongodb-spring selection:text-mongodb-black">
            <Navbar />

            {/* Catalog Header */}
            <section className="pt-16 pb-12 bg-grid-pattern border-b border-white/10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-mongodb-spring/10 blur-[100px] rounded-full pointer-events-none -z-10" />

                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mongodb-spring/10 border border-mongodb-spring/25 text-xs font-mono font-bold text-mongodb-spring uppercase tracking-wider mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                Atlas Appointment Catalog
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">
                                Discover & Book <span className="gradient-text">Open Slots</span>
                            </h1>
                            <p className="text-neutral-400 mt-2 max-w-xl text-base">
                                Real-time session directory. Select an expert or service below to view open dates and reserve your time slot instantly.
                            </p>
                        </div>

                        <Link href="/dashboard/appointments/new">
                            <Button variant="primary" className="shrink-0 font-bold shadow-mongodb">
                                + Host An Appointment
                            </Button>
                        </Link>
                    </div>

                    {/* Search & Filter Bar */}
                    <form className="relative flex items-center p-2 rounded-2xl bg-[#0C2331] border border-white/10 shadow-2xl focus-within:border-mongodb-spring/50 transition-all max-w-3xl">
                        <Search className="absolute left-5 w-5 h-5 text-neutral-500" />
                        <input
                            type="text"
                            name="search"
                            defaultValue={query}
                            placeholder="Search by title, description, or host name..."
                            className="w-full pl-13 pr-4 py-3.5 bg-transparent text-white text-base placeholder:text-neutral-500 outline-none"
                        />
                        <Button type="submit" variant="primary" className="px-7 h-11 font-bold shrink-0">
                            Search
                        </Button>
                    </form>
                </div>
            </section>

            {/* Results Grid */}
            <main className="container mx-auto px-4 lg:px-8 py-16 max-w-6xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <p className="text-sm font-mono text-neutral-400">
                        {query ? `Showing search results for "${query}"` : 'Browse all published appointments'}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-mongodb-spring animate-pulse" />
                        <span className="text-xs font-mono font-semibold text-neutral-400">Real-time availability</span>
                    </div>
                </div>

                <Suspense fallback={<AppointmentsLoading />}>
                    <AppointmentsList searchQuery={query} />
                </Suspense>
            </main>
        </div>
    )
}
