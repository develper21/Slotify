'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { NotificationBell } from './NotificationBell'

export function Topbar({ className, user }: { className?: string; user?: any }) {
    return (
        <header className={cn("h-16 bg-mongodb-black/95 border-b border-neutral-800 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-sm", className)}>
            {/* Left: Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-10 pr-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring/20 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 ml-4">
                {user && <NotificationBell userId={user.id} />}

                <div className="h-8 w-px bg-neutral-800" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">
                            {user?.user_metadata?.full_name || 'Account'}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">
                            {user?.email}
                        </p>
                    </div>
                    <div className="w-9 h-9 bg-mongodb-spring/10 rounded-xl flex items-center justify-center border border-mongodb-spring/20 shadow-lg shadow-mongodb-spring/5 overflow-hidden">
                        <div className="text-xs font-black text-mongodb-spring uppercase">
                            {user?.email?.slice(0, 2).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
