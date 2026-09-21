'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react'

import { signIn } from '@/lib/actions/auth'

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const result = await signIn(formData)

            if (result.success) {
                toast.success('Logged in successfully')
                if (result.role === 'admin') router.push('/dashboard/admin')
                else if (result.role === 'organizer') router.push('/dashboard')
                else router.push('/dashboard')
                router.refresh()
            } else {
                toast.error(result.message || 'Login failed')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Login Portal</h1>
                <p className="text-neutral-500 text-lg">Enter your access credentials below.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                </div>

                <div className="space-y-2 group">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                            Password
                        </label>
                        <Link href="/forgot-password" className="text-xs font-bold text-mongodb-spring hover:underline tracking-tight">
                            FORGOT?
                        </Link>
                    </div>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        size="xl"
                        className="w-full group shadow-[0_10px_30px_rgba(0,237,100,0.15)] rounded-2xl h-16"
                        isLoading={isLoading}>
                        Sign In to Portal
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </form>

            <div className="pt-6 border-t border-neutral-800 text-center">
                <p className="text-neutral-500 font-medium">
                    New to our platform?{' '}
                    <Link href="/signup" className="text-mongodb-spring font-bold hover:underline">
                        Create your account
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
