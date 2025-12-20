// Supabase Edge Function: booking-notification
// Deploy with: supabase functions deploy booking-notification

import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

serve(async (req) => {
    try {
        const { record, type } = await req.json()

        // We only care about new bookings
        if (type !== 'INSERT' || !record) {
            return new Response(JSON.stringify({ message: 'Skipping' }), { status: 200 })
        }

        // Fetch dynamic data from database for the email (Edge Runtime)
        // You'll need to use service role key for this to bypass RLS
        // For now, let's assume we pass enough data or fetch it here.

        // TEMPLATE: Premium Booking Confirmation
        const bookingId = record.id
        const startTime = new Date(record.start_time).toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })

        // HTML Template based on Wireframe preferences
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #001e2b; color: #ffffff; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #023430; border-radius: 24px; overflow: hidden; border: 1px solid #00ed6433; }
        .header { background: linear-gradient(135deg, #00ed64 0%, #00684a 100%); padding: 40px; text-align: center; }
        .content { padding: 40px; }
        .title { font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #ffffff; }
        .subtitle { color: #00ed64; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; }
        .detail-card { background: #001e2b; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #ffffff11; }
        .label { color: #8899a6; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 18px; font-weight: 500; color: #ffffff; }
        .button { display: inline-block; background: #00ed64; color: #001e2b; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; margin-top: 24px; }
        .footer { text-align: center; padding: 24px; font-size: 12px; color: #8899a6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #001e2b; margin: 0; font-size: 32px;">SLOTIFY</h1>
          <p style="color: #001e2b; opacity: 0.8; margin: 5px 0 0 0;">Booking Confirmed</p>
        </div>
        <div class="content">
          <div class="subtitle">Confirmation # ${bookingId.slice(0, 8)}</div>
          <div class="title">Your appointment is scheduled!</div>
          <p style="color: #8899a6;">Get ready for your upcoming session. We've added this to your dashboard and notified the organizer.</p>
          
          <div class="detail-card">
            <div style="margin-bottom: 16px;">
              <div class="label">Date & Time</div>
              <div class="value">${startTime}</div>
            </div>
            <div>
              <div class="label">Location</div>
              <div class="value">Check your dashboard for meeting links</div>
            </div>
          </div>

          <a href="https://slotify.vercel.app/dashboard/bookings" class="button">View Booking Details</a>
          
          <p style="font-size: 12px; color: #5c6c75; margin-top: 40px;">
            If you need to reschedule, please contact the organizer at least 24 hours in advance.
          </p>
        </div>
        <div class="footer">
          &copy; 2024 Slotify Inc. | Intelligent Scheduling for Professionals
        </div>
      </div>
    </body>
    </html>
    `

        // In a real scenario, you'd fetch the customer's email from the `profiles` table
        // For this demonstration, we use the record's data if available or a placeholder
        const { data, error } = await resend.emails.send({
            from: 'Slotify <no-reply@updates.slotify.com>',
            to: ['customer-placeholder@example.com'], // In prod: customer_email
            subject: '✓ Booking Confirmed: Your Session with Slotify',
            html: htmlContent,
        })

        if (error) throw error

        return new Response(JSON.stringify(data), { status: 200 })

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
