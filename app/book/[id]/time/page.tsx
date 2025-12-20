'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ChevronLeft, ChevronRight, Clock, Users, Sun, Sunset, Moon } from 'lucide-react'
import { cn, formatTime, formatDate } from '@/lib/utils'
import { getAvailableSlots } from '@/lib/actions/appointments'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'

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
            <div className="min-h-screen bg-mongodb-black flex items-center justify-center">
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="py-8 text-center">
                        <p className="text-neutral-400">No date selected. Please go back and select a date.</p>
                        <Button onClick={() => router.back()} className="mt-4" variant="outline">
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const groupedSlots = {
        morning: slots.filter(s => s.start_time < '12:00:00'),
        afternoon: slots.filter(s => s.start_time >= '12:00:00' && s.start_time < '17:00:00'),
        evening: slots.filter(s => s.start_time >= '17:00:00')
    }

    const renderSlotGrid = (periodSlots: TimeSlot[]) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {periodSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id
                const isFull = slot.available_capacity === 0
                return (
                    <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={isFull}
                        className={cn(
                            'p-4 rounded-xl border-2 transition-all duration-300 text-left relative group',
                            isSelected
                                ? 'border-mongodb-spring bg-mongodb-spring/5 shadow-[0_0_20px_rgba(0,237,100,0.1)]'
                                : 'border-neutral-800 bg-mongodb-black text-white hover:border-neutral-600',
                            isFull && 'opacity-30 cursor-not-allowed grayscale'
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isSelected ? "bg-mongodb-spring/20 text-mongodb-spring" : "bg-neutral-800 text-neutral-400"
                                )}>
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="text-xl font-bold font-display tracking-tight">
                                    {formatTime(slot.start_time)}
                                </span>
                            </div>
                            {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-mongodb-spring flex items-center justify-center animate-scale-in">
                                    <svg className="w-3 h-3 text-mongodb-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Ends at {formatTime(slot.end_time)}</span>
                            {slot.max_capacity > 1 && (
                                <span className={cn(
                                    "font-medium",
                                    slot.available_capacity < 3 ? "text-orange-500" : "text-neutral-500"
                                )}>
                                    {slot.available_capacity} left
                                </span>
                            )}
                        </div>
                    </button>
                )
            })}
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-white mb-6 transition-colors px-4 py-2 rounded-full bg-neutral-900/50 border border-neutral-800"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Go Back
                </button>
                <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
                    Select a <span className="gradient-text">Time</span>
                </h1>
                <p className="text-xl text-neutral-400">
                    {formatDate(new Date(date))}
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 4, 5, 6].map(i => <Skeleton key={i} className="h-24 w-full bg-neutral-800/50 rounded-xl" />)}
                </div>
            ) : slots.length === 0 ? (
                <Card className="bg-mongodb-slate/30 border-dashed border-neutral-700 p-12 text-center">
                    <Clock className="w-16 h-16 mx-auto text-neutral-600 mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-white mb-2">No availability</h3>
                    <p className="text-neutral-500 mb-6">Fully booked or out of working hours.</p>
                    <Button onClick={() => router.back()} variant="outline">Pick another day</Button>
                </Card>
            ) : (
                <Tabs defaultValue="morning" className="w-full">
                    <div className="flex justify-center mb-10">
                        <TabsList className="bg-mongodb-black/80 p-1.5 border-neutral-800">
                            <TabsTrigger value="morning" className="gap-2 px-6">
                                <Sun className="w-4 h-4" /> Morning
                            </TabsTrigger>
                            <TabsTrigger value="afternoon" className="gap-2 px-6">
                                <Sunset className="w-4 h-4" /> Afternoon
                            </TabsTrigger>
                            <TabsTrigger value="evening" className="gap-2 px-6">
                                <Moon className="w-4 h-4" /> Evening
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="morning">
                        {groupedSlots.morning.length > 0 ? renderSlotGrid(groupedSlots.morning) : (
                            <p className="text-center py-12 text-neutral-500 font-medium">No morning slots available</p>
                        )}
                    </TabsContent>
                    <TabsContent value="afternoon">
                        {groupedSlots.afternoon.length > 0 ? renderSlotGrid(groupedSlots.afternoon) : (
                            <p className="text-center py-12 text-neutral-500 font-medium">No afternoon slots available</p>
                        )}
                    </TabsContent>
                    <TabsContent value="evening">
                        {groupedSlots.evening.length > 0 ? renderSlotGrid(groupedSlots.evening) : (
                            <p className="text-center py-12 text-neutral-500 font-medium">No evening slots available</p>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* Sticky Footer for Continue */}
            {selectedSlot && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                    <Button
                        onClick={handleContinue}
                        size="lg"
                        className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90 px-12 h-16 rounded-full text-lg shadow-[0_10px_40px_rgba(0,237,100,0.2)] font-bold"
                    >
                        Continue to Details
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    )
}
