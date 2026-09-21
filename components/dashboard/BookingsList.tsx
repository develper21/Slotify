'use client'

import { DataTable } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { StatusUpdateButton } from '@/components/bookings/BookingActions'
import { format } from 'date-fns'

interface BookingsListProps {
    bookings: any[]
}

export function BookingsList({ bookings }: BookingsListProps) {
    const columns = [
        {
            key: 'id',
            header: 'Booking ID',
            render: (booking: any) => (
                <span className="font-mono text-xs text-neutral-400">{booking.id?.slice(0, 8) || '-'}</span>
            ),
            width: 'w-24'
        },
        {
            key: 'customer',
            header: 'Customer',
            render: (booking: any) => (
                <div>
                    <p className="font-medium text-white">
                        {booking.customer?.fullName || 'N/A'}
                    </p>
                    <p className="text-xs text-neutral-400">{booking.customer?.email || ''}</p>
                </div>
            ),
            sortable: true
        },
        {
            key: 'appointment',
            header: 'Appointment',
            render: (booking: any) => <span className="text-white">{booking.appointment?.title || 'N/A'}</span>,
            sortable: true
        },
        {
            key: 'date',
            header: 'Date & Time',
            render: (booking: any) => (
                <div>
                    <p className="text-sm text-white">
                        {booking.startTime ? format(new Date(booking.startTime), 'MMM d, yyyy') : 'N/A'}
                    </p>
                    <p className="text-xs text-neutral-400">
                        {booking.startTime ? format(new Date(booking.startTime), 'HH:mm') : ''} - {booking.endTime ? format(new Date(booking.endTime), 'HH:mm') : ''}
                    </p>
                </div>
            ),
            sortable: true
        },
        {
            key: 'status',
            header: 'Status',
            render: (booking: any) => (
                <Badge
                    variant={
                        booking.status === 'confirmed' ? 'success' :
                            booking.status === 'pending' ? 'warning' :
                                booking.status === 'cancelled' ? 'danger' :
                                    'default' as any
                    }
                >
                    {booking.status}
                </Badge>
            ),
            sortable: true
        }
    ]

    return (
        <DataTable
            data={bookings}
            columns={columns}
            keyExtractor={(booking: any) => booking.id}
            actions={(booking: any) => (
                <StatusUpdateButton bookingId={booking.id} currentStatus={booking.status} />
            )}
            emptyMessage="No bookings found"
            pageSize={15}
        />
    )
}
