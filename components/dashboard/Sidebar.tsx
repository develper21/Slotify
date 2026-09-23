'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Calendar, LayoutDashboard, Settings, User, LogOut, FileText, HelpCircle, Users, Bell, Sparkles, Plus, Shield, Layers, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/lib/actions/auth'
import { useState } from 'react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userRole?: 'admin' | 'organizer' | 'customer'
    /** Mobile drawer state (controlled by the dashboard layout) */
    mobileOpen?: boolean
    onMobileClose?: () => void
}

export function Sidebar({ className, userRole = 'organizer', mobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleSignOut = async () => {
        setIsLoggingOut(true)
        await signOut()
    }

    const navItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            roles: ['admin', 'organizer', 'customer'],
        },
        {
            name: 'Appointments',
            href: '/dashboard/appointments',
            icon: Calendar,
            roles: ['organizer'],
        },
        {
            name: 'Bookings',
            href: '/dashboard/bookings',
            icon: FileText,
            roles: ['organizer', 'customer'],
        },
        {
            name: 'Notifications',
            href: '/dashboard/notifications',
            icon: Bell,
            roles: ['admin', 'organizer', 'customer'],
        },
        {
            name: 'Form Questions',
            href: '/dashboard/questions',
            icon: HelpCircle,
            roles: ['organizer'],
        },
        {
            name: 'Users',
            href: '/dashboard/admin/users',
            icon: Users,
            roles: ['admin'],
        },
        {
            name: 'Organizers',
            href: '/dashboard/admin/organizers',
            icon: Shield,
            roles: ['admin'],
        },
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: User,
            roles: ['organizer', 'customer'],
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Settings,
            roles: ['admin', 'organizer', 'customer'],
        },
    ]

    const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

    const renderNavContent = () => (
        <>
            {/* Quick Action button for organizers */}
            {userRole === 'organizer' && (
                <div className="px-3 pt-4">
                    <Link href="/dashboard/appointments/new">
                        <Button variant="primary" size="sm" className="w-full font-bold shadow-mongodb">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Create Appointment
                        </Button>
                    </Link>
                </div>
            )}

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Menu
                </div>

                {filteredNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            className={cn(
                                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group relative',
                                isActive
                                    ? 'bg-mongodb-spring/15 text-white border border-mongodb-spring/30 shadow-[0_0_15px_rgba(0,237,100,0.1)]'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                            )}>
                            <div className="flex items-center gap-3">
                                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-mongodb-spring" : "text-neutral-500 group-hover:text-neutral-300")} />
                                <span>{item.name}</span>
                            </div>
                            {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-mongodb-spring shadow-[0_0_8px_#00ED64]" />
                            )}
                        </Link>
                    )
                })}

                <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Discover
                </div>
                <Link
                    href="/home"
                    onClick={onMobileClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                    <Sparkles className="w-4 h-4 text-mongodb-spring" />
                    <span>Public Marketplace</span>
                </Link>
            </div>

            {/* Sign Out Footer */}
            <div className="p-3 border-t border-white/10 bg-[#0C2331]/30">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-red-500/10 font-medium"
                    onClick={handleSignOut}
                    isLoading={isLoggingOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </>
    )

    const renderBrand = (onClose?: () => void) => (
        <div className="h-18 px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-gradient-to-br from-mongodb-spring to-mongodb-forest rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,237,100,0.3)]">
                    <Calendar className="w-4 h-4 text-mongodb-black" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-display font-black tracking-tight text-white flex items-center gap-0.5">
                        SLOT<span className="text-mongodb-spring">IFY</span>
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 -mt-1 font-bold">
                        Atlas Console
                    </span>
                </div>
            </Link>

            {onClose ? (
                <button
                    onClick={onClose}
                    aria-label="Close navigation menu"
                    className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5">
                    <X className="w-5 h-5" />
                </button>
            ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-mongodb-spring/10 border border-mongodb-spring/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-mongodb-spring animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-mongodb-spring uppercase">{userRole}</span>
                </div>
            )}
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn("hidden md:flex w-64 h-screen bg-[#001E2B] border-r border-white/10 flex-col fixed left-0 top-0 z-50 select-none", className)}>
                {renderBrand()}
                {renderNavContent()}
            </aside>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    'md:hidden fixed inset-0 z-[60] transition-opacity duration-300',
                    mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                aria-hidden={!mobileOpen}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onMobileClose}
                />

                {/* Sliding panel */}
                <aside
                    className={cn(
                        'absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-[#001E2B] border-r border-white/10 flex flex-col transition-transform duration-300 ease-out',
                        mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    )}>
                    {renderBrand(onMobileClose)}
                    {renderNavContent()}
                </aside>
            </div>
        </>
    )
}
