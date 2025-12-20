import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
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
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body>
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    )
}
