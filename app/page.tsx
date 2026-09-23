import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, ShieldCheck, Zap, Lock, CreditCard, Sparkles, ArrowRight, CheckCircle2, Users, LayoutDashboard, Globe } from 'lucide-react'
import { getPublishedAppointments } from '@/lib/actions/appointments'
import { getSession } from '@/lib/auth'
import { LandingHeader } from '@/components/LandingHeader'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
    const session = await getSession()
    const appointments = await getPublishedAppointments()
    const featuredSlots = appointments.slice(0, 3)

    return (
        <div className="min-h-screen bg-[#001E2B] text-white selection:bg-mongodb-spring selection:text-mongodb-black">
            {/* Top Atlas-Style Navigation (client component: mobile menu + session-aware CTAs) */}
            <LandingHeader session={session} />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-36 bg-grid-pattern">
                {/* Radial Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-mongodb-spring/10 blur-[130px] rounded-full pointer-events-none -z-10" />
                <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-mongodb-forest/20 blur-[100px] rounded-full pointer-events-none -z-10" />

                <div className="container mx-auto px-4 lg:px-8 text-center max-w-5xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C2331] border border-mongodb-spring/30 shadow-[0_0_20px_rgba(0,237,100,0.15)] mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-mongodb-spring animate-pulse" />
                        <span className="text-xs font-mono font-bold text-mongodb-spring uppercase tracking-wider">
                            Enterprise-Grade Scheduling Infrastructure
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] text-white mb-8">
                        Precision Scheduling. <br className="hidden sm:inline" />
                        <span className="gradient-text">Zero Conflict Bookings.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-12">
                        Slotify is the modern appointment platform for high-demand professionals. Automate calendar availability, collect intake questions, accept Stripe payments, and eliminate double-booking forever.
                    </p>

                    {/* Hero Action CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
                        <Link href="/home" className="w-full sm:w-auto">
                            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 font-bold text-base shadow-[0_0_25px_rgba(0,237,100,0.3)]">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Browse Marketplace
                            </Button>
                        </Link>
                        <Link href="/signup" className="w-full sm:w-auto">
                            <Button variant="subtle" size="lg" className="w-full sm:w-auto px-8 font-semibold text-base">
                                Host Your Own Slots
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* Live Metric Strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto p-4 rounded-2xl bg-[#0C2331]/70 border border-white/10 backdrop-blur-xl">
                        <div className="p-3 text-center">
                            <p className="text-2xl lg:text-3xl font-mono font-black text-mongodb-spring">100%</p>
                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">Concurrency Safe</p>
                        </div>
                        <div className="p-3 text-center border-l border-white/5">
                            <p className="text-2xl lg:text-3xl font-mono font-black text-white">Direct</p>
                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">Stripe Checkout</p>
                        </div>
                        <div className="p-3 text-center border-l border-white/5">
                            <p className="text-2xl lg:text-3xl font-mono font-black text-mongodb-mint">Live</p>
                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">Postgres Storage</p>
                        </div>
                        <div className="p-3 text-center border-l border-white/5">
                            <p className="text-2xl lg:text-3xl font-mono font-black text-mongodb-spring">Multi-Role</p>
                            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mt-1">Organizer & Client</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Showcase Section */}
            <section id="features" className="py-24 border-t border-white/10 bg-[#071B26]/60 relative">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge variant="primary" className="mb-4">Why Professionals Choose Slotify</Badge>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">
                            Engineered for speed, control, and reliability.
                        </h2>
                        <p className="text-neutral-400 mt-4 text-base sm:text-lg">
                            Everything you need to run appointments like a premier software service.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card hover className="bg-[#0C2331] border-white/10 relative overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-mongodb-spring/10 border border-mongodb-spring/25 flex items-center justify-center mb-6">
                                <Lock className="w-6 h-6 text-mongodb-spring" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Race Condition Safe</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Never worry about two clients booking the exact same slot. Distributed locking guarantees atomic reservation before payment.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-mongodb-spring">
                                <CheckCircle2 className="w-4 h-4" /> Atomic Lock Guard
                            </div>
                        </Card>

                        <Card hover className="bg-[#0C2331] border-white/10 relative overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-mongodb-mint/10 border border-mongodb-mint/25 flex items-center justify-center mb-6">
                                <CreditCard className="w-6 h-6 text-mongodb-mint" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Instant Stripe Payments</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Eliminate client no-shows. Charge for your consultation upfront via automated Stripe checkout sessions with direct webhook fulfillment.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-mongodb-mint">
                                <CheckCircle2 className="w-4 h-4" /> Stripe Verified
                            </div>
                        </Card>

                        <Card hover className="bg-[#0C2331] border-white/10 relative overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Intake Question Builder</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Tailor each appointment. Build custom questionnaires (text fields, dropdowns, checkboxes) to gather critical context before meeting.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-blue-400">
                                <CheckCircle2 className="w-4 h-4" /> Fully Customizable
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Live Slots Preview */}
            <section id="demo" className="py-24 border-t border-white/10 bg-[#001E2B]">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                        <div>
                            <Badge variant="primary" className="mb-3">Live Marketplace</Badge>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                                Featured Slots Available Today
                            </h2>
                            <p className="text-neutral-400 mt-2">
                                Real active appointment sessions configured by organizers.
                            </p>
                        </div>
                        <Link href="/home">
                            <Button variant="outline" className="font-bold gap-2">
                                View Full Directory
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {featuredSlots.length === 0 ? (
                        <Card className="bg-[#0C2331] border-dashed border-white/15 p-12 text-center">
                            <Calendar className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-1">No appointments published yet</h3>
                            <p className="text-neutral-400 text-sm mb-6">Be the first organizer to publish a booking plan.</p>
                            <Link href="/dashboard/appointments/new">
                                <Button variant="primary">Create First Appointment</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredSlots.map((item: any) => {
                                const organizerName = item.organizer?.businessName || item.organizer?.fullName || 'Expert Organizer'
                                const isFree = !item.price || Number(item.price) === 0

                                return (
                                    <Card key={item.id} hover className="bg-[#0C2331] border-white/10 flex flex-col justify-between group">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-4">
                                                <Badge variant={isFree ? 'success' : 'primary'} dot>
                                                    {isFree ? 'Free Slot' : `$${item.price}`}
                                                </Badge>
                                                <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-mongodb-spring" />
                                                    {item.duration || 60} mins
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-white group-hover:text-mongodb-spring transition-colors line-clamp-1 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                                                {item.description || 'Professional booking slot with instant calendar reservation.'}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-mongodb-spring/20 flex items-center justify-center text-[10px] font-bold text-mongodb-spring">
                                                    {organizerName[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-xs text-neutral-400 font-medium truncate max-w-[120px]">
                                                    {organizerName}
                                                </span>
                                            </div>
                                            <Link href={`/book/${item.id}`}>
                                                <Button size="sm" variant="primary" className="font-bold">
                                                    Book Now
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Access Portals Grid */}
            <section className="py-20 border-t border-white/10 bg-[#071B26]/80">
                <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                            Access Your Dedicated Workspace
                        </h2>
                        <p className="text-neutral-400 mt-1 text-sm">
                            Direct entry for administrators, service providers, and clients.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link href="/dashboard" className="group">
                            <Card hover className="bg-[#0C2331] border-white/10 p-6 h-full text-center">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-mongodb-spring/10 border border-mongodb-spring/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <LayoutDashboard className="w-6 h-6 text-mongodb-spring" />
                                </div>
                                <h3 className="font-bold text-white text-base mb-1">Organizer Dashboard</h3>
                                <p className="text-xs text-neutral-400">Manage appointment slots, schedules, custom questions & client bookings.</p>
                            </Card>
                        </Link>

                        <Link href="/home" className="group">
                            <Card hover className="bg-[#0C2331] border-white/10 p-6 h-full text-center">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-mongodb-mint/10 border border-mongodb-mint/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6 text-mongodb-mint" />
                                </div>
                                <h3 className="font-bold text-white text-base mb-1">Client Booking Portal</h3>
                                <p className="text-xs text-neutral-400">Discover appointments, check real-time open slots and reserve sessions.</p>
                            </Card>
                        </Link>

                        <Link href="/dashboard/admin" className="group">
                            <Card hover className="bg-[#0C2331] border-white/10 p-6 h-full text-center">
                                <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="font-bold text-white text-base mb-1">Admin Command Center</h3>
                                <p className="text-xs text-neutral-400">Oversee registered users, approve organizers, and monitor operations.</p>
                            </Card>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-[#001E2B] text-center">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-mongodb-spring rounded-md flex items-center justify-center">
                            <Calendar className="w-3.5 h-3.5 text-mongodb-black" />
                        </div>
                        <span className="text-base font-display font-black text-white tracking-tight">
                            SLOT<span className="text-mongodb-spring">IFY</span>
                        </span>
                    </div>
                    <p className="text-neutral-500 text-xs">
                        Next.js 16 • PostgreSQL + Drizzle ORM • Stripe Verified
                    </p>
                </div>
            </footer>
        </div>
    )
}
