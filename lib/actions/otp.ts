'use server'

import { createClient } from '@/lib/supabase/server'
import { OTPPurpose } from '@/lib/otp'

/**
 * Verify OTP (Server Action)
 */
export async function verifyOTPAction(
    email: string,
    otp: string,
    purpose: OTPPurpose
) {
    try {
        const supabase = createClient()

        const { data, error } = await (supabase.rpc as any)('verify_otp', {
            p_email: email.toLowerCase(),
            p_otp: otp,
            p_purpose: purpose,
        })

        if (error) {
            console.error('Error verifying OTP:', error)
            return {
                valid: false,
                error: 'Verification failed'
            }
        }

        return data
    } catch (error) {
        console.error('Exception verifying OTP:', error)
        return {
            valid: false,
            error: 'Verification failed'
        }
    }
}
