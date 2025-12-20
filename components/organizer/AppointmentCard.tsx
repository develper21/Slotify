'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Clock, MapPin, Edit, Share2, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { formatDuration, getAppointmentLink, copyToClipboard } from '@/lib/utils'
import { togglePublishStatus, deleteAppointment } from '@/lib/actions/organizer'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AppointmentCardProps {
    appointment: any
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
    const router = useRouter()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isTogglingPublish, setIsTogglingPublish] = useState(false)

    const primaryImage = appointment.appointment_images?.find((img: any) => img.is_primary)
    const shareLink = getAppointmentLink(appointment.id)

    const handleCopyLink = async () => {
        const success = await copyToClipboard(shareLink)
        if (success) {
            toast.success('Link copied to clipboard!')
        } else {
            toast.error('Failed to copy link')
        }
    }

    const handleTogglePublish = async () => {
        setIsTogglingPublish(true)
        try {
            const result = await togglePublishStatus(appointment.id, appointment.published)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(appointment.published ? 'Appointment unpublished' : 'Appointment published')
                router.refresh()
            }
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setIsTogglingPublish(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteAppointment(appointment.id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Appointment deleted')
                setShowDeleteModal(false)
                router.refresh()
            }
        } catch (error) {
            toast.error('Failed to delete appointment')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Card hover className="overflow-hidden">
                {/* Image */}
                {primaryImage ? (
                    <div className="h-48 relative overflow-hidden">
                        <Image
                            src={primaryImage.image_url}
                            alt={appointment.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-48 bg-gradient-primary flex items-center justify-center">
                        <Clock className="w-16 h-16 text-white/50" />
                    </div>
                )}

                {/* Content */}
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2">{appointment.title}</CardTitle>
                        <Badge variant={appointment.published ? 'success' : 'warning'}>
                            {appointment.published ? 'Published' : 'Draft'}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(appointment.duration)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location || 'Online'}</span>
                    </div>

                    {/* Share Link */}
                    <div className="pt-3 border-t border-neutral-200">
                        <p className="text-xs text-neutral-500 mb-2">Share Link:</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={shareLink}
                                readOnly
                                className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg"
                            />
                            <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>

                {/* Actions */}
                <CardFooter className="flex gap-2">
                    <Link href={`/appointments/${appointment.id}/edit`} className="flex-1">
                        <Button variant="secondary" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleTogglePublish}
                        isLoading={isTogglingPublish}
                    >
                        {appointment.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Appointment"
                description="Are you sure you want to delete this appointment? This action cannot be undone."
            >
                <div className="flex gap-4 mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                        className="flex-1"
                    >
                        Delete
                    </Button>
                </div>
            </Modal>
        </>
    )
}
