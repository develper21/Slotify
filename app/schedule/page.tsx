import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, Plus } from 'lucide-react'

export default async function SchedulePage() {
    const supabase = createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Schedule Management
                    </h1>
                    <p className="text-neutral-600">
                        Manage your working hours and availability
                    </p>
                </div>

                {/* Weekly Schedule */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Weekly Schedule</CardTitle>
                            <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Time Slot
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <div key={day} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                                    <div className="w-32">
                                        <p className="font-medium text-neutral-900">{day}</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-neutral-400" />
                                            <span className="text-sm text-neutral-600">9:00 AM - 5:00 PM</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Holidays/Breaks */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Holidays & Breaks</CardTitle>
                            <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Holiday
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-neutral-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                            <p>No holidays or breaks scheduled</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
