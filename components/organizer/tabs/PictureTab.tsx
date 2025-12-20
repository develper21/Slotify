'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Image } from 'lucide-react'

export default function PictureTab({ appointment }: { appointment: any }) {
    return (
        <Card className="bg-mongodb-slate/50 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-white">Appointment Images</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <Image className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Image Gallery
                    </h3>
                    <p className="text-neutral-400 mb-4">
                        Upload images to showcase your appointment
                    </p>
                    <Badge variant="info">Coming Soon</Badge>
                </div>
            </CardContent>
        </Card>
    )
}
