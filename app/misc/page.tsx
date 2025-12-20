import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Settings, Mail, MessageSquare, Zap } from 'lucide-react'

export default async function MiscPage() {
    const supabase = createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                        Miscellaneous Settings
                    </h1>
                    <p className="text-neutral-600">
                        Additional configuration options
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Email Templates */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Mail className="w-6 h-6 text-primary" />
                                <CardTitle>Email Templates</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-600 mb-4">
                                Customize email templates for booking confirmations, reminders, and cancellations
                            </p>
                            <Button variant="secondary">
                                Manage Templates
                            </Button>
                        </CardContent>
                    </Card>

                    {/* SMS Settings */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                <CardTitle>SMS Settings</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-600 mb-4">
                                Configure SMS notifications and reminders for your customers
                            </p>
                            <Button variant="secondary">
                                Configure SMS
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Integrations */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Zap className="w-6 h-6 text-primary" />
                                <CardTitle>Integrations</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-600 mb-4">
                                Connect with third-party services like Google Calendar, Zoom, and more
                            </p>
                            <Button variant="secondary">
                                Manage Integrations
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Advanced Options */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Settings className="w-6 h-6 text-primary" />
                                <CardTitle>Advanced Options</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-600 mb-4">
                                Advanced configuration options for power users
                            </p>
                            <Button variant="secondary">
                                View Advanced Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
