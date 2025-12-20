'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Topbar({ className }: { className?: string }) {
    return (
        <header className={cn("h-16 bg-mongodb-black/95 border-b border-neutral-800 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-sm", className)}>
            {/* Left: Search?? Or Breadcrumbs? Let's do Search for now as per dashboard mockup */}
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
                <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-white">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-mongodb-spring rounded-full border-2 border-mongodb-black" />
                </Button>

                <div className="h-8 w-px bg-neutral-800" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Organizer</p>
                        <p className="text-xs text-neutral-500">organizer@example.com</p>
                    </div>
                    <div className="w-9 h-9 bg-mongodb-spring/10 rounded-full flex items-center justify-center border border-mongodb-spring/20">
                        <span className="text-sm font-bold text-mongodb-spring">OR</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
