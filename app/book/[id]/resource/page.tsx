import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { appointments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function ResourceSelectionPage({
    params,
}: {
    params: { id: string }
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

    // For now, redirect to date selection as we don't have multiple resources per appointment yet
    redirect(`/book/${params.id}/date`)

    return (
        <div className="min-h-screen bg-mongodb-black py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8 text-center">
                    <p className="text-neutral-400">Loading booking flow...</p>
                </div>
            </div>
        </div>
    )
}
