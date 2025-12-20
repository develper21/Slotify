'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyOTP } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { Mail, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [email, setEmail] = useState('')

    async function handleVerify() {
        if (otp.some(digit => !digit) || !email) {
            toast.error('Please enter your email and complete OTP')
            return
        }

        setIsLoading(true)
        const token = otp.join('')

        try {
            const result = await verifyOTP(email, token)
            if (!(result as any).success) {
                toast.error((result as any).message || 'Verification failed')
            } else {
                toast.success('Email verified successfully!')
                router.push('/login')
            }
        } catch (error) {
            toast.error('Verification failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    function handleOtpChange(index: number, value: string) {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="w-12 h-12 bg-mongodb-spring/10 rounded-xl flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6 text-mongodb-spring" />
                </div>
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Check Mail</h1>
                <p className="text-neutral-500 text-lg">We've sent a 6-digit code to your inbox.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Confirm Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest block">
                        Verification Code
                    </label>
                    <div className="flex gap-3 justify-between">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                className="w-full h-14 text-center text-2xl font-bold rounded-xl bg-mongodb-black border border-neutral-800 text-white focus:border-mongodb-spring transition-all outline-none"
                            />
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleVerify}
                        size="xl"
                        className="w-full group shadow-[0_10px_30px_rgba(0,237,100,0.15)] rounded-2xl h-16"
                        isLoading={isLoading}
                    >
                        Verify Identity
                        <CheckCircle className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
                    </Button>
                </div>

                <p className="text-center text-neutral-500 font-medium">
                    Didn't receive it?{' '}
                    <button className="text-mongodb-spring font-bold hover:underline">
                        Resend code
                    </button>
                </p>
            </div>

            <Link href="/login" className="flex items-center justify-center gap-2 text-neutral-600 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                Back to login
            </Link>
        </div>
    )
}