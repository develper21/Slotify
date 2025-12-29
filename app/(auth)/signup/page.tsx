'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { UserPlus, Mail, Lock, User, ArrowLeft, ArrowRight } from 'lucide-react'

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
        setIsLoading(true)
        setErrors({})

        const formData = new FormData(e.currentTarget)
        const full_name = formData.get('full_name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirm_password = formData.get('confirm_password') as string
        const newErrors: typeof errors = {}
        if (!full_name) newErrors.full_name = 'Full name is required'
        if (!email) newErrors.email = 'Email is required'
        if (!password) newErrors.password = 'Password is required'
        if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
        if (password !== confirm_password) newErrors.confirm_password = 'Passwords do not match'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            const result = await signUp(formData)
            if (!result.success) {
                toast.error(result.message)
            } else {
                toast.success('Account created! Please check your email.')
                router.push('/verify-email')
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
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Create Account</h1>
                <p className="text-neutral-500 text-lg">Join the network of top professionals.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Professional Name
                    </label>
                    <input
                        type="text"
                        name="full_name"
                        placeholder="John Smith"
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                    {errors.full_name && <p className="text-xs text-red-500 ml-1 font-medium">{errors.full_name}</p>}
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest">
                        I am signing up as
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex flex-col items-center justify-center p-4 rounded-2xl border border-neutral-800 bg-mongodb-black hover:border-mongodb-spring/50 cursor-pointer transition-all has-[:checked]:border-mongodb-spring has-[:checked]:bg-mongodb-spring/5 group">
                            <input type="radio" name="role" value="customer" defaultChecked className="hidden" />
                            <User className="w-6 h-6 text-neutral-500 group-has-[:checked]:text-mongodb-spring mb-2" />
                            <span className="text-sm font-bold text-neutral-400 group-has-[:checked]:text-white">Individual</span>
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-neutral-700 group-has-[:checked]:border-mongodb-spring group-has-[:checked]:bg-mongodb-spring flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-mongodb-black" />
                            </div>
                        </label>
                        <label className="relative flex flex-col items-center justify-center p-4 rounded-2xl border border-neutral-800 bg-mongodb-black hover:border-mongodb-spring/50 cursor-pointer transition-all has-[:checked]:border-mongodb-spring has-[:checked]:bg-mongodb-spring/5 group">
                            <input type="radio" name="role" value="organizer" className="hidden" />
                            <UserPlus className="w-6 h-6 text-neutral-500 group-has-[:checked]:text-mongodb-spring mb-2" />
                            <span className="text-sm font-bold text-neutral-400 group-has-[:checked]:text-white">Organizer</span>
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-neutral-700 group-has-[:checked]:border-mongodb-spring group-has-[:checked]:bg-mongodb-spring flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-mongodb-black" />
                            </div>
                        </label>
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                        Work Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                    />
                    {errors.email && <p className="text-xs text-red-500 ml-1 font-medium">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                        <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2 group">
                        <label className="text-sm font-bold text-neutral-400 ml-1 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-4 h-4 text-neutral-600 group-focus-within:text-mongodb-spring transition-colors" />
                            Confirm
                        </label>
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-mongodb-black border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all font-medium"
                        />
                    </div>
                </div>
                {errors.password && <p className="text-xs text-red-500 ml-1 font-medium">{errors.password}</p>}
                {errors.confirm_password && <p className="text-xs text-red-500 ml-1 font-medium">{errors.confirm_password}</p>}

                <div className="pt-4">
                    <Button
                        type="submit"
                        size="xl"
                        className="w-full group shadow-[0_10px_30px_rgba(0,237,100,0.15)] rounded-2xl h-16"
                        isLoading={isLoading}>
                        Create My Account
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </form>

            <div className="pt-6 border-t border-neutral-800 text-center">
                <p className="text-neutral-500 font-medium">
                    Already a member?{' '}
                    <Link href="/login" className="text-mongodb-spring font-bold hover:underline">
                        Log in to portal
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