'use client'

import { usePathname } from 'next/navigation'
import { Calendar, CheckCircle, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isLogin = pathname.includes('login')
    const isSignup = pathname.includes('signup')
    const isForgotPassword = pathname.includes('forgot-password')
    const isVerify = pathname.includes('verify-email')

    return (
        <div className="min-h-screen bg-mongodb-black flex flex-col md:flex-row overflow-hidden">
            <div className="hidden md:flex md:w-1/2 lg:w-[60%] bg-mongodb-black p-12 lg:p-24 flex-col justify-between relative overflow-hidden border-r border-neutral-800">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-mongodb-spring/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-mongodb-spring/10 blur-[120px] rounded-full animate-pulse-glow" />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-mongodb-spring rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,237,100,0.3)]">
                            <Calendar className="w-6 h-6 text-mongodb-black" />
                        </div>
                        <span className="text-2xl font-display font-bold text-white tracking-tighter">
                            SLOTIFY
                        </span>
                    </Link>

                    <h1 className="text-5xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-8">
                        {isLogin && <><span className="gradient-text">Welcome</span> back to the future of booking.</>}
                        {isSignup && <><span className="gradient-text">Start</span> your growth journey today.</>}
                        {isForgotPassword && <>No worries, <br /><span className="gradient-text">we've got</span> you covered.</>}
                        {isVerify && <>One last <span className="gradient-text">step</span> to perfection.</>}
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-lg leading-relaxed">
                        Join the most efficient scheduling ecosystem. Manage appointments, track results, and grow your business with Slotify.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="p-8 rounded-3xl bg-mongodb-slate/40 border border-neutral-700/50 backdrop-blur-xl shadow-2xl animate-float">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-mongodb-spring/20 flex items-center justify-center">
                                    <Star className="w-6 h-6 text-mongodb-spring" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">Premium Experience</p>
                                    <p className="text-xs text-neutral-500">Trusted by top professionals</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-mongodb-spring/10 border border-mongodb-spring/20 text-[10px] font-bold text-mongodb-spring uppercase">
                                Verified
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-mongodb-black/50 border border-neutral-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-mongodb-spring animate-pulse" />
                                    <span className="text-sm text-neutral-300">New Booking: Marketing Strategy</span>
                                </div>
                                <span className="text-xs text-neutral-500 font-medium">Just now</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-mongodb-black/50 border border-neutral-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-mongodb-spring/50" />
                                    <span className="text-sm text-neutral-300">Automated Reminder Sent</span>
                                </div>
                                <span className="text-xs text-neutral-500 font-medium">2m ago</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-neutral-800 pt-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-mongodb-black bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                                        USR
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-mongodb-black bg-mongodb-spring/20 text-mongodb-spring flex items-center justify-center text-[10px] font-bold">
                                    +12k
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 font-medium">Over 200,000 slots booked</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center relative overflow-hidden bg-mongodb-black">
                <div className="md:hidden absolute -top-48 -right-48 w-96 h-96 bg-mongodb-spring/5 blur-[120px] rounded-full" />

                <div className="w-full max-w-md mx-auto p-8 md:p-12 relative z-10">
                    <div className="md:hidden flex flex-col items-center mb-12">
                        <div className="w-12 h-12 bg-mongodb-spring rounded-xl flex items-center justify-center shadow-mongodb mb-4">
                            <Calendar className="w-7 h-7 text-mongodb-black" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tighter">SLOTIFY</h2>
                    </div>

                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </div>

                <div className="absolute bottom-8 left-0 w-full text-center text-neutral-600 text-[10px] uppercase tracking-[0.2em] font-bold">
                    © 2025 Slotify Professional • Secured by Supabase
                </div>
            </div>
        </div>
    )
}
