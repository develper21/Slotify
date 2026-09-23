import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getOrganizerAppointments } from '@/lib/actions/organizer'
import { QuestionsManager } from '@/components/organizer/QuestionsManager'
import { HelpCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function QuestionsPage() {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    // Organizer-only area (customers ko dashboard par bhejo)
    if (session.user.role !== 'organizer' && session.user.role !== 'admin') {
        redirect('/dashboard')
    }

    const appointments = await getOrganizerAppointments(session.user.id)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-mongodb-spring/10 text-mongodb-spring">
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-mongodb-spring">Form Intake Control</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                    Booking Question Templates
                </h1>
                <p className="text-neutral-400 text-sm mt-1">
                    Manage custom intake questions and required customer fields across all your appointment offerings.
                </p>
            </div>

            <QuestionsManager appointments={appointments as any} />
        </div>
    )
}
