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

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const calendarDays: (Date | null)[] = []

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarDays.push(new Date(year, month - 1, daysInPrevMonth - i))
    }

    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(year, month, i))
    }

    const remainingDays = 42 - calendarDays.length
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push(new Date(year, month + 1, i))
    }

    useEffect(() => {
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
        <div className="max-w-2xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
                    Pick a <span className="gradient-text">Date</span>
                </h1>
                <p className="text-xl text-neutral-400">Choose a day that works best for you</p>
            </div>

            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <CardTitle className="text-xl text-white">
                            {MONTHS[month]} {year}
                        </CardTitle>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-white">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {DAYS.map((day) => (
                            <div key={day} className="text-center text-sm font-medium text-neutral-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

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
                                        isCurrent ? 'text-white' : 'text-neutral-600',
                                        isSelectedDate && 'bg-mongodb-spring text-mongodb-black shadow-md scale-105 font-bold',
                                        !isSelectedDate && isAvailable && !isPast && isCurrent && 'hover:bg-neutral-800 hover:scale-105',
                                        (!isAvailable || isPast) && isCurrent && 'opacity-30 cursor-not-allowed',
                                        !isCurrent && 'cursor-not-allowed opacity-20'
                                    )}>
                                    {date.getDate()}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-800 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-mongodb-spring" />
                            <span className="text-neutral-400">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-neutral-800 border border-neutral-700" />
                            <span className="text-neutral-400">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-neutral-900 opacity-30" />
                            <span className="text-neutral-600">Unavailable</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {selectedDate && (
                <Card className="mt-6 bg-mongodb-spring/10 border-mongodb-spring/20">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-5 h-5 text-mongodb-spring" />
                                <div>
                                    <p className="text-sm text-mongodb-spring/80 font-medium">Selected Date</p>
                                    <p className="text-lg font-semibold text-white">
                                        {formatDate(selectedDate)}
                                    </p>
                                </div>
                            </div>
                            <Button onClick={handleContinue} className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                                Continue
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
