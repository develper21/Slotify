'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { togglePublishStatus, deleteAppointment } from '@/lib/actions/organizer'
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
        const result = await togglePublishStatus(appointmentId, currentStatus)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(currentStatus ? 'Appointment unpublished' : 'Appointment published')
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
            className="!p-2"
        >
            {currentStatus ? (
                <EyeOff className="w-5 h-5 text-neutral-600" />
            ) : (
                <Eye className="w-5 h-5 text-neutral-600" />
            )}
        </Button>
    )
}

export function DeleteButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
            return
        }

        setLoading(true)
        const result = await deleteAppointment(appointmentId)

        if (result.error) {
            toast.error(result.error)
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
            className="!p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    )
}
