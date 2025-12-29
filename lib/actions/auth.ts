'use server'

import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { login as setSession, logout as clearSession, getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateOTP, saveOTP, verifyOTP as verifyCustomOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string
    const role = formData.get('role') as string || 'customer'

    console.log('--- START SIGNUP ATTEMPT ---', { email, role })

    try {
        // Check if user already exists
        const existingUser = await db.query.profiles.findFirst({
            where: eq(profiles.email, email)
        })

        if (existingUser) {
            return { success: false, message: 'User already exists' }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [newUser] = await db.insert(profiles).values({
            email,
            password: hashedPassword,
            fullName: full_name,
            role: role as any,
        }).returning()

        console.log('--- SIGNUP SUCCESS ---', newUser.id)

        console.log('--- GENERATING OTP ---')
        const otp = generateOTP()
        await saveOTP(email, otp, 'signup')
        await sendOTPEmail(email, otp, 'signup')

        return {
            success: true,
            message: 'Account created! Please check your email for verification code.',
            email
        }
    } catch (error: any) {
        console.error('--- SIGNUP ERROR ---', error)
        return { success: false, message: error.message || 'Signup failed' }
    }
}

export async function signIn(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const user = await db.query.profiles.findFirst({
            where: eq(profiles.email, email)
        })

        if (!user || !user.password) {
            return { success: false, message: 'Invalid credentials' }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid credentials' }
        }

        await setSession({
            id: user.id,
            email: user.email!,
            role: user.role!
        })

        return { success: true, role: user.role }
    } catch (error: any) {
        return { success: false, message: error.message || 'Login failed' }
    }
}

export async function signOut() {
    await clearSession()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function verifyOTP(email: string, token: string) {
    try {
        const isValid = await verifyCustomOTP(email, token, 'signup')

        if (!isValid) {
            return { success: false, message: 'Invalid or expired code' }
        }

        const user = await db.query.profiles.findFirst({
            where: eq(profiles.email, email)
        })

        if (!user) return { success: false, message: 'User not found' }

        await setSession({
            id: user.id,
            email: user.email!,
            role: user.role!
        })

        return { success: true, role: user.role || 'customer' }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function resetPassword(email: string) {
    try {
        const otp = generateOTP()
        await saveOTP(email, otp, 'password_reset')
        await sendOTPEmail(email, otp, 'password_reset')

        return { success: true, message: '8-digit recovery code sent to your email.' }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function completePasswordReset(email: string, otp: string, newPassword: string) {
    try {
        const isValid = await verifyCustomOTP(email, otp, 'password_reset')

        if (!isValid) {
            return { success: false, message: 'Invalid or expired recovery code' }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.update(profiles)
            .set({ password: hashedPassword })
            .where(eq(profiles.email, email))

        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function getCurrentUser() {
    const session = await getSession()
    if (!session) return null

    const user = await db.query.profiles.findFirst({
        where: eq(profiles.id, session.user.id)
    })

    return user
}

export async function updateProfile(userId: string, data: { fullName?: string, phone?: string }) {
    try {
        await db.update(profiles)
            .set({
                fullName: data.fullName,
                updatedAt: new Date()
            })
            .where(eq(profiles.id, userId))

        revalidatePath('/dashboard/settings')
        revalidatePath('/dashboard/profile')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function updateOrganizerSettings(userId: string, data: {
    businessName?: string,
    websiteUrl?: string,
    businessDescription?: string,
    timezone?: string,
    emailNotifications?: boolean,
    smsNotifications?: boolean,
    defaultDuration?: number
}) {
    try {
        await db.update(profiles)
            .set({
                businessName: data.businessName,
                websiteUrl: data.websiteUrl,
                businessDescription: data.businessDescription,
                timezone: data.timezone,
                emailNotifications: data.emailNotifications,
                smsNotifications: data.smsNotifications,
                defaultDuration: data.defaultDuration,
                updatedAt: new Date()
            })
            .where(eq(profiles.id, userId))

        revalidatePath('/dashboard/settings')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}