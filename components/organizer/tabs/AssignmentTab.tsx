'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { UserCheck } from 'lucide-react'

export default function AssignmentTab({ appointment }: { appointment: any }) {
    return (
        <Card className="bg-mongodb-slate/50 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-white">Auto Assignment</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <UserCheck className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Assignment Rules
                    </h3>
                    <p className="text-neutral-400 mb-4">
                        Configure automatic assignment of bookings to team members
                    </p>
                    <Badge variant="info">Coming Soon</Badge>
                </div>
            </CardContent>
        </Card>
    )
}
