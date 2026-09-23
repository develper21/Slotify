'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'

/**
 * Client shell for the dashboard: owns the mobile drawer state and wires the
 * Topbar hamburger trigger to the Sidebar mobile drawer.
 */
export function DashboardShell({
    user,
    children,
}: {
    user: any
    children: React.ReactNode
}) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    return (
        <div className="min-h-screen bg-mongodb-black text-white font-sans selection:bg-mongodb-spring/30">
            <Sidebar
                userRole={user.role || 'customer'}
                mobileOpen={mobileNavOpen}
                onMobileClose={() => setMobileNavOpen(false)}
            />
            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <Topbar user={user} onMobileMenuClick={() => setMobileNavOpen(true)} />
                <main className="flex-1 p-4 md:p-6 bg-mongodb-black">
                    {children}
                </main>
            </div>
        </div>
    )
}
