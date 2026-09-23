'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Calendar, LayoutDashboard, Settings, User, LogOut, Menu, X, PlusCircle, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'

type SessionUser = { id: string; email: string; role: string }

/**
 * Public navbar. Session ko /api/auth/session se fetch karta hai aur uske
 * hisab se render karta hai:
 *  - Guest  : Sign In + Get Started (koi organizer controls nahi)
 *  - Customer: My Bookings + Settings (no New Slot / dashboard console)
 *  - Organizer: full console links + New Slot
 *  - Admin  : Admin dashboard link
 */
export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<SessionUser | null>(null)
    const [sessionLoading, setSessionLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        fetch('/api/auth/session')
            .then((res) => (res.ok ? res.json() : { user: null }))
            .then((data) => {
                if (mounted) setUser(data?.user || null)
            })
            .catch(() => {
                if (mounted) setUser(null)
            })
            .finally(() => {
                if (mounted) setSessionLoading(false)
            })
        return () => {
            mounted = false
        }
    }, [])

    const role = user?.role
    const isOrganizer = role === 'organizer' || role === 'admin'

    const navItems = [
        { name: 'Marketplace', href: '/home', icon: Sparkles, show: true },
        { name: role === 'admin' ? 'Admin Console' : 'Organizer Dashboard', href: role === 'admin' ? '/dashboard/admin' : '/dashboard', icon: LayoutDashboard, show: isOrganizer },
        { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar, show: !!user },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings, show: !!user },
    ].filter((item) => item.show)

    return (
        <nav className="sticky top-0 z-50 bg-[#001E2B]/85 backdrop-blur-xl border-b border-white/10 transition-all">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-18 py-3">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-mongodb-spring to-mongodb-forest rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,237,100,0.35)] group-hover:scale-105 transition-transform">
                            <Calendar className="w-5 h-5 text-mongodb-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-display font-black tracking-tight text-white flex items-center gap-1">
                                SLOT<span className="text-mongodb-spring">IFY</span>
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 -mt-1 font-semibold">
                                Atlas Scheduler
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-1.5 bg-[#0C2331]/80 p-1.5 rounded-xl border border-white/5">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
                                        isActive
                                            ? 'bg-mongodb-spring text-mongodb-black shadow-[0_2px_10px_rgba(0,237,100,0.3)]'
                                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                    )}>
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right CTAs — session ke hisab se */}
                    <div className="hidden md:flex items-center gap-3">
                        {sessionLoading ? (
                            <div className="w-24 h-8 rounded-lg bg-white/5 animate-pulse" />
                        ) : !user ? (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="primary" size="sm" className="font-bold">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                {isOrganizer && (
                                    <Link href="/dashboard/appointments/new">
                                        <Button variant="primary" size="sm" className="font-bold">
                                            <PlusCircle className="w-4 h-4 mr-1.5" />
                                            New Slot
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-neutral-400 hover:text-red-400 hover:bg-red-500/10"
                                    onClick={() => signOut()}>
                                    <LogOut className="w-4 h-4 mr-1.5" />
                                    Sign Out
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden bg-[#0C2331] border-b border-white/10 p-4 space-y-2 animate-slide-up">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold',
                                    isActive
                                        ? 'bg-mongodb-spring text-mongodb-black'
                                        : 'text-neutral-300 hover:bg-white/5'
                                )}>
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                        {sessionLoading ? null : !user ? (
                            <>
                                <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                                    <Button variant="subtle" className="w-full">Sign In</Button>
                                </Link>
                                <Link href="/signup" className="block" onClick={() => setIsOpen(false)}>
                                    <Button variant="primary" className="w-full">Get Started</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                {isOrganizer && (
                                    <Link href="/dashboard/appointments/new" className="block" onClick={() => setIsOpen(false)}>
                                        <Button variant="primary" className="w-full">
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Create New Slot
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="ghost"
                                    className="w-full text-red-400 hover:bg-red-500/10 justify-start"
                                    onClick={() => {
                                        setIsOpen(false)
                                        signOut()
                                    }}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
