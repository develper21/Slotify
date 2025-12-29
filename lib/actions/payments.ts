'use server'

import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(data: {
    appointmentId: string
    bookingId: string
    price: number
    title: string
}) {
    const origin = headers().get('origin')

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: data.title,
                            description: `Booking ID: ${data.bookingId}`,
                        },
                        unit_amount: Math.round(data.price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/book/${data.appointmentId}/confirmation?booking=${data.bookingId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/profile`,
            metadata: {
                booking_id: data.bookingId,
                appointment_id: data.appointmentId,
            },
        })

        return { url: session.url }
    } catch (error: any) {
        console.error('Stripe Session Error:', error)
        return { error: error.message }
    }
}
