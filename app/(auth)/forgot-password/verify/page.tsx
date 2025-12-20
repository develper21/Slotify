'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { Mail, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function VerifyRecoveryPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialEmail = useMemo(() => searchParams.get('email') || '', [searchParams])
    const [email, setEmail] = useState(initialEmail)
    const [otp, setOtp] = useState(Array(6).fill(''))
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!email) {
            setEmail(initialEmail)
        }
    }, [initialEmail, email])

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return

        const next = [...otp]
        next[index] = value
        setOtp(next)

        if (value && index < otp.length - 1) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleVerify = async () => {
        const supabase = createClient()
        const sanitizedEmail = email.trim()
        if (!sanitizedEmail) {
            toast.error('Please enter your email')
            return
        }

        if (otp.some(digit => !digit)) {
            toast.error('Please enter the complete verification code')
            return
        }

        const token = otp.join('')

        setIsLoading(true)
        const { error } = await supabase.auth.verifyOtp({
            email: sanitizedEmail,
            token,
            type: 'recovery',
        })

        if (error) {
            toast.error(error.message || 'Verification failed. Please try again.')
            setIsLoading(false)
            return
        }

        toast.success('Verification successful!')
        router.push(`/reset-password?email=${encodeURIComponent(sanitizedEmail)}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                        <ShieldCheck className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Verify Code</h1>
                    <p className="text-white/80">Enter the verification code sent to your email.</p>
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
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Verification Code</label>
                        <div className="flex gap-2 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={event => handleOtpChange(index, event.target.value)}
                                    className="w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                />
                            ))}
                        </div>
                    </div>

                    <Button onClick={handleVerify} className="w-full" isLoading={isLoading}>
                        Verify Code
                    </Button>

                    <p className="text-center text-sm text-neutral-600">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={() => router.push(`/forgot-password?email=${encodeURIComponent(email)}`)}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Resend
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
