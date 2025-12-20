'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateAppointment } from '@/lib/actions/organizer'
import { toast } from 'sonner'

export default function BasicInfoTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: appointment.title || '',
        description: appointment.description || '',
        duration: appointment.duration || '01:00:00',
        location: appointment.location || 'Online',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointment(appointment.id, formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Appointment updated successfully!')
            }
        } catch (error) {
            toast.error('Failed to update appointment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Input
                        label="Appointment Title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Duration
                        </label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
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
                    </div>

                    <Input
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={isSubmitting}>
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
