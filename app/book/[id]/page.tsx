import { Suspense } from 'react'
import { getAppointmentById } from '@/lib/actions/appointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Calendar, Clock, MapPin, Users, ArrowLeft, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'
import { Navbar } from '@/components/Navbar'

async function AppointmentContent({ id }: { id: string }) {
    const appointment = await getAppointmentById(id)

    if (!appointment) {
        return (
            <div className="text-center py-32">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-4xl font-display font-bold text-white mb-4">Appointment Not Found</h1>
                <p className="text-neutral-400 mb-10 text-lg">The appointment you're looking for doesn't exist or has been removed.</p>
                <Link href="/home">
                    <Button variant="outline" size="lg">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        )
    }

    const organizerName = appointment.organizer?.businessName || appointment.organizer?.fullName || 'Expert Organizer'

    return (
        <div className="relative min-h-screen bg-mongodb-black pb-24">
            <Navbar />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-mongodb-spring/5 blur-[120px] rounded-full -mt-24 pointer-events-none" />

            <div className="container mx-auto px-4 pt-12 relative z-10">
                <Link href="/home" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to all appointments
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Badge variant="primary" className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                                    Professional
                                </Badge>
                                <div className="h-px flex-1 bg-gradient-to-r from-neutral-800 to-transparent" />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
                                {appointment.title}
                            </h1>
                            <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl">
                                {appointment.description || 'Experience top-tier service with our expert-led sessions. Designed for those who demand excellence.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-mongodb-slate/30 border-neutral-800/50 hover:border-mongodb-spring/30 transition-colors">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-12 h-12 bg-mongodb-spring/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-mongodb-spring" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold mb-1">Duration</h3>
                                        <p className="text-neutral-400">{formatDuration(appointment.duration?.toString() || '60')}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-mongodb-slate/30 border-neutral-800/50 hover:border-mongodb-spring/30 transition-colors">
                                <CardContent className="p-6 flex items-start gap-4">
                                    <div className="w-12 h-12 bg-mongodb-spring/10 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-mongodb-spring" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold mb-1">Location</h3>
                                        <p className="text-neutral-400">{appointment.locationDetails || 'Online Session'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="pt-12 border-t border-neutral-800">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-mongodb p-1">
                                    <div className="w-full h-full bg-mongodb-black rounded-[14px] flex items-center justify-center text-3xl font-bold text-white">
                                        {organizerName[0]}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-mongodb-spring font-bold uppercase tracking-widest text-xs mb-1">Expert Organizer</p>
                                    <h2 className="text-3xl font-display font-bold text-white">{organizerName}</h2>
                                </div>
                            </div>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                {appointment.organizer?.businessDescription || 'A recognized leader in the field, dedicated to providing high-impact professional services and exceptional client experiences.'}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-mongodb-spring/20 bg-mongodb-slate/50 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-mongodb" />
                            <CardHeader className="pt-8 pb-4">
                                <CardTitle className="text-2xl font-display font-bold text-white">Reserve Your Spot</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8 pb-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <ShieldCheck className="w-5 h-5 text-mongodb-spring" />
                                        <span>Instant Confirmation</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-300">
                                        <Zap className="w-5 h-5 text-mongodb-spring" />
                                        <span>Secure Scheduling</span>
                                    </div>
                                </div>

                                {appointment.price && Number(appointment.price) > 0 && (
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-neutral-500 text-sm font-medium mb-1">Professional Fee</p>
                                        <p className="text-4xl font-bold text-white">
                                            ${appointment.price}<span className="text-lg text-neutral-500">/USD</span>
                                        </p>
                                    </div>
                                )}

                                <Link href={`/book/${id}/date`}>
                                    <Button size="xl" className="w-full bg-mongodb-spring text-mongodb-black hover:bg-white shadow-[0_10px_30px_rgba(0,237,100,0.2)]">
                                        Book Appointment
                                    </Button>
                                </Link>

                                <p className="text-center text-xs text-neutral-500 font-medium">
                                    No commitment. Pay securely during the next step.
                                </p>
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
        <Suspense fallback={
            <div className="min-h-screen bg-mongodb-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-mongodb-spring/20 border-t-mongodb-spring rounded-full animate-spin" />
                    <p className="text-neutral-500 animate-pulse">Loading experience...</p>
                </div>
            </div>
        }>
            <AppointmentContent id={params.id} />
        </Suspense>
    )
}

