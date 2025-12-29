'use server'

import { verifyOTP } from '@/lib/otp'

export async function verifyOTPAction(
    email: string,
    otp: string,
    purpose: string
) {
    try {
        const isValid = await verifyOTP(email, otp, purpose)

        if (!isValid) {
            return {
                valid: false,
                error: 'Invalid or expired code'
            }
        }

        return { valid: true }
    } catch (error) {
        console.error('Exception verifying OTP:', error)
        return {
            valid: false,
            error: 'Verification failed'
        }
    }
}
