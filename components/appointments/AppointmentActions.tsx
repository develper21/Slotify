'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { toggleActiveStatus, deleteAppointment } from '@/lib/actions/organizer'
import { toast } from 'sonner'

export function TogglePublishButton({
    appointmentId,
    currentStatus,
}: {
    appointmentId: string
    currentStatus: boolean
}) {
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        setLoading(true)
        const result = await toggleActiveStatus(appointmentId, currentStatus)

        if (!result.success) {
            toast.error(result.message || 'Failed to update status')
        } else {
            toast.success(currentStatus ? 'Appointment hidden' : 'Appointment set to active')
            window.location.reload()
        }

        setLoading(false)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            isLoading={loading}
            className="w-10 h-10 p-0 rounded-full hover:bg-neutral-800 transition-colors"
            title={currentStatus ? "Hide Appointment" : "Show Appointment"}
        >
            {currentStatus ? (
                <EyeOff className="w-5 h-5 text-mongodb-spring" />
            ) : (
                <Eye className="w-5 h-5 text-neutral-500" />
            )}
        </Button>
    )
}

export function DeleteButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this appointment? All associated bookings will remain in history but this appointment plan will be deleted forever.')) {
            return
        }

        setLoading(true)
        const result = await deleteAppointment(appointmentId)

        if (!result.success) {
            toast.error(result.message || 'Failed to delete appointment')
            setLoading(false)
        } else {
            toast.success('Appointment deleted successfully')
            window.location.reload()
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            isLoading={loading}
            className="w-10 h-10 p-0 rounded-full text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Delete Appointment"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    )
}
