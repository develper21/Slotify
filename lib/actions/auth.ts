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
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: 'Check your email for reset link' }
}

export async function updatePassword(newPassword: string) {
    const supabase = createClient()

    const validationError = getPasswordValidationError(newPassword)
    if (validationError) {
        return { error: validationError }
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
