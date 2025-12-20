'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { UserPlus, Mail, Lock, User } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{
        full_name?: string
        email?: string
        password?: string
        confirm_password?: string
    }>({})

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log('Form submitted')
        setIsLoading(true)
        setErrors({})

        const formData = new FormData(e.currentTarget)
        const full_name = formData.get('full_name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirm_password = formData.get('confirm_password') as string

        // Validation
        const newErrors: typeof errors = {}
        if (!full_name) newErrors.full_name = 'Full name is required'
        if (!email) newErrors.email = 'Email is required'
        if (!password) newErrors.password = 'Password is required'
        if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        if (!/[A-Z]/.test(password)) newErrors.password = 'Password must include at least one uppercase letter'
        if (!/[a-z]/.test(password)) newErrors.password = 'Password must include at least one lowercase letter'
        if (!/\d/.test(password)) newErrors.password = 'Password must include at least one number'
        if (!/[^A-Za-z0-9]/.test(password)) newErrors.password = 'Password must include at least one special character'
        if (password !== confirm_password) newErrors.confirm_password = 'Passwords do not match'

        if (Object.keys(newErrors).length > 0) {
            console.log('Validation failed', newErrors)
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            console.log('Calling signUp server action')
            const result = await signUp(formData)
            console.log('SignUp result:', result)
            if (!result.success) {
                console.error('SignUp error:', result.message)
                toast.error(result.message)
            } else {
                console.log('SignUp success')
                toast.success('Account created! Please check your email for verification.')
                router.push('/verify-email')
            }
        } catch (error) {
            console.error('SignUp process exception:', error)
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
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Slotify</h1>
                    <p className="text-neutral-400">Create your account to get started.</p>
                </div>

                {/* Signup Card */}
                <div className="bg-mongodb-slate/50 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-xl p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <UserPlus className="w-6 h-6 text-mongodb-spring" />
                        <h2 className="text-2xl font-display font-semibold text-white">Sign Up</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Full name"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                />
                            </div>
                            {errors.full_name && (
                                <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                            {!errors.password && (
                                <p className="mt-1 text-xs text-neutral-500">
                                    Min 8 chars, uppercase, lowercase, number, special char.
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                <input
                                    type="password"
                                    name="confirm_password"
                                    placeholder="Confirm password"
                                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                />
                            </div>
                            {errors.confirm_password && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-mongodb-spring hover:underline font-medium">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}