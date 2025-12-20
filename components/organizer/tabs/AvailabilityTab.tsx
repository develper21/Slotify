'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'
// import { updateAppointmentAvailability } from '@/lib/actions/organizer' // TODO: Implement this action

export default function AvailabilityTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [schedule, setSchedule] = useState([
        { day: 'Monday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Tuesday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Wednesday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Thursday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Friday', enabled: true, start: '09:00', end: '17:00' },
        { day: 'Saturday', enabled: false, start: '10:00', end: '14:00' },
        { day: 'Sunday', enabled: false, start: '10:00', end: '14:00' },
    ])

    const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
        const newSchedule = [...schedule]
        newSchedule[index] = { ...newSchedule[index], [field]: value }
        setSchedule(newSchedule)
    }

    const toggleDay = (index: number) => {
        const newSchedule = [...schedule]
        newSchedule[index] = { ...newSchedule[index], enabled: !newSchedule[index].enabled }
        setSchedule(newSchedule)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Mock saving for now
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Availability updated successfully')
        } catch (error) {
            toast.error('Failed to update availability')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Weekly Hours</CardTitle>
                        <Button type="button" variant="outline" size="sm" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                            Apply to all
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {schedule.map((slot, index) => (
                        <div key={slot.day} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border transition-all ${slot.enabled ? 'bg-mongodb-black border-neutral-700' : 'bg-mongodb-black/50 border-neutral-800 opacity-60'}`}>
                            <div className="flex items-center gap-3 w-32">
                                <input
                                    type="checkbox"
                                    checked={slot.enabled}
                                    onChange={() => toggleDay(index)}
                                    className="w-5 h-5 rounded border-neutral-600 bg-mongodb-black text-mongodb-spring focus:ring-mongodb-spring"
                                />
                                <span className={`font-medium ${slot.enabled ? 'text-white' : 'text-neutral-500'}`}>
                                    {slot.day}
                                </span>
                            </div>

                            <div className="flex-1 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-neutral-500" />
                                    <input
                                        type="time"
                                        value={slot.start}
                                        disabled={!slot.enabled}
                                        onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                                        className="bg-transparent border border-neutral-700 rounded px-2 py-1 text-white focus:border-mongodb-spring outline-none disabled:opacity-50"
                                    />
                                    <span className="text-neutral-500">-</span>
                                    <input
                                        type="time"
                                        value={slot.end}
                                        disabled={!slot.enabled}
                                        onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                                        className="bg-transparent border border-neutral-700 rounded px-2 py-1 text-white focus:border-mongodb-spring outline-none disabled:opacity-50"
                                    />
                                </div>

                                {slot.enabled && (
                                    <Button type="button" variant="ghost" size="sm" className="ml-auto text-neutral-500 hover:text-red-500 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                                {!slot.enabled && (
                                    <span className="text-sm text-neutral-500 ml-auto italic">Unavailable</span>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" isLoading={isSubmitting} className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                            Save Availability
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
