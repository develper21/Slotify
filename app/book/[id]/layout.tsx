'use client'

import { BookingProgress } from '@/components/booking/BookingProgress'
import { Navbar } from '@/components/Navbar'

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-mongodb-black text-white selection:bg-mongodb-spring/30">
            <Navbar />
            <main className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <BookingProgress />
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
