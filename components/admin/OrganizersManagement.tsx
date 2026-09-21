'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getAllOrganizers, approveOrganizer, disableOrganizer } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

interface Organizer {
    id: string
    fullName: string | null
    email: string | null
    businessName: string | null
    status: string | null
    createdAt: Date | null
}

export default function OrganizersManagement() {
    const [organizers, setOrganizers] = useState<Organizer[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadOrganizers()
    }, [])

    const loadOrganizers = async () => {
        setIsLoading(true)
        try {
            const data = await getAllOrganizers()
            setOrganizers(data as Organizer[])
        } catch (error) {
            toast.error('Failed to load organizers')
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async (organizerId: string) => {
        try {
            const result = await approveOrganizer(organizerId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Organizer approved')
                loadOrganizers()
            }
        } catch (error) {
            toast.error('Failed to approve organizer')
        }
    }

    const handleDisable = async (organizerId: string) => {
        if (!confirm('Are you sure you want to disable this organizer?')) {
            return
        }

        try {
            const result = await disableOrganizer(organizerId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Organizer disabled')
                loadOrganizers()
            }
        } catch (error) {
            toast.error('Failed to disable organizer')
        }
    }

    if (isLoading) {
        return (
            <Card className="bg-mongodb-slate/50 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white">Organizers Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-neutral-400 py-8">Loading organizers...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-mongodb-slate/50 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-white">Organizers Management ({organizers.length} total)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-800">
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Business</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Registered</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizers.map((organizer) => (
                                <tr key={organizer.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                                    <td className="py-3 px-4 text-white">{organizer.fullName}</td>
                                    <td className="py-3 px-4 text-neutral-400">
                                        {organizer.businessName || '-'}
                                    </td>
                                    <td className="py-3 px-4 text-neutral-400">{organizer.email}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant={organizer.status === 'active' ? 'success' : 'danger'}>
                                            {organizer.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-neutral-400 text-sm">
                                        {organizer.createdAt ? formatDate(organizer.createdAt) : '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            {organizer.status !== 'active' ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(organizer.id)}
                                                    className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                                                    Activate
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleDisable(organizer.id)}>
                                                    Disable
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
