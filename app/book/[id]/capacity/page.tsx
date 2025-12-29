import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { appointments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    const appointment = await db.query.appointments.findFirst({
        where: eq(appointments.id, params.id)
    })

    if (!appointment) {
        redirect('/')
    }

    const maxCapacity = appointment.maxCapacity || 1
    const minCapacity = 1

    return (
        <div className="min-h-screen bg-mongodb-black py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Select Capacity
                    </h1>
                    <p className="text-neutral-400">
                        How many spots would you like to book?
                    </p>
                </div>

                <div className="mb-8 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                            ✓
                        </div>
                        <span className="text-sm text-neutral-400">Resource</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-green-500" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                            ✓
                        </div>
                        <span className="text-sm text-neutral-400">Date</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-green-500" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                            ✓
                        </div>
                        <span className="text-sm text-neutral-400">Time</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-mongodb-spring" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-mongodb-spring text-mongodb-black flex items-center justify-center text-sm font-bold">
                            4
                        </div>
                        <span className="text-sm font-medium text-mongodb-spring">Capacity</span>
                    </div>
                </div>

                <Card className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-mongodb-spring/10 flex items-center justify-center">
                                <Users className="w-10 h-10 text-mongodb-spring" />
                            </div>

                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Number of Spots
                                </h3>
                                <p className="text-sm text-neutral-400">
                                    Available: {maxCapacity} spots
                                </p>
                            </div>

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

                <Link href={`/book/${params.id}/time?${new URLSearchParams(searchParams as any).toString()}`}>
                    <Button variant="ghost" className="w-full text-neutral-400 hover:text-white">
                        ← Back to Time Selection
                    </Button>
                </Link>
            </div>
        </div>
    )
}
