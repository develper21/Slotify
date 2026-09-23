import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const user = session.user

    // Fetch full profile if needed, or just use session user
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id)
    })

    if (!profile) {
        redirect('/login')
    }

    return (
        <DashboardShell
            user={{
                id: profile.id,
                email: profile.email || '',
                full_name: profile.fullName || '',
                avatar_url: profile.avatarUrl || '',
                role: profile.role || 'customer'
            }}
        >
            {children}
        </DashboardShell>
    )
}
