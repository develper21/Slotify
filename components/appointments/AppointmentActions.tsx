'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Eye, EyeOff, Trash2, Globe, Lock } from 'lucide-react'
import { toggleActiveStatus, deleteAppointment } from '@/lib/actions/organizer'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function TogglePublishButton({
    appointmentId,
    currentStatus,
}: {
    appointmentId: string
    currentStatus: boolean
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)
        try {
            const result = await toggleActiveStatus(appointmentId, currentStatus)

            if (!result.success) {
                toast.error(result.message || 'Failed to update status')
            } else {
                toast.success(currentStatus ? 'Plan hidden from public marketplace' : 'Plan published live to marketplace!')
                router.refresh()
            }
        } catch {
            toast.error('Network error updating status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all border ${
                currentStatus
                    ? 'bg-mongodb-spring/10 text-mongodb-spring border-mongodb-spring/30 hover:bg-mongodb-spring/20'
                    : 'bg-[#001E2B] text-neutral-400 border-white/10 hover:border-white/25'
            }`}
            title={currentStatus ? "Published: Click to hide" : "Draft: Click to publish"}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentStatus ? 'bg-mongodb-spring animate-pulse' : 'bg-neutral-500'}`} />
            <span>{currentStatus ? 'Live' : 'Draft'}</span>
        </button>
    )
}

export function DeleteButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { confirm, confirmDialog } = useConfirmDialog()

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const confirmed = await confirm({
            title: 'Delete Appointment',
            description: 'Are you sure you want to permanently delete this appointment? All its schedules and questions will also be removed.',
            confirmLabel: 'Delete',
        })
        if (!confirmed) {
            return
        }

        setLoading(true)
        try {
            const result = await deleteAppointment(appointmentId)

            if (!result.success) {
                toast.error(result.message || 'Failed to delete appointment')
            } else {
                toast.success('Appointment deleted successfully')
                router.refresh()
            }
        } catch {
            toast.error('Error deleting appointment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                isLoading={loading}
                className="w-9 h-9 p-0 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete Appointment">
                <Trash2 className="w-4 h-4" />
            </Button>
            {confirmDialog}
        </>
    )
}
