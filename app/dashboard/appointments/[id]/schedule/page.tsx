'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronLeft, Clock, Calendar, Save, Zap } from 'lucide-react'
import { upsertSchedule } from '@/lib/actions/organizer'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface DaySchedule {
    day_of_week: number
    is_working_day: boolean
    start_time: string
    end_time: string
}

const DAYS = [
    { name: 'Sunday', value: 0 },
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
]

export default function SchedulePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [appointment, setAppointment] = useState<any>(null)
    const [schedules, setSchedules] = useState<DaySchedule[]>(
        DAYS.map(day => ({
            day_of_week: day.value,
            is_working_day: day.value >= 1 && day.value <= 5, // Mon-Fri default
            start_time: '09:00',
            end_time: '17:00',
        }))
    )

    useEffect(() => {
        loadAppointment()
    }, [])

    const loadAppointment = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            const { data, error }: { data: any; error: any } = await supabase
                .from('appointments')
                .select(`
          *,
          schedules (*)
        `)
                .eq('id', params.id)
                .single()

            if (error) throw error

            setAppointment(data)

            // Load existing schedules if any
            if (data.schedules && data.schedules.length > 0) {
                const loadedSchedules = DAYS.map(day => {
                    const existing = data.schedules.find((s: any) => s.day_of_week === day.value)
                    return existing || {
                        day_of_week: day.value,
                        is_working_day: false,
                        start_time: '09:00',
                        end_time: '17:00',
                    }
                })
                setSchedules(loadedSchedules)
            }
        } catch (error) {
            console.error('Error loading appointment:', error)
            toast.error('Failed to load appointment')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleDay = (dayIndex: number) => {
        setSchedules(prev =>
            prev.map((schedule, index) =>
                index === dayIndex
                    ? { ...schedule, is_working_day: !schedule.is_working_day }
                    : schedule
            )
        )
    }

    const handleTimeChange = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
        setSchedules(prev =>
            prev.map((schedule, index) =>
                index === dayIndex ? { ...schedule, [field]: value } : schedule
            )
        )
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await upsertSchedule(params.id, schedules)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Schedule saved successfully!')
                loadAppointment()
            }
        } catch (error) {
            toast.error('Failed to save schedule')
        } finally {
            setIsSaving(false)
        }
    }

    const handleGenerateSlots = async () => {
        setIsGenerating(true)
        try {
            const supabase = createClient()

            // Call the database function to generate slots
            const { error } = await (supabase.rpc as any)('generate_slots_for_appointment', {
                p_appointment_id: params.id,
            })

            if (error) throw error

            toast.success('Time slots generated successfully!')
        } catch (error) {
            console.error('Error generating slots:', error)
            toast.error('Failed to generate slots')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCopyToAll = (sourceIndex: number) => {
        const sourceSchedule = schedules[sourceIndex]
        setSchedules(prev =>
            prev.map(schedule => ({
                ...schedule,
                start_time: sourceSchedule.start_time,
                end_time: sourceSchedule.end_time,
            }))
        )
        toast.success('Times copied to all days')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-neutral-200 rounded w-1/3" />
                        <div className="h-64 bg-neutral-200 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.push(`/dashboard/appointments/${params.id}/edit`)}
                    className="flex items-center gap-2 text-neutral-400 hover:text-white mb-4 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Edit
                </button>
                <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Schedule Management
                </h1>
                <p className="text-neutral-400">{appointment?.title}</p>
            </div>

            {/* Info Card */}
            <Card className="mb-6 bg-mongodb-slate/30 border-blue-900/30">
                <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-mongodb-spring mt-0.5" />
                        <div>
                            <p className="font-medium text-white">How it works</p>
                            <p className="text-sm text-neutral-400 mt-1">
                                Set your working hours for each day. Time slots will be automatically generated based on your appointment duration ({appointment?.duration}).
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Schedule Editor */}
            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white">Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {schedules.map((schedule, index) => {
                        const day = DAYS[index]
                        return (
                            <div
                                key={day.value}
                                className={cn(
                                    'p-4 rounded-lg border transition-all',
                                    schedule.is_working_day
                                        ? 'border-mongodb-spring bg-mongodb-spring/10'
                                        : 'border-neutral-700 bg-mongodb-black'
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={schedule.is_working_day}
                                            onChange={() => handleToggleDay(index)}
                                            className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-mongodb-spring focus:ring-mongodb-spring"
                                        />
                                        <span className="font-semibold text-white">{day.name}</span>
                                    </label>
                                    {schedule.is_working_day && (
                                        <Badge variant="success">Working Day</Badge>
                                    )}
                                </div>

                                {schedule.is_working_day && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                value={schedule.start_time}
                                                onChange={(e) => handleTimeChange(index, 'start_time', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                value={schedule.end_time}
                                                onChange={(e) => handleTimeChange(index, 'end_time', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-neutral-700 bg-mongodb-black text-white focus:border-mongodb-spring focus:ring-1 focus:ring-mongodb-spring transition-all outline-none"
                                            />
                                        </div>

                                        <div className="pt-7">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopyToAll(index)}
                                                className="text-mongodb-spring hover:text-mongodb-spring/80 hover:bg-mongodb-spring/10"
                                            >
                                                Copy to All
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={handleSave}
                    isLoading={isSaving}
                    className="flex-1"
                    size="lg"
                    variant="primary"
                >
                    <Save className="w-5 h-5 mr-2" />
                    Save Schedule
                </Button>
                <Button
                    onClick={handleGenerateSlots}
                    isLoading={isGenerating}
                    variant="secondary"
                    className="flex-1 bg-neutral-800 text-white hover:bg-neutral-700"
                    size="lg"
                >
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Time Slots
                </Button>
            </div>

            {/* Preview Info */}
            <Card className="mt-6 bg-mongodb-slate/50 border-neutral-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Clock className="w-5 h-5 text-mongodb-spring" />
                        Slot Preview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {schedules
                            .filter(s => s.is_working_day)
                            .map((schedule, index) => {
                                const day = DAYS.find(d => d.value === schedule.day_of_week)
                                return (
                                    <div key={schedule.day_of_week} className="flex items-center justify-between p-3 bg-mongodb-black rounded-lg border border-neutral-700">
                                        <span className="font-medium text-white">{day?.name}</span>
                                        <span className="text-neutral-400">
                                            {schedule.start_time} - {schedule.end_time}
                                        </span>
                                    </div>
                                )
                            })}
                        {schedules.filter(s => s.is_working_day).length === 0 && (
                            <p className="text-center text-neutral-500 py-4">
                                No working days selected
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
