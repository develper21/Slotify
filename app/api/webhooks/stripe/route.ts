import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { bookings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any
        const bookingId = session.metadata?.booking_id

        if (bookingId) {
            try {
                await db.update(bookings)
                    .set({
                        status: 'confirmed',
                        paymentId: session.payment_intent as string
                    })
                    .where(eq(bookings.id, bookingId))
            } catch (error) {
                console.error('Webhook DB Error:', error)
                return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true })
}
