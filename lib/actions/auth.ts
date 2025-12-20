'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// MOCK AUTHENTICATION ACTIONS
// Disconnecting real Supabase auth for UI testing purposes

export async function signUp(formData: FormData) {
    console.log('--- MOCK SIGNUP CALL ---')
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    // Always return success for testing
    return { success: true, message: 'Account created! (MOCK)' }
}

export async function signIn(formData: FormData) {
    console.log('--- MOCK LOGIN CALL ---')
    await new Promise(resolve => setTimeout(resolve, 1000))

    const email = formData.get('email') as string

    // Simulate redirection based on "role" (mock logic)
    // admin@example.com -> /admin
    // organizer@example.com -> /dashboard
    // others -> /

    if (email.includes('admin')) {
        redirect('/admin')
    } else if (email.includes('organizer')) {
        redirect('/dashboard')
    } else {
        redirect('/')
    }
}

export async function signOut() {
    console.log('--- MOCK SIGN OUT ---')
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function verifyOTP(email: string, token: string) {
    return { success: true }
}

export async function verifyRecoveryOtp(email: string, token: string) {
    return { success: true }
}

export async function resetPassword(email: string) {
    return {
        success: true,
        message: 'A verification code has been sent (MOCK)'
    }
}

export async function updatePassword(newPassword: string) {
    return { success: true }
}

export async function completePasswordReset(email: string, otp: string, newPassword: string) {
    return { success: true }
}