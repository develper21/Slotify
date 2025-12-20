import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { User, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

async function getAppointmentResources(appointmentId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('resources')
        .select(`
            *,
            users_assignments!inner (
                appointment_id
            )
        `)
        .eq('users_assignments.appointment_id', appointmentId)
        .eq('is_active', true)

    if (error) {
        console.error('Error fetching resources:', error)
        return []
    }

    return data || []
}

export default async function ResourceSelectionPage({
    params,
}: {
    params: { id: string }
}) {
    const supabase = createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    // Get appointment details
    const { data: appointment }: { data: any } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!appointment) {
        redirect('/')
    }

    const resources = await getAppointmentResources(params.id)

    // If no resources, skip to date selection
    if (resources.length === 0) {
        redirect(`/book/${params.id}/date`)
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Select a Resource
                    </h1>
                    <p className="text-neutral-600">
                        Choose who you'd like to book with for "{appointment.title}"
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                            1
                        </div>
                        <span className="text-sm font-medium text-primary">Resource</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-neutral-200" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-sm font-semibold">
                            2
                        </div>
                        <span className="text-sm text-neutral-500">Date</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-neutral-200" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-sm font-semibold">
                            3
                        </div>
                        <span className="text-sm text-neutral-500">Time</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-neutral-200" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-sm font-semibold">
                            4
                        </div>
                        <span className="text-sm text-neutral-500">Details</span>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map((resource: any) => (
                        <Card key={resource.id} hover className="overflow-hidden">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle>{resource.name}</CardTitle>
                                        {resource.title && (
                                            <p className="text-sm text-neutral-600 mt-1">
                                                {resource.title}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {resource.description && (
                                    <p className="text-sm text-neutral-600">
                                        {resource.description}
                                    </p>
                                )}

                                {resource.specialization && (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="info">
                                            {resource.specialization}
                                        </Badge>
                                    </div>
                                )}

                                {resource.availability_status === 'available' && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Available</span>
                                    </div>
                                )}

                                <Link href={`/book/${params.id}/date?resource=${resource.id}`} className="block">
                                    <Button className="w-full">
                                        Select {resource.name}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Link href={`/appointments/${params.id}`}>
                        <Button variant="ghost">
                            ← Back to Appointment Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
