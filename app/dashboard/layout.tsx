import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
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
        <div className="min-h-screen bg-mongodb-black text-white font-sans selection:bg-mongodb-spring/30">
            <Sidebar userRole={profile.role || 'customer'} />
            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <Topbar user={{
                    id: profile.id,
                    email: profile.email || '',
                    full_name: profile.fullName || '',
                    avatar_url: profile.avatarUrl || '',
                    role: profile.role || 'customer'
                }} />
                <main className="flex-1 p-4 md:p-6 bg-mongodb-black">
                    {children}
                </main>
            </div>
        </div>
    )
}
