'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { updateBookingStatus, exportBookingsToCSV } from '@/lib/actions/bookings'
import { toast } from 'sonner'
import { Download } from 'lucide-react'

export function BookingFilters({
    currentStatus,
    currentAppointment,
    appointments,
}: {
    currentStatus?: string
    currentAppointment?: string
    appointments: any[]
}) {
    const router = useRouter()

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(window.location.search)
        if (status) {
            params.set('status', status)
        } else {
            params.delete('status')
        }
        router.push(`/bookings?${params.toString()}`)
    }

    const handleAppointmentChange = (appointmentId: string) => {
        const params = new URLSearchParams(window.location.search)
        if (appointmentId) {
            params.set('appointment', appointmentId)
        } else {
            params.delete('appointment')
        }
        router.push(`/bookings?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-4">
            <Select
                options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={currentStatus || ''}
                onChange={handleStatusChange}
                placeholder="Filter by status"
            />
            <Select
                options={[
                    { value: '', label: 'All Appointments' },
                    ...appointments.map((apt: any) => ({
                        value: apt.id,
                        label: apt.title,
                    })),
                ]}
                value={currentAppointment || ''}
                onChange={handleAppointmentChange}
                placeholder="Filter by appointment"
            />
        </div>
    )
}

export function StatusUpdateButton({
    bookingId,
    currentStatus,
}: {
    bookingId: string
    currentStatus: string
}) {
    const [loading, setLoading] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true)
        const result = await updateBookingStatus(bookingId, newStatus)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Booking status updated')
            window.location.reload()
        }

        setLoading(false)
    }

    return (
        <Select
            options={[
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={currentStatus}
            onChange={handleStatusChange}
            disabled={loading}
        />
    )
}

export function ExportButton({ organizerId }: { organizerId: string }) {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        const result: any = await exportBookingsToCSV(organizerId)

        if (result?.error) {
            toast.error(result.error)
        } else if (result?.csv) {
            // Create download link
            const blob = new Blob([result.csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
            toast.success('Bookings exported successfully')
        }

        setLoading(false)
    }

    return (
        <Button variant="secondary" onClick={handleExport} isLoading={loading}>
            <Download className="w-5 h-5 mr-2" />
            Export CSV
        </Button>
    )
}
