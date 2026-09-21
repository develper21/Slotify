'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useSessionTimeout() {
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            // In a real app with custom JWT, we might have an API endpoint to check session validity
            try {
                const response = await fetch('/api/auth/session')
                const session = await response.json()

                if (!session || !session.user) {
                    router.push('/login')
                }
            } catch (error) {
                // If the check fails, we might just want to wait or handle it quietly
            }
        }

        const interval = setInterval(checkSession, 10 * 60 * 1000) // Check every 10 minutes

        return () => clearInterval(interval)
    }, [router])
}

export function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
    useSessionTimeout()
    return <>{children}</>
}
