'use server'

import { createClient } from '@/lib/supabase/server'
import { getPasswordValidationError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
            },
        },
    }

    const { data: authData, error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    // Create user profile
    if (authData.user) {
        const { error: profileError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                full_name: formData.get('full_name') as string,
                email: data.email,
                role: 'customer',
                status: 'active',
            })

        if (profileError) {
            return { error: 'Failed to create user profile' }
        }
    }

    return { success: true, message: 'Check your email for verification link' }
}

export async function signIn(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    // Get user role for redirect
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('email', data.email)
        .single()

    revalidatePath('/', 'layout')

    if (userData?.role === 'admin') {
        redirect('/admin')
    } else if (userData?.role === 'organizer') {
        redirect('/dashboard')
    } else {
        redirect('/')
    }
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function verifyOTP(email: string, token: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function verifyRecoveryOtp(email: string, token: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery',
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function resetPassword(email: string) {
    // Import custom OTP functions
    const { createOTP, sendOTPEmail } = await import('@/lib/otp')

    try {
        // Create 6-digit OTP
        const otp = await createOTP(email, 'password_reset', 10)

        if (!otp) {
            return { error: 'Failed to generate OTP. Please try again.' }
        }

        // Send OTP via email
        const sent = await sendOTPEmail(email, otp, 'password_reset')

        if (!sent) {
            return { error: 'Failed to send OTP email. Please try again.' }
        }

        return {
            success: true,
            message: 'A 6-digit verification code has been sent to your email'
        }
    } catch (error) {
        console.error('Reset password error:', error)
        return { error: 'An error occurred. Please try again.' }
    }
}

export async function updatePassword(newPassword: string) {
    // This function requires an active session, which we don't have in custom OTP flow
    // Deprecated for custom flow
    return { error: 'Session missing. Please use completePasswordReset.' }
}

export async function completePasswordReset(email: string, otp: string, newPassword: string) {
    // Import admin client dynamically to avoid usage in client components
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const { verifyOTP } = await import('@/lib/otp')

    // 1. Password validation
    const validationError = getPasswordValidationError(newPassword)
    if (validationError) {
        return { error: validationError }
    }

    try {
        // 2. Verify OTP again (Security check)
        // Note: verifyOTP checks database, so it's secure
        const verification = await verifyOTP(email, otp, 'password_reset')

        // Since we already "verified" it on previous page, it might be marked verified=true
        // We should check if it exists and is valid (verified=true is okay here as long as it's not expired)
        // But our verifyOTP function marks it verified=true on success. 
        // If we call it again, it might fail? Let's check verifyOTP implementation.
        // The implementation: SELECT * ... WHERE verified = FALSE.
        // So calling it again will fail because verified is TRUE.

        // We need a way to check "recently verified OTP".
        // Or simplified flow: The OTP is the "token". 
        // We can just TRUST the OTP if we can validate it matches the email in DB within expiry.

        // Let's use Admin Client directly to check OTP table
        const supabaseAdmin = createAdminClient()

        const { data: otpRecord } = await supabaseAdmin
            .from('otp_verifications')
            .select('*')
            .eq('email', email)
            .eq('otp', otp)
            .eq('purpose', 'password_reset')
            .gt('expires_at', new Date().toISOString())
            .single()

        if (!otpRecord) {
            return { error: 'Invalid or expired verification code.' }
        }

        // 3. Update User Password using Admin Client
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single()

        if (!userData) {
            return { error: 'User not found.' }
        }

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            userData.id,
            { password: newPassword }
        )

        if (updateError) {
            console.error('Admin update password error:', updateError)
            return { error: updateError.message }
        }

        // 4. Cleanup OTP
        await supabaseAdmin
            .from('otp_verifications')
            .delete()
            .eq('id', otpRecord.id)

        return { success: true }
    } catch (error) {
        console.error('Password reset exception:', error)
        return { error: 'An error occurred. Please try again.' }
    }
}
