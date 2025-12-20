import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppointmentForEdit } from '@/lib/actions/organizer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronLeft, Calendar, Layout, Clock, HelpCircle, Users } from 'lucide-react'
import Link from 'next/link'
import BasicInfoTab from '@/components/organizer/tabs/BasicInfoTab'
import AvailabilityTab from '@/components/organizer/tabs/AvailabilityTab'
import QuestionsTab from '@/components/organizer/tabs/QuestionsTab'
import CapacityTab from '@/components/organizer/tabs/CapacityTab'
import { TogglePublishButton } from '@/components/appointments/AppointmentActions'

export default async function EditAppointmentPage({
    params,
}: {
    params: { id: string }
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const appointment: any = await getAppointmentForEdit(params.id)

    if (!appointment) {
        notFound()
    }

    // Verify ownership (profiles.id == organizer_id)
    if (appointment.organizer_id !== user.id) {
        redirect('/dashboard')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/appointments"
                    className="flex items-center gap-2 text-neutral-500 hover:text-mongodb-spring mb-6 transition-colors group">
                    <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Appointments
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-mongodb-slate/20 p-8 rounded-2xl border border-neutral-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-mongodb-spring/5 blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant={appointment.is_active ? 'success' : 'warning'}>
                                {appointment.is_active ? 'Active' : 'Hidden'}
                            </Badge>
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Appointment ID: {appointment.id.slice(0, 8)}</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                            {appointment.title}
                        </h1>
                        <p className="text-neutral-400 mt-2 max-w-xl line-clamp-1">
                            {appointment.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 bg-mongodb-black/40 p-3 rounded-2xl backdrop-blur-md border border-neutral-800">
                        <TogglePublishButton appointmentId={appointment.id} currentStatus={appointment.is_active} />
                        <div className="w-px h-8 bg-neutral-800 mx-1" />
                        <Link href={`/book/${appointment.id}`} target="_blank">
                            <Button variant="primary" className="shadow-lg shadow-mongodb-spring/10 h-11 px-6 font-bold">
                                <Calendar className="w-4 h-4 mr-2" />
                                Preview Page
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Designer Tabs */}
            <Tabs defaultValue="basic" className="space-y-8">
                <TabsList className="bg-mongodb-black border border-neutral-800 p-1.5 rounded-xl h-auto gap-1">
                    <TabsTrigger value="basic" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-mongodb-spring data-[state=active]:text-mongodb-black transition-all">
                        <Layout className="w-4 h-4 mr-2" />
                        Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="availability" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-mongodb-spring data-[state=active]:text-mongodb-black transition-all">
                        <Clock className="w-4 h-4 mr-2" />
                        Availability
                    </TabsTrigger>
                    <TabsTrigger value="questions" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-mongodb-spring data-[state=active]:text-mongodb-black transition-all">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Booking Form
                    </TabsTrigger>
                    <TabsTrigger value="capacity" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-mongodb-spring data-[state=active]:text-mongodb-black transition-all">
                        <Users className="w-4 h-4 mr-2" />
                        Capacity
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8 transition-all">
                    <TabsContent value="basic" className="focus-visible:ring-0 outline-none">
                        <BasicInfoTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="availability" className="focus-visible:ring-0 outline-none">
                        <AvailabilityTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="questions" className="focus-visible:ring-0 outline-none">
                        <QuestionsTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="capacity" className="focus-visible:ring-0 outline-none">
                        <CapacityTab appointment={appointment} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
