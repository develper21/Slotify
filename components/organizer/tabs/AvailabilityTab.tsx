'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Trash2, Clock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateAppointment } from '@/lib/actions/organizer'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DEFAULT_START = '09:00'
const DEFAULT_END = '17:00'

export default function AvailabilityTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [availability, setAvailability] = useState(() => {
        const existing = appointment.availability || {}
        return DAYS.reduce((acc: any, day) => {
            acc[day] = existing[day] || { active: true, slots: [{ start: DEFAULT_START, end: DEFAULT_END }] }
            return acc
        }, {})
    })

    const handleTimeChange = (day: string, slotIndex: number, field: 'start' | 'end', value: string) => {
        setAvailability((prev: any) => {
            const dayConfig = { ...prev[day] }
            const newSlots = [...dayConfig.slots]
            newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value }
            return {
                ...prev,
                [day]: { ...dayConfig, slots: newSlots }
            }
        })
    }

    const toggleDay = (day: string) => {
        setAvailability((prev: any) => ({
            ...prev,
            [day]: { ...prev[day], active: !prev[day].active }
        }))
    }

    const addSlot = (day: string) => {
        setAvailability((prev: any) => {
            const dayConfig = { ...prev[day] }
            const lastSlot = dayConfig.slots[dayConfig.slots.length - 1]
            const newStart = lastSlot ? lastSlot.end : DEFAULT_START
            // simple logic: add 1 hour
            const [h, m] = newStart.split(':').map(Number)
            const newEnd = `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            return {
                ...prev,
                [day]: { ...dayConfig, slots: [...dayConfig.slots, { start: newStart, end: newEnd }] }
            }
        })
    }

    const removeSlot = (day: string, slotIndex: number) => {
        setAvailability((prev: any) => {
            const dayConfig = { ...prev[day] }
            const newSlots = dayConfig.slots.filter((_: any, i: number) => i !== slotIndex)
            if (newSlots.length === 0) {
                return { ...prev, [day]: { ...dayConfig, active: false, slots: [{ start: DEFAULT_START, end: DEFAULT_END }] } }
            }
            return {
                ...prev,
                [day]: { ...dayConfig, slots: newSlots }
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointment(appointment.id, { availability })
            if (!result.success) {
                toast.error(result.message || 'Update failed')
            } else {
                toast.success('Availability settings saved!')
            }
        } catch (error) {
            toast.error('Unexpected error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <Card className="bg-mongodb-slate/30 border-neutral-800 shadow-2xl overflow-hidden backdrop-blur-sm">
                <CardHeader className="bg-mongodb-black/40 border-b border-neutral-800 p-6 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                            <Clock className="w-5 h-5 text-mongodb-spring" />
                            Work Schedule
                        </CardTitle>
                        <p className="text-neutral-500 text-sm mt-1">Configure your active working periods for each day.</p>
                    </div>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        variant="primary"
                        className="rounded-xl h-11 px-8 font-bold shadow-mongodb-spring/10 shadow-lg"
                    >
                        Save Schedule
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-neutral-800/50">
                        {DAYS.map((day) => (
                            <div key={day} className={`group flex flex-col md:flex-row p-6 transition-colors ${availability[day].active ? 'bg-transparent' : 'bg-neutral-900/20'}`}>
                                {/* Day Selector */}
                                <div className="md:w-48 flex items-center gap-3 mb-4 md:mb-0">
                                    <button
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1 ${availability[day].active ? 'bg-mongodb-spring' : 'bg-neutral-700'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${availability[day].active ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                    <span className={`text-sm font-bold uppercase tracking-wider ${availability[day].active ? 'text-white' : 'text-neutral-600'}`}>
                                        {day}
                                    </span>
                                </div>

                                {/* Slots Area */}
                                <div className="flex-1 space-y-3">
                                    {availability[day].active ? (
                                        <div className="space-y-3">
                                            {availability[day].slots.map((slot: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 animate-in slide-in-from-right-2 duration-300">
                                                    <div className="flex items-center gap-2 bg-mongodb-black/50 border border-neutral-700 rounded-xl p-1 pr-3">
                                                        <input
                                                            type="time"
                                                            value={slot.start}
                                                            onChange={(e) => handleTimeChange(day, idx, 'start', e.target.value)}
                                                            className="bg-transparent text-white text-sm font-medium px-2 py-1.5 focus:outline-none focus:text-mongodb-spring transition-colors"
                                                        />
                                                        <span className="text-neutral-600 text-xs font-bold">TO</span>
                                                        <input
                                                            type="time"
                                                            value={slot.end}
                                                            onChange={(e) => handleTimeChange(day, idx, 'end', e.target.value)}
                                                            className="bg-transparent text-white text-sm font-medium px-2 py-1.5 focus:outline-none focus:text-mongodb-spring transition-colors"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeSlot(day, idx)}
                                                        className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => addSlot(day)}
                                                className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-mongodb-spring h-8 px-0 border-none bg-transparent"
                                            >
                                                + Add Time Slot
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-neutral-600 italic text-sm py-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                                            Away / Out of Office
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
