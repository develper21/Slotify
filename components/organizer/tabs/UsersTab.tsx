'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users } from 'lucide-react'

export default function UsersTab({ appointment }: { appointment: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Assigned Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                        User Assignment
                    </h3>
                    <p className="text-neutral-500 mb-4">
                        Assign team members to handle this appointment type
                    </p>
                    <Badge variant="info">Coming Soon</Badge>
                </div>
            </CardContent>
        </Card>
    )
}
