'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { completePasswordReset } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { Lock, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react'
import { getPasswordValidationError } from '@/lib/utils'
import { Suspense } from 'react'
import Link from 'next/link'

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const email = searchParams.get('email') || ''
    const code = searchParams.get('code') || ''

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!email || !code) {
            toast.error('Invalid password reset link')
            router.push('/forgot-password')
        }
    }, [email, code, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationError = getPasswordValidationError(password)
        if (validationError) {
            toast.error(validationError)
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setIsLoading(true)

        const result = await completePasswordReset(email, code, password)

        if (!(result as any).success) {
            toast.error((result as any).message || 'Failed to update password')
            setIsLoading(false)
        } else {
            setSuccess(true)
            toast.success('Password updated successfully')
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        }
    }

    if (success) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-mongodb-spring/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-mongodb-spring/5">
                    <CheckCircle className="w-10 h-10 text-mongodb-spring" />
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">Success!</h2>
                    <p className="text-neutral-400 text-lg leading-relaxed">
                        Your password has been securely updated. Redirecting you to the portal...
                    </p>
                </div>
                <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mt-8">
                    <div className="h-full bg-mongodb-spring animate-progress-fast" style={{ width: '100%' }} />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <div className="w-12 h-12 bg-mongodb-spring/10 rounded-xl flex items-center justify-center mb-6">
                    <Lock className="w-6 h-6 text-mongodb-spring" />
                </div>
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">New Password</h1>
                <p className="text-neutral-500 text-lg">Set a strong password for {email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Create Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                </div>

                <div className="p-4 rounded-2xl bg-mongodb-slate/30 border border-neutral-800 space-y-3">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" />
                        Security Requirements
                    </p>
                    <ul className="text-[11px] text-neutral-500 space-y-1 font-medium font-sans">
                        <li className="flex items-center gap-2">• Min 8 characters, uppercase & lowercase</li>
                        <li className="flex items-center gap-2">• At least one number and special symbol</li>
                    </ul>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        size="xl"
                        className="w-full group shadow-[0_10px_30_rgba(0,237,100,0.15)] rounded-2xl h-16"
                        isLoading={isLoading}
                        disabled={!password || !confirmPassword}
                    >
                        Secure My Account
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center gap-4 py-20">
                <div className="w-12 h-12 border-4 border-mongodb-spring/20 border-t-mongodb-spring rounded-full animate-spin" />
                <p className="text-neutral-500 animate-pulse font-display font-medium tracking-widest uppercase text-xs">Loading Security...</p>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
