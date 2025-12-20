'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Image } from 'lucide-react'

export default function PictureTab({ appointment }: { appointment: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointment Images</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <Image className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                        Image Gallery
                    </h3>
                    <p className="text-neutral-500 mb-4">
                        Upload images to showcase your appointment
                    </p>
                    <Badge variant="info">Coming Soon</Badge>
                </div>
            </CardContent>
        </Card>
    )
}
