'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { toast } from 'sonner'
import { Calendar, ArrowRight, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Logged in successfully')
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
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
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 bg-mongodb-spring rounded-mongodb flex items-center justify-center mb-4 shadow-mongodb">
                        <Calendar className="w-7 h-7 text-mongodb-black" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-tighter">SLOTIFY</h1>
                    <p className="text-neutral-500 text-sm mt-1 uppercase tracking-widest font-bold">Business Portal</p>
                </div>

                <Card className="border-mongodb-spring/10 shadow-2xl bg-mongodb-slate/50 backdrop-blur-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-mongodb bg-mongodb-black/50 border border-neutral-700/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-mongodb-spring transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-medium text-neutral-300">Password</label>
                                    <Link href="/forgot-password" size="sm" className="text-xs text-mongodb-spring hover:underline">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-mongodb-spring transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3 rounded-mongodb bg-mongodb-black/50 border border-neutral-700/50 text-white placeholder:text-neutral-500 focus:outline-none focus:border-mongodb-spring transition-all"
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full py-6 text-lg group" 
                                isLoading={isLoading}
                            >
                                Sign In
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-neutral-500">
                                New to Slotify?{' '}
                                <Link href="/signup" className="text-mongodb-spring font-bold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-12 text-center text-neutral-600 text-xs flex flex-col gap-4">
                    <p>© 2025 Slotify Professional. All rights reserved.</p>
                    <div className="flex items-center justify-center gap-6">
                        <Link href="/privacy" className="hover:text-neutral-400">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-neutral-400">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
