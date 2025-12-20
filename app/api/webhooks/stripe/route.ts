import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('stripe-signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = createClient()

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const bookingId = session.metadata?.booking_id

        if (bookingId) {
            // Update booking status to confirmed
            const { error } = await supabase
                .from('bookings')
                .update({
                    status: 'confirmed',
                    payment_id: session.payment_intent as string // Optional: store payment intent
                })
                .eq('id', bookingId)

            if (error) {
                console.error('Webhook DB Error:', error)
                return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true })
}
