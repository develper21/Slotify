'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { completePasswordReset } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { Lock, CheckCircle, Mail } from 'lucide-react'
import { getPasswordValidationError } from '@/lib/utils'
import { Suspense } from 'react'

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

        // Call the server action with email, otp code, and new password
        const result = await completePasswordReset(email, code, password)

        if (result.error) {
            toast.error(result.error)
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
            <div className="min-h-screen bg-mongodb-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-mongodb-spring/10 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-mongodb-spring" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Password Updated!
                        </h2>
                        <p className="text-neutral-400 mb-6">
                            Your password has been successfully updated. Redirecting to login...
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-mongodb-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-mongodb-slate/50 border-neutral-800">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-mongodb-spring/10 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-mongodb-spring" />
                    </div>
                    <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
                    <p className="text-neutral-400 mt-2">
                        Set a new password for {email}
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            label="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            minLength={8}
                            className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                            labelClassName="text-neutral-300"
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            minLength={8}
                            className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                            labelClassName="text-neutral-300"
                        />

                        <div className="text-sm text-neutral-400 bg-mongodb-black border border-neutral-700 p-3 rounded-lg">
                            <p className="font-medium mb-1 text-white">Password requirements:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>At least 8 characters long</li>
                                <li>Includes uppercase and lowercase letters</li>
                                <li>Includes at least one number</li>
                                <li>Includes at least one special character</li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={!password || !confirmPassword}
                            variant="primary"
                        >
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-mongodb-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-12 text-center">
                        <div className="animate-pulse text-white">Loading...</div>
                    </CardContent>
                </Card>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
