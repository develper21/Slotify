import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
    display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Slotify - Smart Appointment Booking',
    description: 'Professional appointment booking system with real-time availability, capacity management, and seamless scheduling.',
    keywords: ['appointment', 'booking', 'scheduling', 'calendar', 'slots'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jakarta.variable} dark`}>
            <body className="bg-mongodb-black text-mongodb-light min-h-screen">
                {children}
                <Toaster
                    position="top-right"
                    richColors
                    theme="dark"
                />
            </body>
        </html>
    )
}
