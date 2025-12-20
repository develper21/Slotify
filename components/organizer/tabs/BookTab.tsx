        'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateAppointmentSettings } from '@/lib/actions/organizer'
import { toast } from 'sonner'

export default function BookTab({ appointment }: { appointment: any }) {
    const settings = appointment.appointment_settings || {}
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        manual_confirmation: settings.manual_confirmation || false,
        paid_booking: settings.paid_booking || false,
        price: settings.price || 0,
        introduction_message: settings.introduction_message || '',
        confirmation_message: settings.confirmation_message || '',
        meeting_type: settings.meeting_type || 'online',
        meeting_instructions: settings.meeting_instructions || '',
        venue_details: settings.venue_details || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointmentSettings(appointment.id, formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Settings updated successfully!')
            }
        } catch (error) {
            toast.error('Failed to update settings')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                {/* Booking Settings */}
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Booking Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.manual_confirmation}
                                onChange={(e) => setFormData(prev => ({ ...prev, manual_confirmation: e.target.checked }))}
                                className="w-5 h-5 rounded border-neutral-700 bg-mongodb-black text-mongodb-spring focus:ring-mongodb-spring"
                            />
                            <div>
                                <p className="font-medium text-white">Manual Confirmation</p>
                                <p className="text-sm text-neutral-400">Require manual approval for bookings</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.paid_booking}
                                onChange={(e) => setFormData(prev => ({ ...prev, paid_booking: e.target.checked }))}
                                className="w-5 h-5 rounded border-neutral-700 bg-mongodb-black text-mongodb-spring focus:ring-mongodb-spring"
                            />
                            <div>
                                <p className="font-medium text-white">Paid Booking</p>
                                <p className="text-sm text-neutral-400">Require payment for this appointment</p>
                            </div>
                        </label>

                        {formData.paid_booking && (
                            <Input
                                label="Price ($)"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className="bg-mongodb-black border-neutral-700 text-white placeholder:text-neutral-500 focus:border-mongodb-spring"
                                labelClassName="text-neutral-400"
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Messages */}
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Messages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">
                                Introduction Message
                            </label>
                            <textarea
                                value={formData.introduction_message}
                                onChange={(e) => setFormData(prev => ({ ...prev, introduction_message: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none resize-none placeholder:text-neutral-500"
                                placeholder="Message shown before booking..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">
                                Confirmation Message
                            </label>
                            <textarea
                                value={formData.confirmation_message}
                                onChange={(e) => setFormData(prev => ({ ...prev, confirmation_message: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none resize-none placeholder:text-neutral-500"
                                placeholder="Message shown after booking..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Meeting Details */}
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Meeting Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">
                                Meeting Type
                            </label>
                            <select
                                value={formData.meeting_type}
                                onChange={(e) => setFormData(prev => ({ ...prev, meeting_type: e.target.value }))}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                            >
                                <option value="online">Online</option>
                                <option value="offline">In-Person</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">
                                Meeting Instructions
                            </label>
                            <textarea
                                value={formData.meeting_instructions}
                                onChange={(e) => setFormData(prev => ({ ...prev, meeting_instructions: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none resize-none placeholder:text-neutral-500"
                                placeholder={formData.meeting_type === 'online' ? 'e.g., Zoom link will be sent after booking' : 'e.g., Please arrive 5 minutes early'}
                            />
                        </div>

                        {formData.meeting_type === 'offline' && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">
                                    Venue Details
                                </label>
                                <textarea
                                    value={formData.venue_details}
                                    onChange={(e) => setFormData(prev => ({ ...prev, venue_details: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none resize-none placeholder:text-neutral-500"
                                    placeholder="Full address and directions..."
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" isLoading={isSubmitting} className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                        Save Settings
                    </Button>
                </div>
            </div>
        </form>
    )
}
