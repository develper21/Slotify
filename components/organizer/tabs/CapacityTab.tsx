'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateAppointmentSettings } from '@/lib/actions/organizer'
import { toast } from 'sonner'

export default function CapacityTab({ appointment }: { appointment: any }) {
    const settings = appointment.appointment_settings || {}
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        capacity_enabled: settings.capacity_enabled || false,
        max_capacity: settings.max_capacity || 1,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointmentSettings(appointment.id, formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Capacity settings updated!')
            }
        } catch (error) {
            toast.error('Failed to update capacity settings')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white">Capacity Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={formData.capacity_enabled}
                            onChange={(e) => setFormData(prev => ({ ...prev, capacity_enabled: e.target.checked }))}
                            className="w-5 h-5 rounded border-neutral-600 bg-mongodb-black text-mongodb-spring focus:ring-mongodb-spring"
                        />
                        <div>
                            <p className="font-medium text-white group-hover:text-mongodb-spring transition-colors">Enable Group Booking</p>
                            <p className="text-sm text-neutral-400">Allow multiple people to book the same time slot</p>
                        </div>
                    </label>

                    {formData.capacity_enabled && (
                        <div className="space-y-2">
                            <Input
                                label="Maximum Capacity per Slot"
                                type="number"
                                min="1"
                                value={formData.max_capacity}
                                onChange={(e) =>
                                    setFormData(prev => ({ ...prev, max_capacity: parseInt(e.target.value) || 1 }))
                                }
                                className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring"
                                labelClassName="text-neutral-300"
                            />
                            <p className="text-sm text-neutral-500">
                                How many people can book the same time slot
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={isSubmitting} className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                            Save Capacity Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
