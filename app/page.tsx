import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Calendar, LayoutDashboard, Shield, Users, LogIn, UserPlus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
    return (
        <div className="min-h-screen bg-mongodb-black flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-xl mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mongodb-spring/10 border border-mongodb-spring/20 text-mongodb-spring text-xs font-bold uppercase tracking-widest mb-4">
                    Slotify Appointment Booking System
                </div>
                <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-3">
                    SLOT<span className="gradient-text">IFY</span>
                </h1>
                <p className="text-neutral-400 text-lg">
                    Select a section below to access customer, organizer, or admin portals:
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full py-7 text-base border-neutral-800 hover:bg-neutral-800/80 text-white justify-start px-6">
                        <LogIn className="w-5 h-5 mr-3 text-mongodb-spring" />
                        Log In to Account
                    </Button>
                </Link>
                <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full py-7 text-base border-neutral-800 hover:bg-neutral-800/80 text-white justify-start px-6">
                        <UserPlus className="w-5 h-5 mr-3 text-mongodb-spring" />
                        Create New Account
                    </Button>
                </Link>
                <Link href="/home" className="w-full">
                    <Button className="w-full py-7 text-base bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90 justify-start px-6 font-bold shadow-lg">
                        <Calendar className="w-5 h-5 mr-3 text-mongodb-black" />
                        Public Marketplace (/home)
                    </Button>
                </Link>
                <Link href="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full py-7 text-base border-neutral-800 hover:bg-neutral-800/80 text-white justify-start px-6">
                        <LayoutDashboard className="w-5 h-5 mr-3 text-blue-400" />
                        Organizer Dashboard
                    </Button>
                </Link>
                <Link href="/dashboard/admin" className="w-full">
                    <Button variant="outline" className="w-full py-7 text-base border-neutral-800 hover:bg-neutral-800/80 text-white justify-start px-6">
                        <Shield className="w-5 h-5 mr-3 text-purple-400" />
                        Admin Control Panel
                    </Button>
                </Link>
                <Link href="/dashboard/bookings" className="w-full">
                    <Button variant="outline" className="w-full py-7 text-base border-neutral-800 hover:bg-neutral-800/80 text-white justify-start px-6">
                        <Users className="w-5 h-5 mr-3 text-yellow-400" />
                        My Bookings
                    </Button>
                </Link>
            </div>
        </div>
    )
}
