'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { OTPInput } from '@/components/auth/OTPInput'
import { toast } from 'sonner'
import { Mail, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react'
import { verifyOTPAction } from '@/lib/actions/otp'
import { Suspense } from 'react'
import Link from 'next/link'

function VerifyRecoveryContent() {
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
            const result = await verifyOTPAction(sanitizedEmail, otp, 'password_reset')

            if (result.valid) {
                toast.success('Verification successful!')
                router.push(`/reset-password?email=${encodeURIComponent(sanitizedEmail)}&code=${encodeURIComponent(otp)}`)
            } else {
                setHasError(true)
                const errorMessage = result.error || 'Invalid verification code'
                toast.error(errorMessage)
                setIsLoading(false)
            }
        } catch (error) {
            setHasError(true)
            toast.error('Verification failed. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="w-12 h-12 bg-mongodb-spring/10 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-mongodb-spring" />
                </div>
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Security Check</h1>
                <p className="text-neutral-500 text-lg">Enter the verification code to reset your password.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Verify Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest block text-center">
                        8-Digit OTP Code
                    </label>
                    <div className="flex justify-center">
                        <OTPInput
                            length={8}
                            onComplete={handleVerifyOTP}
                            disabled={isLoading}
                            error={hasError}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-center text-neutral-500 font-medium pb-4">
                        Code expires in 10 minutes
                    </p>
                    <Button
                        onClick={() => { }}
                        size="xl"
                        className="w-full group shadow-[0_10px_30px_rgba(0,237,100,0.15)] rounded-2xl h-16 opacity-50 cursor-not-allowed"
                        disabled>
                        Auto-verifying Code...
                        <ArrowRight className="w-5 h-5 ml-2 animate-pulse" />
                    </Button>
                </div>

                <p className="text-center text-neutral-500 font-medium">
                    Didn't receive it?{' '}
                    <Link href={`/forgot-password?email=${encodeURIComponent(email)}`} className="text-mongodb-spring font-bold hover:underline">
                        Resend
                    </Link>
                </p>
            </div>

            <Link href="/login" className="flex items-center justify-center gap-2 text-neutral-600 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                Back to login
            </Link>
        </div>
    )
}

export default function VerifyRecoveryPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center gap-4 py-20">
                <div className="w-12 h-12 border-4 border-mongodb-spring/20 border-t-mongodb-spring rounded-full animate-spin" />
                <p className="text-neutral-500 animate-pulse font-display font-medium tracking-widest uppercase text-xs">Loading Security...</p>
            </div>
        }>
            <VerifyRecoveryContent />
        </Suspense>
    )
}
