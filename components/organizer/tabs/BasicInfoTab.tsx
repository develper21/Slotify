'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateAppointment } from '@/lib/actions/organizer'
import { toast } from 'sonner'
import { Save, Check } from 'lucide-react'

export default function BasicInfoTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: appointment.title || '',
        description: appointment.description || '',
        duration: appointment.duration || 60,
        locationDetails: appointment.locationDetails || appointment.location_details || 'Online Meeting',
        price: appointment.price || '0.00',
        imageUrl: appointment.imageUrl || appointment.image_url || '',
        maxCapacity: appointment.maxCapacity || appointment.max_capacity || 1,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointment(appointment.id, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                duration: Number(formData.duration),
                locationDetails: formData.locationDetails,
                price: formData.price.toString(),
                imageUrl: formData.imageUrl.trim() || null,
                maxCapacity: Number(formData.maxCapacity) || 1,
            })

            if (!result.success) {
                toast.error(result.message || 'Update failed')
            } else {
                toast.success('Appointment configuration saved!')
            }
        } catch (error) {
            toast.error('Unexpected error updating appointment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            <Card hover={false} className="bg-[#0C2331] border-white/10 p-6 space-y-6">
                <div className="border-b border-white/5 pb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white">General Parameters</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">Edit service title, pricing, and duration</p>
                    </div>
                    <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} className="font-bold">
                        <Save className="w-4 h-4 mr-1.5" />
                        Save Changes
                    </Button>
                </div>

                <Input
                    label="Session Title *"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                />

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest px-0.5">
                        Description
                    </label>
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#001E2B] rounded-lg border border-[#1E3C4E] text-white placeholder:text-neutral-500 text-sm transition-all duration-200 outline-none focus:border-mongodb-spring focus:ring-2 focus:ring-mongodb-spring/20 resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Duration (Minutes) *"
                        type="number"
                        min="5"
                        step="5"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                        required
                    />

                    <Input
                        label="Price ($ USD)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        hint="Set 0.00 for free bookings"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Meeting Location / Details"
                        value={formData.locationDetails}
                        onChange={(e) => setFormData(prev => ({ ...prev, locationDetails: e.target.value }))}
                        placeholder="e.g. Google Meet, Zoom, Office"
                    />

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest px-0.5">
                            Max Attendee Capacity
                        </label>
                        <select
                            value={formData.maxCapacity}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || 1 }))}
                            className="w-full px-4 py-3 bg-[#001E2B] rounded-lg border border-[#1E3C4E] text-white text-sm outline-none focus:border-mongodb-spring focus:ring-2 focus:ring-mongodb-spring/20">
                            <option value={1}>1 Person (1-on-1 Private)</option>
                            <option value={2}>2 People</option>
                            <option value={5}>Up to 5 People</option>
                            <option value={10}>Up to 10 People (Group)</option>
                            <option value={20}>Up to 20 People (Webinar)</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="Cover Image URL (Optional)"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    hint="Displays as a hero banner on the marketplace card"
                />
            </Card>

            <div className="flex justify-end">
                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="font-bold shadow-mongodb px-8">
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                </Button>
            </div>
        </form>
    )
}
