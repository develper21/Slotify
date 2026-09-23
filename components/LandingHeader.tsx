'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Calendar, LayoutDashboard, Sparkles, Menu, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Landing page header. Server component se `session` prop receive karta hai
 * (client-side fetch ki zaroorat nahi). Mobile par hamburger + slide-down
 * drawer render karta hai jo pehle missing tha.
 */
export function LandingHeader({ session }: { session: { user?: { role?: string } } | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navLinks = [
        { name: 'Marketplace', href: '/home', icon: Sparkles },
        { name: 'Features', href: '#features' },
        { name: 'Architecture', href: '#demo' },
        { name: 'Organizer Console', href: '/dashboard' },
    ]

    const role = session?.user?.role
    const dashboardHref =
        role === 'admin' ? '/dashboard/admin' : role === 'organizer' ? '/dashboard' : '/home'

    return (
        <header className="sticky top-0 z-50 bg-[#001E2B]/85 backdrop-blur-xl border-b border-white/10">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-18 py-3">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-mongodb-spring to-mongodb-forest rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,237,100,0.35)] group-hover:scale-105 transition-transform">
                            <Calendar className="w-5 h-5 text-mongodb-black" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-display font-black tracking-tight text-white flex items-center">
                                SLOT<span className="text-mongodb-spring">IFY</span>
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold -mt-1">
                                Atlas Booking Cloud
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-300">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    'hover:text-white transition-colors flex items-center gap-1.5',
                                    pathname === link.href && 'text-mongodb-spring'
                                )}>
                                {link.icon && <link.icon className="w-4 h-4 text-mongodb-spring" />}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <Link href={dashboardHref}>
                                <Button variant="primary" size="sm" className="font-bold">
                                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-white">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="primary" size="sm" className="font-bold shadow-mongodb">
                                        Get Started
                                        <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#0C2331] p-4 space-y-1 animate-slide-up">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/5">
                            {link.icon && <link.icon className="w-5 h-5 text-mongodb-spring" />}
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                        {session ? (
                            <Link href={dashboardHref} className="block" onClick={() => setIsOpen(false)}>
                                <Button variant="primary" className="w-full">
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                                    <Button variant="subtle" className="w-full">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup" className="block" onClick={() => setIsOpen(false)}>
                                    <Button variant="primary" className="w-full">
                                        Get Started
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
