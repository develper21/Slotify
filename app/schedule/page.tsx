import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SchedulePage() {
    const supabase = createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-mongodb-black py-12">
            <div className="container mx-auto px-4 max-w-6xl animate-in fade-in duration-500">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Schedule Management
                    </h1>
                    <p className="text-neutral-400">
                        Manage your working hours and availability
                    </p>
                </div>

                {/* Weekly Schedule */}
                <Card className="mb-6 bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">Weekly Schedule</CardTitle>
                            <Button size="sm" variant="primary">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Time Slot
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <div key={day} className="flex items-center gap-4 p-4 bg-mongodb-black border border-neutral-800 rounded-lg group hover:border-mongodb-spring/50 transition-colors">
                                    <div className="w-32">
                                        <p className="font-medium text-white">{day}</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-mongodb-spring" />
                                            <span className="text-sm text-neutral-300">9:00 AM - 5:00 PM</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">
                                        Edit
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Holidays/Breaks */}
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">Holidays & Breaks</CardTitle>
                            <Button size="sm" variant="secondary" className="bg-neutral-800 text-white hover:bg-neutral-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Holiday
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-neutral-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
                            <p className="text-neutral-400">No holidays or breaks scheduled</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
