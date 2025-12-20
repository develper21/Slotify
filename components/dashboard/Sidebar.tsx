'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Calendar, LayoutDashboard, Settings, User, LogOut, FileText, HelpCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userRole?: 'admin' | 'organizer' | 'customer'
}

export function Sidebar({ className, userRole = 'organizer' }: SidebarProps) {
    const pathname = usePathname()

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
            name: 'Users',
            href: '/dashboard/admin/users',
            icon: Users,
            roles: ['admin'],
        },
        {
            name: 'Organizers',
            href: '/dashboard/admin/organizers',
            icon: Users,
            roles: ['admin'],
        },
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: User,
            roles: ['organizer', 'customer'],
        },
        {
            name: 'Questions',
            href: '/dashboard/questions',
            icon: HelpCircle,
            roles: ['organizer'],
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: Settings,
            roles: ['admin', 'organizer', 'customer'],
        },
    ]

    const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

    return (
        <div className={cn("w-64 h-screen bg-mongodb-black/95 border-r border-neutral-800 flex flex-col fixed left-0 top-0 z-50", className)}>
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-neutral-800">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-mongodb-spring rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-mongodb-black" />
                    </div>
                    <span className="text-xl font-display font-bold text-white tracking-tighter">
                        SLOTIFY
                    </span>
                </Link>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {filteredNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                                isActive
                                    ? 'bg-mongodb-spring/10 text-mongodb-spring'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-mongodb-spring" : "text-neutral-500 group-hover:text-white")} />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-neutral-800">
                <Button variant="ghost" className="w-full justify-start text-neutral-400 hover:text-red-400 hover:bg-red-900/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
