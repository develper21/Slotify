'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: full_name,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true, message: 'Check your email to confirm your account.' }
}

export async function signIn(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
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
        type: 'signup',
    })

    if (error) return { success: false, message: error.message }
    return { success: true }
}

export async function resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    })

    if (error) return { success: false, message: error.message }
    return { success: true, message: 'Password reset email sent.' }
}

export async function completePasswordReset(email: string, otp: string, newPassword: string) {
    const supabase = createClient()

    // First verify the OTP
    const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery',
    })

    if (verifyError) return { success: false, message: verifyError.message }

    // Then update the password
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (updateError) return { success: false, message: updateError.message }

    return { success: true }
}