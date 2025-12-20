import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppointmentForEdit, getOrganizerId } from '@/lib/actions/organizer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import BasicInfoTab from '@/components/organizer/tabs/BasicInfoTab'
import BookTab from '@/components/organizer/tabs/BookTab'
import UsersTab from '@/components/organizer/tabs/UsersTab'
import AssignmentTab from '@/components/organizer/tabs/AssignmentTab'
import CapacityTab from '@/components/organizer/tabs/CapacityTab'
import PictureTab from '@/components/organizer/tabs/PictureTab'

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

    const organizerId = await getOrganizerId(user.id)
    if (!organizerId) {
        redirect('/dashboard')
    }

    const appointment: any = await getAppointmentForEdit(params.id)

    if (!appointment) {
        notFound()
    }

    // Verify ownership
    if (appointment.organizer_id !== organizerId) {
        redirect('/dashboard')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/appointments"
                    className="flex items-center gap-2 text-neutral-400 hover:text-white mb-4 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Appointments
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">
                            Edit Appointment
                        </h1>
                        <p className="text-neutral-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-mongodb-spring"></span>
                            {appointment.title}
                        </p>
                    </div>
                    <Link href={`/book/${appointment.id}`} target="_blank">
                        <Button variant="outline" className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
                            <Calendar className="w-4 h-4 mr-2" />
                            View Booking Page
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="bg-mongodb-slate/50 border-neutral-800 p-1 flex-wrap h-auto gap-2">
                    <TabsTrigger value="basic" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">Basic Info</TabsTrigger>
                    <TabsTrigger value="book" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">Book</TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">Users</TabsTrigger>
                    <TabsTrigger value="assignment" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">Assignment</TabsTrigger>
                    <TabsTrigger value="capacity" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">Manage Capacity</TabsTrigger>
                    <TabsTrigger value="picture" className="data-[state=active]:bg-mongodb-black data-[state=active]:text-mongodb-spring">Picture</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="focus-visible:ring-0 outline-none">
                    <BasicInfoTab appointment={appointment} />
                </TabsContent>

                <TabsContent value="book" className="focus-visible:ring-0 outline-none">
                    <BookTab appointment={appointment} />
                </TabsContent>

                <TabsContent value="users" className="focus-visible:ring-0 outline-none">
                    <UsersTab appointment={appointment} />
                </TabsContent>

                <TabsContent value="assignment" className="focus-visible:ring-0 outline-none">
                    <AssignmentTab appointment={appointment} />
                </TabsContent>

                <TabsContent value="capacity" className="focus-visible:ring-0 outline-none">
                    <CapacityTab appointment={appointment} />
                </TabsContent>

                <TabsContent value="picture" className="focus-visible:ring-0 outline-none">
                    <PictureTab appointment={appointment} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
