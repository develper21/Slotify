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
    business_name: string | null
    approved: boolean
    created_at: string
    users: {
        full_name: string
        email: string
        status: string
    }
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
            <Card>
                <CardHeader>
                    <CardTitle>Organizers Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-neutral-500 py-8">Loading organizers...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organizers Management ({organizers.length} total)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200">
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Business</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Approval</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Registered</th>
                                <th className="text-left py-3 px-4 font-semibold text-neutral-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizers.map((organizer) => (
                                <tr key={organizer.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="py-3 px-4">{organizer.users.full_name}</td>
                                    <td className="py-3 px-4 text-neutral-600">
                                        {organizer.business_name || '-'}
                                    </td>
                                    <td className="py-3 px-4 text-neutral-600">{organizer.users.email}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant={organizer.users.status === 'active' ? 'success' : 'danger'}>
                                            {organizer.users.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge variant={organizer.approved ? 'success' : 'warning'}>
                                            {organizer.approved ? (
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <XCircle className="w-3 h-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-neutral-600 text-sm">
                                        {formatDate(new Date(organizer.created_at))}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            {!organizer.approved ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleApprove(organizer.id)}
                                                >
                                                    Approve
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleDisable(organizer.id)}
                                                >
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
