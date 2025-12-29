'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Calendar, LayoutDashboard, Settings, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { name: 'Home', href: '/home', icon: Calendar },
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Bookings', href: '/dashboard/bookings', icon: User },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    return (
        <nav className="sticky top-0 z-50 bg-mongodb-black/80 backdrop-blur-md border-b border-neutral-700/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-mongodb-spring rounded-mongodb flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-mongodb-black" />
                        </div>
                        <span className="text-xl font-display font-bold text-white tracking-tighter">
                            SLOTIFY
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 px-4 py-2 rounded-mongodb text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-mongodb-spring/10 text-mongodb-spring'
                                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                    )}>
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-red-400">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                        <Button variant="primary" size="sm">
                            New Slot
                        </Button>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-neutral-400 hover:text-white">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-mongodb-slate border-b border-neutral-700/50 animate-in">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-mongodb text-base font-medium',
                                        isActive
                                            ? 'bg-mongodb-spring/10 text-mongodb-spring'
                                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                    )}>
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                        <div className="pt-4 pb-2 border-t border-neutral-700/50">
                            <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-mongodb">
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
