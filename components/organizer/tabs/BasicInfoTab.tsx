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
        duration: appointment.duration || 60,
        location_details: appointment.location_details || 'Online',
        price: appointment.price || 0,
        image_url: appointment.image_url || ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointment(appointment.id, formData)
            if (!result.success) {
                toast.error(result.message || 'Update failed')
            } else {
                toast.success('Service details updated!')
            }
        } catch (error) {
            toast.error('Unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl">
            <Card className="bg-mongodb-slate/30 border-neutral-800 shadow-xl relative overflow-hidden group">
                <CardHeader className="border-b border-neutral-800 mb-6">
                    <CardTitle className="text-white text-xl">Core Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Input
                        label="Plan Title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-mongodb-spring h-12"
                        labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                    />

                    <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1 mb-2">
                            Public Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-4 focus:ring-mongodb-spring/10 transition-all outline-none resize-none placeholder:text-neutral-500 min-h-[120px]"
                            placeholder="Tell your customers what to expect..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1 mb-2">
                                Session Duration
                            </label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
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
                            label="Price Tag ($)"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                            className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-mongodb-spring h-12"
                            labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                        />
                    </div>

                    <Input
                        label="Location / Meeting Link"
                        value={formData.location_details}
                        onChange={(e) => setFormData(prev => ({ ...prev, location_details: e.target.value }))}
                        className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-mongodb-spring h-12"
                        labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                    />

                    <Input
                        label="Thumbnail Image URL"
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                        className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-mongodb-spring h-12"
                        labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                    />

                    <div className="flex justify-end pt-4 border-t border-neutral-800">
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            variant="primary"
                            className="rounded-xl px-12 h-12 shadow-lg shadow-mongodb-spring/10 font-bold">
                            Update Service
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
