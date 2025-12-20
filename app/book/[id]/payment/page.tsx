'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const bookingId = searchParams.get('booking')

    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card')
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
    })

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: Integrate with payment gateway (Stripe/Razorpay)
            // Simulating payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            toast.success('Payment successful!')
            router.push(`/book/${params.id}/confirmation?booking=${bookingId}`)
        } catch (error) {
            toast.error('Payment failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Payment
                    </h1>
                    <p className="text-neutral-600">
                        Complete your booking by making a secure payment
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Payment Method Selection */}
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                    >
                                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-neutral-700" />
                                        <p className="text-sm font-medium text-neutral-900">Card</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'upi'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                    >
                                        <div className="w-6 h-6 mx-auto mb-2 text-neutral-700 font-bold">₹</div>
                                        <p className="text-sm font-medium text-neutral-900">UPI</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('netbanking')}
                                        className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'netbanking'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                            }`}
                                    >
                                        <div className="w-6 h-6 mx-auto mb-2 text-neutral-700 font-bold">🏦</div>
                                        <p className="text-sm font-medium text-neutral-900">Net Banking</p>
                                    </button>
                                </div>

                                {/* Card Payment Form */}
                                {paymentMethod === 'card' && (
                                    <form onSubmit={handlePayment} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                value={cardDetails.number}
                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:border-primary"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                value={cardDetails.name}
                                                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:border-primary"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cardDetails.expiry}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:border-primary"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                    placeholder="123"
                                                    maxLength={3}
                                                    className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:border-primary"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                                            <Lock className="w-5 h-5 mr-2" />
                                            Pay Securely
                                        </Button>
                                    </form>
                                )}

                                {/* UPI Payment */}
                                {paymentMethod === 'upi' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                UPI ID
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="yourname@upi"
                                                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <Button onClick={handlePayment} className="w-full" size="lg" isLoading={loading}>
                                            Pay with UPI
                                        </Button>
                                    </div>
                                )}

                                {/* Net Banking */}
                                {paymentMethod === 'netbanking' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Select Bank
                                            </label>
                                            <select className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:outline-none focus:border-primary">
                                                <option>State Bank of India</option>
                                                <option>HDFC Bank</option>
                                                <option>ICICI Bank</option>
                                                <option>Axis Bank</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <Button onClick={handlePayment} className="w-full" size="lg" isLoading={loading}>
                                            Proceed to Bank
                                        </Button>
                                    </div>
                                )}

                                {/* Security Notice */}
                                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <Lock className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-900">Secure Payment</p>
                                        <p className="text-xs text-green-700 mt-1">
                                            Your payment information is encrypted and secure
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Appointment Fee</span>
                                        <span className="font-medium text-neutral-900">₹500</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Service Charge</span>
                                        <span className="font-medium text-neutral-900">₹50</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">GST (18%)</span>
                                        <span className="font-medium text-neutral-900">₹99</span>
                                    </div>
                                    <div className="pt-3 border-t border-neutral-200">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-neutral-900">Total</span>
                                            <span className="text-xl font-bold text-primary">₹649</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-neutral-200">
                                    <div className="flex items-start gap-2 text-xs text-neutral-600">
                                        <AlertCircle className="w-4 h-4 mt-0.5" />
                                        <p>
                                            By completing this payment, you agree to our terms and conditions
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
