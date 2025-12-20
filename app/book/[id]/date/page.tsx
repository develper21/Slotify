'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { cn, formatDate, isPastDate } from '@/lib/utils'

interface DatePickerPageProps {
    params: { id: string }
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function DatePickerPage({ params }: DatePickerPageProps) {
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [availableDates, setAvailableDates] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    // Generate calendar days
    const calendarDays: (Date | null)[] = []

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push(new Date(year, month - 1, daysInPrevMonth - i))
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(year, month, i))
    }

    // Next month days to fill the grid
    const remainingDays = 42 - calendarDays.length
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push(new Date(year, month + 1, i))
    }

    // TODO: Fetch available dates from server
    useEffect(() => {
        // Placeholder: In real implementation, fetch from getAvailableSlots
        // For now, mark all future dates as available
        const dates: string[] = []
        for (let i = 0; i < daysInMonth; i++) {
            const date = new Date(year, month, i + 1)
            if (!isPastDate(date)) {
                dates.push(date.toISOString().split('T')[0])
            }
        }
        setAvailableDates(dates)
    }, [year, month, daysInMonth])

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const handleDateSelect = (date: Date) => {
        if (isDateAvailable(date) && !isPastDate(date)) {
            setSelectedDate(date)
        }
    }

    const handleContinue = () => {
        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0]
            router.push(`/book/${params.id}/time?date=${dateStr}`)
        }
    }

    const isDateAvailable = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0]
        return availableDates.includes(dateStr)
    }

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === month
    }

    const isSelected = (date: Date) => {
        return selectedDate?.toDateString() === date.toDateString()
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
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
                        Select a Date
                    </h1>
                    <p className="text-neutral-600">Choose a date for your appointment</p>
                </div>

                {/* Calendar Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <CardTitle className="text-xl">
                                {MONTHS[month]} {year}
                            </CardTitle>
                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {DAYS.map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-neutral-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((date, index) => {
                                if (!date) return <div key={index} />

                                const isAvailable = isDateAvailable(date)
                                const isPast = isPastDate(date)
                                const isCurrent = isCurrentMonth(date)
                                const isSelectedDate = isSelected(date)

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDateSelect(date)}
                                        disabled={!isAvailable || isPast || !isCurrent}
                                        className={cn(
                                            'aspect-square rounded-lg text-sm font-medium transition-all duration-200',
                                            isCurrent ? 'text-neutral-900' : 'text-neutral-300',
                                            isSelectedDate && 'bg-gradient-primary text-white shadow-md scale-105',
                                            !isSelectedDate && isAvailable && !isPast && isCurrent && 'hover:bg-primary-50 hover:scale-105',
                                            (!isAvailable || isPast) && isCurrent && 'opacity-30 cursor-not-allowed',
                                            !isCurrent && 'cursor-not-allowed'
                                        )}
                                    >
                                        {date.getDate()}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 pt-6 border-t border-neutral-200 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-gradient-primary" />
                                <span className="text-neutral-600">Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-primary-50 border border-primary-200" />
                                <span className="text-neutral-600">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-neutral-100" />
                                <span className="text-neutral-600">Unavailable</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Date Display */}
                {selectedDate && (
                    <Card className="mt-6 bg-primary-50 border-primary-200">
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <p className="text-sm text-primary-700 font-medium">Selected Date</p>
                                        <p className="text-lg font-semibold text-primary-900">
                                            {formatDate(selectedDate)}
                                        </p>
                                    </div>
                                </div>
                                <Button onClick={handleContinue}>
                                    Continue
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
