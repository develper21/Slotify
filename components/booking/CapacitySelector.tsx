'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Minus, Plus } from 'lucide-react'

export function CapacitySelector({
    appointmentId,
    minCapacity,
    maxCapacity,
    resourceId,
    date,
    slotId,
}: {
    appointmentId: string
    minCapacity: number
    maxCapacity: number
    resourceId?: string
    date?: string
    slotId?: string
}) {
    const [capacity, setCapacity] = useState(minCapacity)

    const handleIncrease = () => {
        if (capacity < maxCapacity) {
            setCapacity(capacity + 1)
        }
    }

    const handleDecrease = () => {
        if (capacity > minCapacity) {
            setCapacity(capacity - 1)
        }
    }

    const handleContinue = () => {
        const params = new URLSearchParams()
        if (resourceId) params.set('resource', resourceId)
        if (date) params.set('date', date)
        if (slotId) params.set('slot', slotId)
        params.set('capacity', capacity.toString())

        window.location.href = `/book/${appointmentId}/form?${params.toString()}`
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="flex items-center justify-center gap-6">
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleDecrease}
                    disabled={capacity <= minCapacity}
                    className="!w-14 !h-14 !p-0 rounded-full"
                >
                    <Minus className="w-6 h-6" />
                </Button>

                <div className="text-center min-w-[100px]">
                    <div className="text-5xl font-bold text-primary">
                        {capacity}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">
                        {capacity === 1 ? 'spot' : 'spots'}
                    </div>
                </div>

                <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleIncrease}
                    disabled={capacity >= maxCapacity}
                    className="!w-14 !h-14 !p-0 rounded-full"
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </div>

            <Button onClick={handleContinue} className="w-full" size="lg">
                Continue to Booking Form
            </Button>
        </div>
    )
}
