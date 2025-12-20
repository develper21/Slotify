'use server'

import { createClient } from '@/lib/supabase/server'

interface BookingEmailData {
    customerName: string
    customerEmail: string
    appointmentTitle: string
    appointmentDate: string
    appointmentTime: string
    location: string
    organizerName: string
    confirmationMessage?: string
    meetingInstructions?: string
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData) {
    try {
        const supabase = createClient()

        // In production, you would use a service like Resend, SendGrid, or Supabase Edge Functions
        // For now, we'll log the email content

        const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Your booking has been confirmed! We're looking forward to seeing you.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Appointment:</span> ${data.appointmentTitle}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${data.appointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${data.appointmentTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span> ${data.location}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Organizer:</span> ${data.organizerName}
                </div>
              </div>

              ${data.confirmationMessage ? `<p><strong>Message from organizer:</strong><br/>${data.confirmationMessage}</p>` : ''}
              ${data.meetingInstructions ? `<p><strong>Meeting Instructions:</strong><br/>${data.meetingInstructions}</p>` : ''}

              <p>If you need to cancel or reschedule, please visit your profile page.</p>
              
              <p>Best regards,<br/>Slotify Team</p>
            </div>
          </div>
        </body>
      </html>
    `

        // TODO: Integrate with actual email service
        // For now, just log
        console.log('📧 Booking Confirmation Email:')
        console.log('To:', data.customerEmail)
        console.log('Subject: Booking Confirmed -', data.appointmentTitle)
        console.log('Content:', emailContent)

        // In production, uncomment and configure:
        /*
        const { error } = await supabase.functions.invoke('send-email', {
          body: {
            to: data.customerEmail,
            subject: `Booking Confirmed - ${data.appointmentTitle}`,
            html: emailContent,
          },
        })
        
        if (error) throw error
        */

        return { success: true }
    } catch (error) {
        console.error('Error sending confirmation email:', error)
        return { error: 'Failed to send confirmation email' }
    }
}

/**
 * Send booking cancellation email
 */
export async function sendCancellationEmail(data: BookingEmailData) {
    try {
        const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Your booking has been cancelled as requested.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Appointment:</span> ${data.appointmentTitle}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${data.appointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${data.appointmentTime}
                </div>
              </div>

              <p>If you'd like to book again, please visit our website.</p>
              
              <p>Best regards,<br/>Slotify Team</p>
            </div>
          </div>
        </body>
      </html>
    `

        console.log('📧 Cancellation Email:')
        console.log('To:', data.customerEmail)
        console.log('Subject: Booking Cancelled -', data.appointmentTitle)

        return { success: true }
    } catch (error) {
        console.error('Error sending cancellation email:', error)
        return { error: 'Failed to send cancellation email' }
    }
}

/**
 * Send reminder email (for upcoming appointments)
 */
export async function sendReminderEmail(data: BookingEmailData) {
    try {
        const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Appointment Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>This is a friendly reminder about your upcoming appointment.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Appointment:</span> ${data.appointmentTitle}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${data.appointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${data.appointmentTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span> ${data.location}
                </div>
              </div>

              ${data.meetingInstructions ? `<p><strong>Meeting Instructions:</strong><br/>${data.meetingInstructions}</p>` : ''}

              <p>We look forward to seeing you!</p>
              
              <p>Best regards,<br/>Slotify Team</p>
            </div>
          </div>
        </body>
      </html>
    `

        console.log('📧 Reminder Email:')
        console.log('To:', data.customerEmail)
        console.log('Subject: Reminder -', data.appointmentTitle)

        return { success: true }
    } catch (error) {
        console.error('Error sending reminder email:', error)
        return { error: 'Failed to send reminder email' }
    }
}
