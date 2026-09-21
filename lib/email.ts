import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOTPEmail(email: string, otp: string, purpose: string) {
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

  const { data, error } = await resend.emails.send({
    from: 'Slotify <onboarding@resend.dev>',
    to: [email],
    subject: subject,
    text: text,
  })

  if (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send verification email')
  }

  return data
}
