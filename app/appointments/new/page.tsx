'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ChevronLeft } from 'lucide-react'
import { createAppointment, getOrganizerId } from '@/lib/actions/organizer'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function NewAppointmentPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '01:00:00',
        location: 'Online',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (field: string, value: string) => {
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
        if (!formData.duration) {
            newErrors.duration = 'Duration is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('You must be logged in')
                return
            }

            const organizerId = await getOrganizerId(user.id)

            if (!organizerId) {
                toast.error('Organizer account not found')
                return
            }

            const result = await createAppointment(organizerId, formData)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Appointment created successfully!')
                router.push(`/appointments/${result.appointmentId}/edit`)
            }
        } catch (error) {
            console.error('Error creating appointment:', error)
            toast.error('Failed to create appointment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Create New Appointment
                    </h1>
                    <p className="text-neutral-600">
                        Set up a new appointment type for your customers to book
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Title */}
                            <Input
                                label="Appointment Title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                error={errors.title}
                                placeholder="e.g., 30-Minute Consultation"
                                required
                            />

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none"
                                    placeholder="Describe what this appointment is about..."
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Duration <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                                >
                                    <option value="00:15:00">15 minutes</option>
                                    <option value="00:30:00">30 minutes</option>
                                    <option value="00:45:00">45 minutes</option>
                                    <option value="01:00:00">1 hour</option>
                                    <option value="01:30:00">1.5 hours</option>
                                    <option value="02:00:00">2 hours</option>
                                    <option value="03:00:00">3 hours</option>
                                    <option value="04:00:00">4 hours</option>
                                </select>
                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                                )}
                            </div>

                            {/* Location */}
                            <Input
                                label="Location"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                placeholder="e.g., Online, Office Address, etc."
                            />
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="lg" isLoading={isSubmitting}>
                            Create Appointment
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
