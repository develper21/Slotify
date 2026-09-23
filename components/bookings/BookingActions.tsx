'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Badge } from '@/components/ui/Badge'
import { updateBookingStatus, deleteBooking, exportBookingsToCSV } from '@/lib/actions/bookings'
import { toast } from 'sonner'
import { Download, Eye, Trash2, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

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

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search)
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/dashboard/bookings?${params.toString()}`)
    }

    const statuses = [
        { label: 'All Statuses', value: '' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Pending', value: 'pending' },
        { label: 'Cancelled', value: 'cancelled' },
    ]

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-mongodb-black/70 p-1 rounded-xl border border-neutral-800">
                {statuses.map((s) => {
                    const isActive = (!currentStatus && !s.value) || currentStatus === s.value
                    return (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => handleFilterChange('status', s.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isActive
                                    ? 'bg-mongodb-spring text-mongodb-black shadow-md'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                            }`}
                        >
                            {s.label}
                        </button>
                    )
                })}
            </div>

            {appointments && appointments.length > 0 && (
                <div className="relative">
                    <select
                        value={currentAppointment || ''}
                        onChange={(e) => handleFilterChange('appointment', e.target.value)}
                        className="bg-mongodb-black/70 text-xs font-semibold text-neutral-300 border border-neutral-800 rounded-xl px-3 py-2 focus:outline-none focus:border-mongodb-spring transition-colors cursor-pointer"
                    >
                        <option value="">All Services</option>
                        {appointments.map((apt: any) => (
                            <option key={apt.id} value={apt.id}>
                                {apt.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}
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
    const router = useRouter()

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return
        setLoading(true)
        try {
            const result = await updateBookingStatus(bookingId, newStatus)
            if (!result.success) {
                toast.error(result.message || 'Failed to update status')
            } else {
                toast.success(`Booking set to ${newStatus}`)
                router.refresh()
            }
        } catch (error) {
            toast.error('Unexpected error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative inline-block">
            <select
                disabled={loading}
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border appearance-none cursor-pointer focus:outline-none transition-all ${
                    currentStatus === 'confirmed'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:border-green-500/50'
                        : currentStatus === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:border-yellow-500/50'
                        : 'bg-red-500/10 text-red-400 border-red-500/30 hover:border-red-500/50'
                }`}
            >
                <option value="confirmed" className="bg-mongodb-slate text-white">Confirmed</option>
                <option value="pending" className="bg-mongodb-slate text-white">Pending</option>
                <option value="cancelled" className="bg-mongodb-slate text-white">Cancelled</option>
            </select>
        </div>
    )
}

export function BookingRowActions({ booking }: { booking: any }) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()
    const { confirm, confirmDialog } = useConfirmDialog()

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: 'Delete Booking',
            description: 'Are you sure you want to permanently delete this booking record? This cannot be undone.',
            confirmLabel: 'Delete',
        })
        if (!confirmed) return
        setIsDeleting(true)
        try {
            const res = await deleteBooking(booking.id)
            if (res.success) {
                toast.success('Booking deleted')
                router.refresh()
            } else {
                toast.error(res.message || 'Delete failed')
            }
        } catch (err) {
            toast.error('Unexpected error')
        } finally {
            setIsDeleting(false)
        }
    }

    const answers = booking.answers && typeof booking.answers === 'object' ? Object.entries(booking.answers) : []

    return (
        <>
            <div className="flex items-center gap-2">
                <StatusUpdateButton bookingId={booking.id} currentStatus={booking.status} />

                <button
                    type="button"
                    onClick={() => setIsDetailsOpen(true)}
                    title="View Booking Details & Answers"
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    title="Delete Booking"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Booking Overview"
                className="max-w-xl"
            >
                <div className="space-y-6 pt-2">
                    <div className="bg-mongodb-black/50 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Service</span>
                            <h4 className="text-lg font-bold text-white">{booking.appointment?.title || 'Appointment'}</h4>
                            <p className="text-xs text-neutral-400">{booking.appointment?.locationDetails || 'Online Session'}</p>
                        </div>
                        <Badge
                            variant={
                                booking.status === 'confirmed' ? 'success' :
                                booking.status === 'pending' ? 'warning' : 'danger'
                            }
                        >
                            {booking.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-mongodb-black/30 p-3 rounded-xl border border-neutral-800/80">
                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                                <User className="w-3.5 h-3.5 text-mongodb-spring" /> Customer
                            </div>
                            <p className="text-sm font-semibold text-white">{booking.customer?.fullName || 'Anonymous'}</p>
                            <p className="text-xs text-neutral-400 truncate">{booking.customer?.email || 'No email'}</p>
                        </div>

                        <div className="bg-mongodb-black/30 p-3 rounded-xl border border-neutral-800/80">
                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
                                <Calendar className="w-3.5 h-3.5 text-mongodb-spring" /> Schedule
                            </div>
                            <p className="text-sm font-semibold text-white">
                                {booking.startTime ? format(new Date(booking.startTime), 'MMM d, yyyy') : 'N/A'}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {booking.startTime ? format(new Date(booking.startTime), 'HH:mm') : ''} - {booking.endTime ? format(new Date(booking.endTime), 'HH:mm') : ''}
                            </p>
                        </div>
                    </div>

                    {booking.totalPrice && parseFloat(booking.totalPrice) > 0 && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-mongodb-spring/5 border border-mongodb-spring/20 text-mongodb-spring">
                            <span className="text-xs font-bold uppercase tracking-wider">Total Amount</span>
                            <span className="text-base font-black">${parseFloat(booking.totalPrice).toFixed(2)}</span>
                        </div>
                    )}

                    <div>
                        <h5 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">
                            Intake Answers & Form Responses
                        </h5>
                        {answers.length === 0 ? (
                            <p className="text-xs text-neutral-500 italic p-3 bg-neutral-900/30 rounded-lg">
                                No custom question answers recorded for this booking.
                            </p>
                        ) : (
                            <div className="space-y-2 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800">
                                {answers.map(([key, val]: any) => (
                                    <div key={key} className="text-xs border-b border-neutral-800/60 pb-2 last:border-b-0 last:pb-0">
                                        <span className="text-neutral-400 font-medium block capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="text-white font-semibold">{String(val) || '—'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button variant="ghost" onClick={() => setIsDetailsOpen(false)} className="rounded-xl px-5 text-sm">
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            {confirmDialog}
        </>
    )
}

export function ExportButton({ organizerId }: { organizerId: string }) {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        try {
            const csv = await exportBookingsToCSV(organizerId)

            if (csv) {
                const blob = new Blob([csv], { type: 'text/csv' })
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
        } catch (error) {
            toast.error('Failed to export bookings')
        }
        setLoading(false)
    }

    return (
        <Button
            variant="secondary"
            onClick={handleExport}
            isLoading={loading}
            className="rounded-xl border border-neutral-700 bg-mongodb-black/60 hover:bg-neutral-800 text-white font-semibold text-xs h-10 px-4"
        >
            <Download className="w-4 h-4 mr-2 text-mongodb-spring" />
            Export CSV
        </Button>
    )
}
