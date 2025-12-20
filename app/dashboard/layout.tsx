import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()

    // 1. Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Fetch user role from profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const userRole = profile?.role || 'customer'

    return (
        <div className="min-h-screen bg-mongodb-black text-white font-sans selection:bg-mongodb-spring/30">
            {/* Navigation Sidebar */}
            <Sidebar userRole={userRole} />

            {/* Main Viewport */}
            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Global Topbar */}
                <Topbar />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 bg-mongodb-black">
                    {children}
                </main>
            </div>
        </div>
    )
}
