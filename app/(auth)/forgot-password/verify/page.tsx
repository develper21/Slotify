'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { OTPInput } from '@/components/auth/OTPInput'
import { toast } from 'sonner'
import { Mail, ShieldCheck } from 'lucide-react'
import { verifyOTPAction } from '@/lib/actions/otp'

export default function VerifyRecoveryPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialEmail = useMemo(() => searchParams.get('email') || '', [searchParams])
    const [email, setEmail] = useState(initialEmail)
    const [isLoading, setIsLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        if (!email) {
            setEmail(initialEmail)
        }
    }, [initialEmail, email])

    const handleVerifyOTP = async (otp: string) => {
        const sanitizedEmail = email.trim()
        if (!sanitizedEmail) {
            toast.error('Please enter your email')
            return
        }

        setIsLoading(true)
        setHasError(false)

        try {
            // Use Server Action for verification
            const result = await verifyOTPAction(sanitizedEmail, otp, 'password_reset')

            if (result.valid) {
                toast.success('Verification successful!')
                // Pass the verified OTP to the reset page
                router.push(`/reset-password?email=${encodeURIComponent(sanitizedEmail)}&code=${encodeURIComponent(otp)}`)
            } else {
                setHasError(true)
                const errorMessage = result.error || 'Invalid verification code'
                const attemptsMsg = result.attemptsRemaining
                    ? ` (${result.attemptsRemaining} attempts remaining)`
                    : ''
                toast.error(errorMessage + attemptsMsg)
                setIsLoading(false)
            }
        } catch (error) {
            setHasError(true)
            toast.error('Verification failed. Please try again.')
            setIsLoading(false)
        }
    }

    const handleResend = () => {
        router.push(`/forgot-password?email=${encodeURIComponent(email)}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                        <ShieldCheck className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Verify Code</h1>
                    <p className="text-white/80">Enter the 6-digit code sent to your email.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                                placeholder="your@email.com"
                                className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-4 text-center">
                            Verification Code
                        </label>
                        <OTPInput
                            length={6}
                            onComplete={handleVerifyOTP}
                            disabled={isLoading}
                            error={hasError}
                        />
                    </div>

                    <p className="text-center text-sm text-neutral-600">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                            disabled={isLoading}
                        >
                            Resend
                        </button>
                    </p>

                    <p className="text-center text-xs text-neutral-500">
                        Code expires in 10 minutes
                    </p>
                </div>
            </div>
        </div>
    )
}
