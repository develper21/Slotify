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
        <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
                    Secure <span className="gradient-text">Payment</span>
                </h1>
                <p className="text-xl text-neutral-400">Complete your booking with a safe transaction</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="bg-mongodb-slate/50 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                                        ? 'border-mongodb-spring bg-mongodb-spring/10'
                                        : 'border-neutral-700 hover:border-neutral-500 bg-mongodb-black'
                                        }`}>
                                    <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-mongodb-spring' : 'text-neutral-400'}`} />
                                    <p className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-neutral-400'}`}>Card</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'upi'
                                        ? 'border-mongodb-spring bg-mongodb-spring/10'
                                        : 'border-neutral-700 hover:border-neutral-500 bg-mongodb-black'
                                        }`}>
                                    <div className={`w-6 h-6 mx-auto mb-2 font-bold ${paymentMethod === 'upi' ? 'text-mongodb-spring' : 'text-neutral-400'}`}>₹</div>
                                    <p className={`text-sm font-medium ${paymentMethod === 'upi' ? 'text-white' : 'text-neutral-400'}`}>UPI</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('netbanking')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'netbanking'
                                        ? 'border-mongodb-spring bg-mongodb-spring/10'
                                        : 'border-neutral-700 hover:border-neutral-500 bg-mongodb-black'
                                        }`}>
                                    <div className="w-6 h-6 mx-auto mb-2 text-neutral-400 font-bold">🏦</div>
                                    <p className={`text-sm font-medium ${paymentMethod === 'netbanking' ? 'text-white' : 'text-neutral-400'}`}>Net Banking</p>
                                </button>
                            </div>

                            {paymentMethod === 'card' && (
                                <form onSubmit={handlePayment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={cardDetails.number}
                                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="text"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                placeholder="123"
                                                maxLength={3}
                                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90" size="lg" isLoading={loading}>
                                        <Lock className="w-5 h-5 mr-2" />
                                        Pay Securely
                                    </Button>
                                </form>
                            )}

                            {paymentMethod === 'upi' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            UPI ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="yourname@upi"
                                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                        />
                                    </div>
                                    <Button onClick={handlePayment} className="w-full bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90" size="lg" isLoading={loading}>
                                        Pay with UPI
                                    </Button>
                                </div>
                            )}

                            {paymentMethod === 'netbanking' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Select Bank
                                        </label>
                                        <select className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none">
                                            <option>State Bank of India</option>
                                            <option>HDFC Bank</option>
                                            <option>ICICI Bank</option>
                                            <option>Axis Bank</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <Button onClick={handlePayment} className="w-full bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90" size="lg" isLoading={loading}>
                                        Proceed to Bank
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-start gap-3 p-4 bg-green-900/10 border border-green-900/30 rounded-lg">
                                <Lock className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-400">Secure Payment</p>
                                    <p className="text-xs text-green-500/80 mt-1">
                                        Your payment information is encrypted and secure
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="bg-mongodb-slate/50 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-400">Appointment Fee</span>
                                    <span className="font-medium text-white">₹500</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-400">Service Charge</span>
                                    <span className="font-medium text-white">₹50</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-400">GST (18%)</span>
                                    <span className="font-medium text-white">₹99</span>
                                </div>
                                <div className="pt-3 border-t border-neutral-800">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-white">Total</span>
                                        <span className="text-xl font-bold text-mongodb-spring">₹649</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-800">
                                <div className="flex items-start gap-2 text-xs text-neutral-400">
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
    )
}
