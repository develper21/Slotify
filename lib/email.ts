import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendOTPEmail(email: string, otp: string, purpose: string) {
  // Always log OTP to server terminal so local development / testing is never blocked
  console.log(`\n=========================================`)
  console.log(`[SLOTIFY OTP] Purpose: ${purpose}`)
  console.log(`[SLOTIFY OTP] Recipient: ${email}`)
  console.log(`[SLOTIFY OTP] Code: ${otp}`)
  console.log(`=========================================\n`)

  let subject = ''
  let text = ''

  switch (purpose) {
    case 'signup':
      subject = 'Verify your email for Slotify'
      text = `Your verification code is: ${otp}. This code will expire in 10 minutes.`
      break
    case 'password_reset':
      subject = 'Reset your Slotify password'
      text = `Your password reset code is: ${otp}. This code will expire in 10 minutes.`
      break
    case 'login':
      subject = 'Your Slotify login code'
      text = `Your login code is: ${otp}. This code will expire in 10 minutes.`
      break
    default:
      subject = 'Verification Code'
      text = `Your code is: ${otp}`
  }

  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured. Simulated email sending in console.')
    return { id: 'simulated-otp-id' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Slotify <onboarding@resend.dev>',
      to: [email],
      subject: subject,
      text: text,
    })

    if (error) {
      console.warn('[Email Warning] Resend sending failed (likely testing recipient domain restriction):', error.message)
      // Do not throw so that developer can use console OTP in test mode
      return { id: 'dev-fallback-id', warning: error.message }
    }

    return data
  } catch (err: any) {
    console.warn('[Email Warning] Unexpected email sending error:', err?.message || err)
    return { id: 'dev-fallback-id' }
  }
}
