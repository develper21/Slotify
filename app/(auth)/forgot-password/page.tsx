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
            if (!result.success) {
                toast.error(result.message)
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
        <div className="min-h-screen bg-mongodb-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mongodb-spring/5 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mongodb-forest/10 blur-[120px] rounded-full -ml-64 -mb-64" />

            <div className="w-full max-w-md relative z-10 animate-scale-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-mongodb-slate rounded-full mb-4 ring-1 ring-neutral-800">
                        <KeyRound className="w-8 h-8 text-mongodb-spring" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-neutral-400">No worries, we'll send you reset instructions.</p>
                </div>

                <div className="bg-mongodb-slate/50 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90" isLoading={isLoading}>
                            Send Reset Link
                        </Button>

                        <div className="text-center">
                            <Link href="/login" className="text-sm text-mongodb-spring hover:underline font-medium">
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
