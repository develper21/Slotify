import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // In our mocked environment, we can fetch the user.
    // The mocked createClient returns a mocked user with role 'organizer' by default in my previous edit.
    const supabase = createClient()

    // Get session/user - Mock client returns valid session
    const { data: { user } } = await supabase.auth.getUser()

    // Default role 'organizer' as per mock client configuration
    let userRole: 'admin' | 'organizer' | 'customer' = 'organizer'

    // Try to get role from mocked DB
    if (user) {
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData && userData.role) {
            userRole = userData.role as any
        }
    }

    return (
        <div className="min-h-screen bg-mongodb-black text-white font-sans selection:bg-mongodb-spring/30">
            {/* Fixed Sidebar */}
            <Sidebar userRole={userRole} />

            {/* Main Content Area */}
            <div className="pl-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Fixed Topbar */}
                <Topbar />

                {/* Scrollable Page Content */}
                <main className="flex-1 p-6 bg-mongodb-black">
                    {children}
                </main>
            </div>
        </div>
    )
}
