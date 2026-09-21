'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users } from 'lucide-react'

export default function UsersTab({ appointment }: { appointment: any }) {
    return (
        <Card className="bg-mongodb-slate/50 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-white">Assigned Users</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-neutral-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        User Assignment
                    </h3>
                    <p className="text-neutral-400 mb-4">
                        Assign team members to handle this appointment type
                    </p>
                    <Badge variant="info">Coming Soon</Badge>
                </div>
            </CardContent>
        </Card>
    )
}
