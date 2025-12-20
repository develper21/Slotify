'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { resetPassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { KeyRound, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        const prefilledEmail = searchParams.get('email')
        if (prefilledEmail) {
            setEmail(prefilledEmail)
        }
    }, [searchParams])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!email) {
            toast.error('Please enter your email')
            return
        }

        setIsLoading(true)

        try {
            const result = await resetPassword(email)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Verification code sent to your email')
                router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                        <KeyRound className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-white/80">No worries, we'll send you reset instructions.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Send Reset Link
                        </Button>

                        <div className="text-center">
                            <Link href="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
