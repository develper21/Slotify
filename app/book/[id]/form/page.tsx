'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import { getBookingQuestions, createBooking } from '@/lib/actions/appointments'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface BookingFormPageProps {
    params: { id: string }
}

interface Question {
    id: string
    question_text: string
    question_type: 'single_line' | 'multi_line' | 'phone' | 'radio' | 'checkbox'
    options: string[] | null
    is_mandatory: boolean
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
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setUserId(user.id)
            // Pre-fill user data
            setAnswers(prev => ({
                ...prev,
                name: user.user_metadata?.full_name || '',
                email: user.email || '',
            }))
        }
    }

    const loadQuestions = async () => {
        setIsLoading(true)
        try {
            const data = await getBookingQuestions(params.id)
            setQuestions(data as Question[])
        } catch (error) {
            console.error('Error loading questions:', error)
            toast.error('Failed to load booking form')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
        // Clear error for this field
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

        // Validate required fields
        if (!answers.name?.trim()) {
            newErrors.name = 'Name is required'
        }
        if (!answers.email?.trim()) {
            newErrors.email = 'Email is required'
        }
        if (!answers.phone?.trim()) {
            newErrors.phone = 'Phone is required'
        }

        // Validate custom questions
        questions.forEach(question => {
            if (question.is_mandatory && !answers[question.id]?.trim()) {
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
                capacityCount: 1, // TODO: Get from capacity selection page
                answers: questionAnswers,
            })

            if (result.error) {
                toast.error(result.error)
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

        switch (question.question_type) {
            case 'single_line':
                return (
                    <div key={question.id}>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            {question.question_text}
                            {question.is_mandatory && <span className="text-red-500 ml-1">*</span>}
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
                            {question.question_text}
                            {question.is_mandatory && <span className="text-red-500 ml-1">*</span>}
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
                            {question.question_text}
                            {question.is_mandatory && <span className="text-red-500 ml-1">*</span>}
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
                            {question.question_text}
                            {question.is_mandatory && <span className="text-red-500 ml-1">*</span>}
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
                            {question.question_text}
                            {question.is_mandatory && <span className="text-red-500 ml-1">*</span>}
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
        <div className="min-h-screen bg-mongodb-black py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Booking Information
                    </h1>
                    <p className="text-neutral-400">Please fill in your details to complete the booking</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="bg-mongodb-slate/50 border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Your Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
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

                            {/* Email */}
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

                            {/* Phone */}
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

                            {/* Dynamic Questions */}
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

                    {/* Submit Button */}
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
        </div>
    )
}
