import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export type OTPPurpose = 'signup' | 'login' | 'password_reset'

export interface OTPVerificationResult {
  valid: boolean
  error?: string
  message?: string
  attemptsRemaining?: number
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Generate 6-digit OTP
 */
export function generate6DigitOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Create OTP for email verification
 */
export async function createOTP(
  email: string,
  purpose: OTPPurpose,
  expiryMinutes: number = 10
): Promise<string | null> {
  try {
    const supabase = createClient()

    // Check if we can use the database
    const { data, error } = await (supabase.rpc as any)('create_otp', {
      p_email: email.toLowerCase(),
      p_purpose: purpose,
      p_expiry_minutes: expiryMinutes,
    })

    if (error) {
      console.error('Database Error creating OTP:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception creating OTP:', error)
    return null
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(
  email: string,
  otp: string,
  purpose: OTPPurpose
): Promise<OTPVerificationResult> {
  try {
    const supabase = createClient()

    const { data, error } = await (supabase.rpc as any)('verify_otp', {
      p_email: email.toLowerCase(),
      p_otp: otp,
      p_purpose: purpose,
    })

    if (error || !data) {
      console.error('Error verifying OTP:', error)
      return {
        valid: false,
        error: 'Verification failed'
      }
    }

    return data as OTPVerificationResult
  } catch (error) {
    console.error('Exception verifying OTP:', error)
    return {
      valid: false,
      error: 'Verification failed'
    }
  }
}

/**
 * Send OTP via Email (Using Resend)
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  purpose: OTPPurpose
): Promise<boolean> {
  try {
    // If API key is missing, fallback to console (for safety/demo)
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY is missing in .env.local file!')
      console.log('--- DEVELOPMENT ONLY OTP ---')
      console.log(`To: ${email}`)
      console.log(`OTP: ${otp}`)
      console.log('----------------------------')
      return true
    }

    const { error } = await resend.emails.send({
      from: 'Slotify <onboarding@resend.dev>', // Update this if you have a custom domain
      to: email,
      subject: getOTPEmailSubject(purpose),
      html: getOTPEmailHTML(otp, purpose),
    })

    if (error) {
      console.error('Resend API Error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception sending email:', error)
    return false
  }
}

/**
 * Format OTP purpose for display
 */
export function formatOTPPurpose(purpose: OTPPurpose): string {
  switch (purpose) {
    case 'signup': return 'Sign Up'
    case 'login': return 'Login'
    case 'password_reset': return 'Password Reset'
    default: return purpose
  }
}

/**
 * Get OTP email subject
 */
export function getOTPEmailSubject(purpose: OTPPurpose): string {
  switch (purpose) {
    case 'signup': return 'Verify Your Email - Slotify'
    case 'login': return 'Your Login Code - Slotify'
    case 'password_reset': return 'Reset Your Password - Slotify'
    default: return 'Verification Code - Slotify'
  }
}

/**
 * Get OTP email HTML template
 */
export function getOTPEmailHTML(otp: string, purpose: OTPPurpose): string {
  const purposeText = formatOTPPurpose(purpose)

  return `
      <!DOCTYPE html>
      <html>
      <body style="font-family: sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: #667eea; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Slotify</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">${purposeText} Verification</h2>
            <p style="color: #666;">Your verification code is:</p>
            <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 10 minutes.</p>
          </div>
        </div>
      </body>
      </html>
    `
}
