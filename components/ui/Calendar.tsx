'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface CalendarProps {
    selectedDate?: Date
    onDateSelect: (date: Date) => void
    minDate?: Date
    maxDate?: Date
    disabledDates?: Date[]
    availableDates?: Date[]
    className?: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

export function Calendar({
    selectedDate,
    onDateSelect,
    minDate = new Date(),
    maxDate,
    disabledDates = [],
    availableDates,
    className = ''
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

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

    const isDateDisabled = (date: Date) => {
        const dateStr = date.toDateString()

        // Check if before min date
        if (minDate && date < minDate) return true

        // Check if after max date
        if (maxDate && date > maxDate) return true

        // Check if in disabled dates
        if (disabledDates.some(d => d.toDateString() === dateStr)) return true

        // If availableDates is provided, only those dates are enabled
        if (availableDates && !availableDates.some(d => d.toDateString() === dateStr)) return true

        return false
    }

    const isDateSelected = (date: Date) => {
        return selectedDate?.toDateString() === date.toDateString()
    }

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === month
    }

    const isToday = (date: Date) => {
        return date.toDateString() === new Date().toDateString()
    }

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1))
    }

    const handleDateClick = (date: Date) => {
        if (!isDateDisabled(date)) {
            onDateSelect(date)
        }
    }

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevMonth}
                    className="!p-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <h3 className="text-lg font-semibold text-neutral-800">
                    {MONTHS[month]} {year}
                </h3>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextMonth}
                    className="!p-2"
                >
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS.map(day => (
                    <div
                        key={day}
                        className="text-center text-sm font-medium text-neutral-500 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, index) => {
                    if (!date) return <div key={index} />

                    const disabled = isDateDisabled(date)
                    const selected = isDateSelected(date)
                    const currentMonth = isCurrentMonth(date)
                    const today = isToday(date)

                    return (
                        <button
                            key={index}
                            onClick={() => handleDateClick(date)}
                            disabled={disabled}
                            className={`
                                aspect-square rounded-lg text-sm font-medium
                                transition-all duration-200
                                ${!currentMonth ? 'text-neutral-300' : 'text-neutral-700'}
                                ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-primary/10 hover:scale-105'}
                                ${selected ? 'bg-primary text-white hover:bg-primary' : ''}
                                ${today && !selected ? 'ring-2 ring-primary/30' : ''}
                                ${!disabled && !selected ? 'hover:shadow-md' : ''}
                            `}
                        >
                            {date.getDate()}
                        </button>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded ring-2 ring-primary/30" />
                    <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-neutral-200 opacity-40" />
                    <span>Unavailable</span>
                </div>
            </div>
        </div>
    )
}
