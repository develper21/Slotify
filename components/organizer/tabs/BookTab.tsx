'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateAppointmentSettings } from '@/lib/actions/organizer'
import { toast } from 'sonner'

export default function BookTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        manualConfirmation: appointment.manualConfirmation || false,
        paidBooking: Number(appointment.price) > 0,
        price: Number(appointment.price) || 0,
        introductionMessage: appointment.introductionMessage || '',
        confirmationMessage: appointment.confirmationMessage || '',
        meetingType: appointment.meetingType || 'online',
        meetingInstructions: appointment.meetingInstructions || '',
        venueDetails: appointment.venueDetails || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointmentSettings(appointment.id, formData)
            if (!result.success) {
                toast.error(result.message || 'Failed to update settings')
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
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Booking Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.manualConfirmation}
                                onChange={(e) => setFormData(prev => ({ ...prev, manualConfirmation: e.target.checked }))}
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
                                checked={formData.paidBooking}
                                onChange={(e) => setFormData(prev => ({ ...prev, paidBooking: e.target.checked }))}
                                className="w-5 h-5 rounded border-neutral-700 bg-mongodb-black text-mongodb-spring focus:ring-mongodb-spring"
                            />
                            <div>
                                <p className="font-medium text-white">Paid Booking</p>
                                <p className="text-sm text-neutral-400">Require payment for this appointment</p>
                            </div>
                        </label>

                        {formData.paidBooking && (
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
                                value={formData.introductionMessage}
                                onChange={(e) => setFormData(prev => ({ ...prev, introductionMessage: e.target.value }))}
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
                                value={formData.confirmationMessage}
                                onChange={(e) => setFormData(prev => ({ ...prev, confirmationMessage: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none resize-none placeholder:text-neutral-500"
                                placeholder="Message shown after booking..."
                            />
                        </div>
                    </CardContent>
                </Card>

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
                                value={formData.meetingType}
                                onChange={(e) => setFormData(prev => ({ ...prev, meetingType: e.target.value }))}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none">
                                <option value="online">Online</option>
                                <option value="offline">In-Person</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-2">
                                Meeting Instructions
                            </label>
                            <textarea
                                value={formData.meetingInstructions}
                                onChange={(e) => setFormData(prev => ({ ...prev, meetingInstructions: e.target.value }))}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none resize-none placeholder:text-neutral-500"
                                placeholder={formData.meetingType === 'online' ? 'e.g., Zoom link will be sent after booking' : 'e.g., Please arrive 5 minutes early'}
                            />
                        </div>

                        {formData.meetingType === 'offline' && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-2">
                                    Venue Details
                                </label>
                                <textarea
                                    value={formData.venueDetails}
                                    onChange={(e) => setFormData(prev => ({ ...prev, venueDetails: e.target.value }))}
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
