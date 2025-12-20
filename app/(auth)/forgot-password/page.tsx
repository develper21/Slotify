'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { resetPassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { KeyRound, Mail, ArrowLeft, ArrowRight } from 'lucide-react'

function ForgotPasswordContent() {
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
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="w-12 h-12 bg-mongodb-spring/10 rounded-xl flex items-center justify-center mb-6">
                    <KeyRound className="w-6 h-6 text-mongodb-spring" />
                </div>
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Recovery</h1>
                <p className="text-neutral-500 text-lg">We'll help you regain portal access.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Account Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        size="xl"
                        className="w-full group shadow-[0_10px_30px_rgba(0,237,100,0.15)] rounded-2xl h-16"
                        isLoading={isLoading}
                    >
                        Send Reset Link
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </form>

            <div className="pt-6 border-t border-neutral-800 text-center">
                <p className="text-neutral-500 font-medium">
                    Wait, I remembered it!{' '}
                    <Link href="/login" className="text-mongodb-spring font-bold hover:underline">
                        Log in instead
                    </Link>
                </p>
            </div>

            <Link href="/" className="flex items-center justify-center gap-2 text-neutral-600 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                Back to main site
            </Link>
        </div>
    )
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center gap-4 py-20">
                <div className="w-12 h-12 border-4 border-mongodb-spring/20 border-t-mongodb-spring rounded-full animate-spin" />
                <p className="text-neutral-500 animate-pulse font-display font-medium tracking-widest uppercase text-xs">Loading Recovery...</p>
            </div>
        }>
            <ForgotPasswordContent />
        </Suspense>
    )
}
