'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { verifyOTP } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { Mail, CheckCircle } from 'lucide-react'

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
            if (result?.error) {
                toast.error(result.error)
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                        <Mail className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Verify Your Email</h1>
                    <p className="text-white/80">We've sent a verification code to your email</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Verification Code
                            </label>
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        className="w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                    />
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleVerify} className="w-full" isLoading={isLoading}>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Verify Email
                        </Button>

                        <p className="text-center text-sm text-neutral-600">
                            Didn't receive the code?{' '}
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                                Resend
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}