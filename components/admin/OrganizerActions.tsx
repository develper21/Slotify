'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle } from 'lucide-react'
import { approveOrganizer, disableOrganizer } from '@/lib/actions/admin'
import { toast } from 'sonner'

export function ApprovalActions({ organizerId }: { organizerId: string }) {
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        setLoading(true)
        const result = await approveOrganizer(organizerId)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Organizer approved successfully')
            window.location.reload()
        }

        setLoading(false)
    }

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject this organizer application?')) {
            return
        }

        setLoading(true)
        const result = await disableOrganizer(organizerId)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Organizer rejected')
            window.location.reload()
        }

        setLoading(false)
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="secondary"
                size="sm"
                onClick={handleApprove}
                isLoading={loading}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                isLoading={loading}>
                <XCircle className="w-4 h-4 mr-1" />
                Reject
            </Button>
        </div>
    )
}

export function DisableButton({ organizerId }: { organizerId: string }) {
    const [loading, setLoading] = useState(false)

    const handleDisable = async () => {
        if (!confirm('Are you sure you want to disable this organizer?')) {
            return
        }

        setLoading(true)
        const result = await disableOrganizer(organizerId)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Organizer disabled successfully')
            window.location.reload()
        }

        setLoading(false)
    }

    return (
        <Button
            variant="danger"
            size="sm"
            onClick={handleDisable}
            isLoading={loading}>
            Disable
        </Button>
    )
}
