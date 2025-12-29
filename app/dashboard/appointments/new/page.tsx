'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ChevronLeft, Info } from 'lucide-react'
import { createAppointment } from '@/lib/actions/organizer'
import { getCurrentUser } from '@/lib/actions/auth'
import { toast } from 'sonner'

export default function NewAppointmentPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 60,
        locationDetails: 'Online',
        price: 0
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }
        if (formData.duration <= 0) {
            newErrors.duration = 'Valid duration is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix form errors')
            return
        }

        setIsSubmitting(true)

        try {
            const user = await getCurrentUser()

            if (!user) {
                toast.error('Session expired. Please login again.')
                router.push('/login')
                return
            }

            const result = await createAppointment(user.id, {
                title: formData.title,
                description: formData.description,
                duration: formData.duration,
                locationDetails: formData.locationDetails,
                price: formData.price
            })

            if (!result.success) {
                toast.error(result.message || 'Error occurred')
            } else {
                toast.success('Appointment plan created!')
                router.push(`/dashboard/appointments/${result.appointmentId}/edit`)
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to create appointment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl py-8">
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-neutral-500 hover:text-mongodb-spring mb-6 transition-colors group px-2 py-1 -ml-2 rounded-lg hover:bg-neutral-800">
                    <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back
                </button>
                <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">
                    New <span className="gradient-text">Booking Plan</span>
                </h1>
                <p className="text-neutral-400">
                    Define the basics of your appointment. You can add questions and schedules in the next step.
                </p>
            </div>

            <div className="bg-mongodb-slate/20 border border-neutral-800 p-4 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-mongodb-spring/10 rounded-lg">
                    <Info className="w-5 h-5 text-mongodb-spring" />
                </div>
                <p className="text-sm text-neutral-400">
                    After creating the basic plan, you'll be redirected to the **Designer** where you can add custom form questions and set your availability.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-mongodb-slate/30 border-neutral-800 backdrop-blur-sm shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">Service Particulars</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Input
                            label="Plan Title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            error={errors.title}
                            placeholder="e.g., Senior Photography Session"
                            required
                            className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-600 focus:border-mongodb-spring h-12"
                            labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                        />

                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1 mb-2">
                                Brief Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all outline-none resize-none placeholder:text-neutral-600"
                                placeholder="Explain what the customer gets..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1 mb-2">
                                    Duration <span className="text-mongodb-spring">*</span>
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all outline-none h-12">
                                    <option value={15}>15 Minutes</option>
                                    <option value={30}>30 Minutes</option>
                                    <option value={45}>45 Minutes</option>
                                    <option value={60}>1 Hour</option>
                                    <option value={90}>1.5 Hours</option>
                                    <option value={120}>2 Hours</option>
                                </select>
                            </div>

                            <Input
                                label="Pricing ($)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                                placeholder="0.00 (leave 0 for free)"
                                className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-600 focus:border-mongodb-spring h-12"
                                labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                            />
                        </div>

                        <Input
                            label="Meeting Location"
                            value={formData.locationDetails}
                            onChange={(e) => handleChange('locationDetails', e.target.value)}
                            placeholder="Online Meet, Google Zoom, Office Address..."
                            className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-600 focus:border-mongodb-spring h-12"
                            labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                        />
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-neutral-500 hover:text-white">
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        size="xl"
                        isLoading={isSubmitting}
                        variant="primary"
                        className="rounded-xl px-12">
                        Create Plan
                    </Button>
                </div>
            </form>
        </div>
    )
}
