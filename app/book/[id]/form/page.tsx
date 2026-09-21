'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import { getBookingQuestions, createBooking } from '@/lib/actions/appointments'
import { createCheckoutSession } from '@/lib/actions/payments'
import { getCurrentUser } from '@/lib/actions/auth'
import { toast } from 'sonner'

interface BookingFormPageProps {
    params: { id: string }
}

interface Question {
    id: string
    questionText: string
    questionType: 'single_line' | 'multi_line' | 'phone' | 'radio' | 'checkbox'
    options: string[] | null
    isMandatory: boolean
}

export default function BookingFormPage({ params }: BookingFormPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const date = searchParams.get('date')
    const slotId = searchParams.get('slot')

    const [questions, setQuestions] = useState<Question[]>([])
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        loadQuestions()
        loadUser()
    }, [])

    const loadUser = async () => {
        try {
            const user = await getCurrentUser()
            if (user) {
                setUserId(user.id)
                // Pre-fill user data
                setAnswers(prev => ({
                    ...prev,
                    name: user.fullName || '',
                    email: user.email || '',
                }))
            }
        } catch (error) {
            console.error('Error loading user:', error)
        }
    }

    const loadQuestions = async () => {
        setIsLoading(true)
        try {
            const data = await getBookingQuestions(params.id)
            setQuestions(data as any[])
        } catch (error) {
            console.error('Error loading questions:', error)
            toast.error('Failed to load booking form')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
        if (errors[questionId]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[questionId]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!answers.name?.trim()) {
            newErrors.name = 'Name is required'
        }
        if (!answers.email?.trim()) {
            newErrors.email = 'Email is required'
        }
        if (!answers.phone?.trim()) {
            newErrors.phone = 'Phone is required'
        }

        questions.forEach(question => {
            if (question.isMandatory && !answers[question.id]?.trim()) {
                newErrors[question.id] = 'This field is required'
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fill in all required fields')
            return
        }

        if (!userId || !slotId) {
            toast.error('Missing booking information')
            return
        }

        setIsSubmitting(true)

        try {
            const questionAnswers = questions.map(q => ({
                questionId: q.id,
                answer: answers[q.id] || '',
            }))

            const result = await createBooking({
                appointmentId: params.id,
                userId,
                slotId,
                answers: questionAnswers,
            })

            if (!result.success) {
                toast.error(result.message || 'Failed to create booking')
            } else if (result.requiresPayment && result.price) {
                toast.info('Redirecting to secure payment...')
                const checkout = await createCheckoutSession({
                    appointmentId: params.id,
                    bookingId: result.bookingId!,
                    price: Number(result.price),
                    title: result.title || 'Professional Appointment'
                })

                if (checkout.url) {
                    window.location.href = checkout.url
                } else {
                    toast.error('Payment initialization failed')
                }
            } else {
                toast.success('Booking created successfully!')
                router.push(`/book/${params.id}/confirmation?booking=${result.bookingId}`)
            }
        } catch (error) {
            console.error('Booking error:', error)
            toast.error('Failed to create booking')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderQuestion = (question: Question) => {
        const value = answers[question.id] || ''
        const error = errors[question.id]

        switch (question.questionType) {
            case 'single_line':
                return (
                    <div key={question.id}>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            {question.questionText}
                            {question.isMandatory && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                        />
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                )

            case 'multi_line':
                return (
                    <div key={question.id}>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            {question.questionText}
                            {question.isMandatory && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            value={value}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none resize-none"
                        />
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                )

            case 'phone':
                return (
                    <div key={question.id}>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            {question.questionText}
                            {question.isMandatory && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="tel"
                            value={value}
                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                        />
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                )

            case 'radio':
                return (
                    <div key={question.id}>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            {question.questionText}
                            {question.isMandatory && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-2">
                            {question.options?.map((option, index) => (
                                <label key={index} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:border-neutral-500 bg-mongodb-black hover:bg-neutral-900 cursor-pointer transition-colors">
                                    <input
                                        type="radio"
                                        name={question.id}
                                        value={option}
                                        checked={value === option}
                                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                                        className="w-4 h-4 text-mongodb-spring border-neutral-600 bg-neutral-800 focus:ring-mongodb-spring"
                                    />
                                    <span className="text-neutral-300">{option}</span>
                                </label>
                            ))}
                        </div>
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                )

            case 'checkbox':
                return (
                    <div key={question.id}>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            {question.questionText}
                            {question.isMandatory && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="space-y-2">
                            {question.options?.map((option, index) => (
                                <label key={index} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:border-neutral-500 bg-mongodb-black hover:bg-neutral-900 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={value.includes(option)}
                                        onChange={(e) => {
                                            const currentValues = value ? value.split(',') : []
                                            const newValues = e.target.checked
                                                ? [...currentValues, option]
                                                : currentValues.filter(v => v !== option)
                                            handleInputChange(question.id, newValues.join(','))
                                        }}
                                        className="w-4 h-4 text-mongodb-spring border-neutral-600 bg-neutral-800 rounded focus:ring-mongodb-spring"
                                    />
                                    <span className="text-neutral-300">{option}</span>
                                </label>
                            ))}
                        </div>
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
                    Almost <span className="gradient-text">There</span>
                </h1>
                <p className="text-xl text-neutral-400">Please provide a few more details to confirm</p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Your Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={answers.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={answers.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={answers.phone || ''}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        {questions.length > 0 && (
                            <>
                                <div className="pt-6 border-t border-neutral-800">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        Additional Information
                                    </h3>
                                </div>
                                {questions.map(renderQuestion)}
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="text-neutral-400 hover:text-white">
                        Cancel
                    </Button>
                    <Button type="submit" size="lg" isLoading={isSubmitting} variant="primary">
                        Complete Booking
                    </Button>
                </div>
            </form>
        </div>
    )
}
