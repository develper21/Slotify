import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Settings, Mail, MessageSquare, Zap } from 'lucide-react'

export default async function MiscPage() {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-mongodb-black py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Miscellaneous Settings
                    </h1>
                    <p className="text-neutral-400">
                        Additional configuration options
                    </p>
                </div>

                <div className="space-y-6">
                    <Card className="bg-mongodb-slate/50 border-neutral-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Mail className="w-6 h-6 text-mongodb-spring" />
                                <CardTitle className="text-white">Email Templates</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-400 mb-4">
                                Customize email templates for booking confirmations, reminders, and cancellations
                            </p>
                            <Button variant="secondary" className="bg-neutral-800 text-white hover:bg-neutral-700">
                                Manage Templates
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-mongodb-slate/50 border-neutral-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-mongodb-spring" />
                                <CardTitle className="text-white">SMS Settings</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-400 mb-4">
                                Configure SMS notifications and reminders for your customers
                            </p>
                            <Button variant="secondary" className="bg-neutral-800 text-white hover:bg-neutral-700">
                                Configure SMS
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-mongodb-slate/50 border-neutral-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Zap className="w-6 h-6 text-mongodb-spring" />
                                <CardTitle className="text-white">Integrations</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-400 mb-4">
                                Connect with third-party services like Google Calendar, Zoom, and more
                            </p>
                            <Button variant="secondary" className="bg-neutral-800 text-white hover:bg-neutral-700">
                                Manage Integrations
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-mongodb-slate/50 border-neutral-800">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Settings className="w-6 h-6 text-mongodb-spring" />
                                <CardTitle className="text-white">Advanced Options</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-neutral-400 mb-4">
                                Advanced configuration options for power users
                            </p>
                            <Button variant="secondary" className="bg-neutral-800 text-white hover:bg-neutral-700">
                                View Advanced Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
