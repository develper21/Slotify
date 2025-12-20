'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ChevronLeft, Clock, Users } from 'lucide-react'
import { cn, formatTime, formatDate } from '@/lib/utils'
import { getAvailableSlots } from '@/lib/actions/appointments'

interface TimeSlotPageProps {
    params: { id: string }
}

interface TimeSlot {
    id: string
    start_time: string
    end_time: string
    available_capacity: number
    max_capacity: number
}

export default function TimeSlotPage({ params }: TimeSlotPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const date = searchParams.get('date')

    const [slots, setSlots] = useState<TimeSlot[]>([])
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (date) {
            loadSlots()
        }
    }, [date])

    const loadSlots = async () => {
        setIsLoading(true)
        try {
            const data = await getAvailableSlots(params.id, date!)
            setSlots(data as TimeSlot[])
        } catch (error) {
            console.error('Error loading slots:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSlotSelect = (slot: TimeSlot) => {
        setSelectedSlot(slot)
    }

    const handleContinue = () => {
        if (selectedSlot) {
            router.push(`/book/${params.id}/form?date=${date}&slot=${selectedSlot.id}`)
        }
    }

    if (!date) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-neutral-600">No date selected. Please go back and select a date.</p>
                        <Button onClick={() => router.back()} className="mt-4">
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
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
                        Back
                    </button>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Select a Time
                    </h1>
                    <p className="text-neutral-600">
                        Available time slots for {formatDate(new Date(date))}
                    </p>
                </div>

                {/* Time Slots */}
                <Card>
                    <CardHeader>
                        <CardTitle>Available Time Slots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="text-center py-12">
                                <Clock className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                                <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                                    No Available Slots
                                </h3>
                                <p className="text-neutral-500 mb-4">
                                    There are no available time slots for this date.
                                </p>
                                <Button onClick={() => router.back()} variant="secondary">
                                    Choose Another Date
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {slots.map((slot) => {
                                    const isSelected = selectedSlot?.id === slot.id
                                    const isFull = slot.available_capacity === 0
                                    const isLowCapacity = slot.available_capacity <= slot.max_capacity * 0.3

                                    return (
                                        <button
                                            key={slot.id}
                                            onClick={() => handleSlotSelect(slot)}
                                            disabled={isFull}
                                            className={cn(
                                                'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                                isSelected && 'border-primary-500 bg-primary-50 shadow-md',
                                                !isSelected && !isFull && 'border-neutral-200 hover:border-primary-300 hover:shadow-sm',
                                                isFull && 'border-neutral-200 bg-neutral-50 opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock className={cn(
                                                        'w-5 h-5',
                                                        isSelected ? 'text-primary-600' : 'text-neutral-600'
                                                    )} />
                                                    <span className={cn(
                                                        'font-semibold text-lg',
                                                        isSelected ? 'text-primary-900' : 'text-neutral-900'
                                                    )}>
                                                        {formatTime(slot.start_time)}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-neutral-600">
                                                    to {formatTime(slot.end_time)}
                                                </span>
                                                {slot.max_capacity > 1 && (
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4 text-neutral-500" />
                                                        <span className={cn(
                                                            'font-medium',
                                                            isLowCapacity ? 'text-orange-600' : 'text-neutral-600'
                                                        )}>
                                                            {slot.available_capacity}/{slot.max_capacity} spots
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {isFull && (
                                                <div className="mt-2 text-sm font-medium text-red-600">
                                                    Fully Booked
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Continue Button */}
                {selectedSlot && (
                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleContinue} size="lg">
                            Continue to Booking Form
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
