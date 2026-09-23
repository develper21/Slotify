'use client'

import { Bell, Search, Activity, Sparkles, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { NotificationBell } from './NotificationBell'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Topbar({ className, user, onMobileMenuClick }: { className?: string; user?: any; onMobileMenuClick?: () => void }) {
    const router = useRouter()
    const [search, setSearch] = useState('')

    // Global search: dashboard ke appointments/bookings pages par URL search param
    // ke through query karta hai (pehle yeh input dead tha).
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const q = search.trim()
        if (!q) return
        router.push(`/dashboard/appointments?search=${encodeURIComponent(q)}`)
    }

    return (
        <header className={cn("h-18 bg-[#001E2B]/85 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 backdrop-blur-xl transition-all", className)}>
            {/* Mobile hamburger — Sidebar drawer kholta hai (mobile users trapped the) */}
            <button
                type="button"
                onClick={onMobileMenuClick}
                aria-label="Open navigation menu"
                className="md:hidden p-2 -ml-1 mr-1 text-neutral-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>

            <form onSubmit={handleSearchSubmit} className="hidden md:block flex-1 max-w-lg">
                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search appointments..."
                        className="w-full pl-10 pr-4 py-2 bg-[#0C2331] border border-white/10 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-mongodb-spring focus:ring-2 focus:ring-mongodb-spring/15 transition-all"
                    />
                </div>
            </form>

            <div className="flex items-center gap-4 ml-4">
                {/* System status pill */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C2331] border border-white/5 text-xs text-neutral-400">
                    <span className="w-2 h-2 rounded-full bg-mongodb-spring animate-pulse" />
                    <span className="font-mono text-[11px] text-neutral-300">Engine: Active</span>
                </div>

                <Link href="/home" className="hidden sm:inline-flex">
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white text-xs font-semibold gap-1.5 border border-white/5 bg-[#0C2331]">
                        <Sparkles className="w-3.5 h-3.5 text-mongodb-spring" />
                        Explore Marketplace
                    </Button>
                </Link>

                {user && <NotificationBell userId={user.id} />}

                <div className="h-6 w-px bg-white/10" />

                {/* User Pill */}
                <Link href="/dashboard/profile" className="flex items-center gap-3 p-1 pr-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-9 h-9 bg-gradient-to-br from-mongodb-spring/20 to-mongodb-forest/40 rounded-xl flex items-center justify-center border border-mongodb-spring/30 shadow-[0_0_10px_rgba(0,237,100,0.15)]">
                        <span className="text-xs font-black text-mongodb-spring uppercase">
                            {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() || 'US'}
                        </span>
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-bold text-white group-hover:text-mongodb-spring transition-colors leading-tight">
                            {user?.full_name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold leading-tight mt-0.5">
                            {user?.role || 'Member'}
                        </p>
                    </div>
                </Link>
            </div>
        </header>
    )
}
