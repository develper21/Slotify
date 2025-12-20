import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, HelpCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function QuestionsPage() {
    const supabase = createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Question Templates
                    </h1>
                    <p className="text-neutral-400">
                        Create reusable questions for your appointments
                    </p>
                </div>
                <Button variant="primary">
                    <Plus className="w-5 h-5 mr-2" />
                    New Question
                </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                <Card className="hover:border-mongodb-spring/50 transition-colors bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    What is your preferred contact method?
                                </h3>
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge variant="info">Multiple Choice</Badge>
                                    <Badge variant="warning">Required</Badge>
                                </div>
                                <p className="text-sm text-neutral-400">
                                    Options: Email, Phone, SMS
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">Delete</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-mongodb-spring/50 transition-colors bg-mongodb-slate/50 border-neutral-800">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Any special requirements or notes?
                                </h3>
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge variant="info">Text</Badge>
                                    <Badge variant="default">Optional</Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">Delete</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
