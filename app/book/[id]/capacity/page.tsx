import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { CapacitySelector } from '@/components/booking/CapacitySelector'

export default async function CapacitySelectionPage({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams: { resource?: string; date?: string; slot?: string }
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
        .select(`
            *,
            appointment_settings (*)
        `)
        .eq('id', params.id)
        .single()

    if (!appointment) {
        redirect('/')
    }

    // Get selected slot to check available capacity
    const { data: slot }: { data: { available_capacity?: number } | null } = searchParams.slot
        ? await supabase
            .from('time_slots')
            .select('*')
            .eq('id', searchParams.slot)
            .single()
        : { data: null }

    const settings: any = appointment?.appointment_settings?.[0]
    const maxCapacity = slot?.available_capacity || settings?.max_capacity || 10
    const minCapacity = settings?.min_capacity || 1

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Select Capacity
                    </h1>
                    <p className="text-neutral-600">
                        How many spots would you like to book?
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                            ✓
                        </div>
                        <span className="text-sm text-neutral-500">Resource</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-green-500" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                            ✓
                        </div>
                        <span className="text-sm text-neutral-500">Date</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-green-500" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                            ✓
                        </div>
                        <span className="text-sm text-neutral-500">Time</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-primary" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                            4
                        </div>
                        <span className="text-sm font-medium text-primary">Capacity</span>
                    </div>
                </div>

                {/* Capacity Selection Card */}
                <Card className="mb-6">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-10 h-10 text-primary" />
                            </div>

                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                    Number of Spots
                                </h3>
                                <p className="text-sm text-neutral-600">
                                    Available: {maxCapacity} spots
                                </p>
                            </div>

                            {/* Capacity Selector */}
                            <CapacitySelector
                                appointmentId={params.id}
                                minCapacity={minCapacity}
                                maxCapacity={maxCapacity}
                                resourceId={searchParams.resource}
                                date={searchParams.date}
                                slotId={searchParams.slot}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Back Button */}
                <Link href={`/book/${params.id}/time?${new URLSearchParams(searchParams as any).toString()}`}>
                    <Button variant="ghost" className="w-full">
                        ← Back to Time Selection
                    </Button>
                </Link>
            </div>
        </div>
    )
}
