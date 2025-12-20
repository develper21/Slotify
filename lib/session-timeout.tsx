'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * Session timeout configuration
 */
const SESSION_CONFIG = {
    // Check session every 5 minutes
    checkInterval: 5 * 60 * 1000,
    // Warn user 5 minutes before expiry
    warningBeforeExpiry: 5 * 60 * 1000,
    // Auto refresh token when 10 minutes remaining
    refreshBeforeExpiry: 10 * 60 * 1000,
}

/**
 * Hook to handle session timeout and auto-refresh
 */
export function useSessionTimeout() {
    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()
        let warningShown = false

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                // No session, redirect to login
                router.push('/login')
                return
            }

            const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
            const now = Date.now()
            const timeUntilExpiry = expiresAt - now

            // Auto refresh if within refresh window
            if (timeUntilExpiry < SESSION_CONFIG.refreshBeforeExpiry && timeUntilExpiry > 0) {
                try {
                    const { error } = await supabase.auth.refreshSession()
                    if (error) {
                        console.error('Session refresh failed:', error)
                        toast.error('Session expired. Please login again.')
                        router.push('/login')
                    } else {
                        warningShown = false // Reset warning
                    }
                } catch (error) {
                    console.error('Session refresh error:', error)
                }
            }

            // Show warning if within warning window
            if (
                timeUntilExpiry < SESSION_CONFIG.warningBeforeExpiry &&
                timeUntilExpiry > 0 &&
                !warningShown
            ) {
                const minutesRemaining = Math.ceil(timeUntilExpiry / 60000)
                toast.warning(`Your session will expire in ${minutesRemaining} minutes`, {
                    duration: 10000,
                })
                warningShown = true
            }

            // Session expired
            if (timeUntilExpiry <= 0) {
                toast.error('Session expired. Please login again.')
                await supabase.auth.signOut()
                router.push('/login')
            }
        }

        // Initial check
        checkSession()

        // Set up interval
        const interval = setInterval(checkSession, SESSION_CONFIG.checkInterval)

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/login')
            } else if (event === 'TOKEN_REFRESHED') {
                warningShown = false
            }
        })

        return () => {
            clearInterval(interval)
            subscription.unsubscribe()
        }
    }, [router])
}

/**
 * Component to wrap app with session timeout handling
 */
export function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
    useSessionTimeout()
    return <>{children}</>
}
