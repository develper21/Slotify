'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface ChartData {
    date: string
    bookings: number
}

export default function BookingsChart({ organizerId }: { organizerId: string }) {
    const [data, setData] = useState<ChartData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadChartData()
    }, [])

    const loadChartData = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()

            // Get appointments
            const { data: appointments }: { data: any[] | null } = await supabase
                .from('appointments')
                .select('id')
                .eq('organizer_id', organizerId)

            const appointmentIds = appointments?.map(a => a.id) || []

            // Get bookings from last 30 days
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            const { data: bookings } = await supabase
                .from('bookings')
                .select('created_at')
                .in('appointment_id', appointmentIds)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: true })

            // Group by date
            const grouped: { [key: string]: number } = {}
            bookings?.forEach((booking: any) => {
                const date = new Date(booking.created_at).toISOString().split('T')[0]
                grouped[date] = (grouped[date] || 0) + 1
            })

            // Convert to array
            const chartData = Object.entries(grouped).map(([date, count]) => ({
                date,
                bookings: count,
            }))

            setData(chartData)
        } catch (error) {
            console.error('Error loading chart data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const maxBookings = Math.max(...data.map(d => d.bookings), 1)

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Bookings Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-neutral-500">Loading...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Bookings Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-neutral-500">No booking data available</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bookings Over Time (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 flex items-end gap-2">
                    {data.map((item, index) => {
                        const height = (item.bookings / maxBookings) * 100
                        return (
                            <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                <div className="relative w-full group">
                                    <div
                                        className="w-full bg-gradient-primary rounded-t-lg transition-all hover:opacity-80"
                                        style={{ height: `${height}%`, minHeight: '4px' }}
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {item.bookings} booking{item.bookings !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500 rotate-45 origin-left whitespace-nowrap">
                                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
