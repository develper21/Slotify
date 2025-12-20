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

    const appointment = await getAppointmentForEdit(params.id)

    if (!appointment) {
        notFound()
    }

    // Verify ownership
    if (appointment.organizer_id !== organizerId) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Edit Appointment
                    </h1>
                    <p className="text-neutral-600">{appointment.title}</p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="basic">
                    <TabsList className="mb-6">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="book">Book</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="assignment">Assignment</TabsTrigger>
                        <TabsTrigger value="capacity">Manage Capacity</TabsTrigger>
                        <TabsTrigger value="picture">Picture</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <BasicInfoTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="book">
                        <BookTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="users">
                        <UsersTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="assignment">
                        <AssignmentTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="capacity">
                        <CapacityTab appointment={appointment} />
                    </TabsContent>

                    <TabsContent value="picture">
                        <PictureTab appointment={appointment} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
