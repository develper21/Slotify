import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getNotifications, markAllAsRead } from '@/lib/actions/notifications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Bell, CheckCheck, Clock, Info, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    const notifications = await getNotifications(session.user.id)

    async function handleMarkAllRead() {
        'use server'
        const currentSession = await getSession()
        if (currentSession) {
            await markAllAsRead(currentSession.user.id)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-mongodb-spring mb-3 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                        Notifications <span className="gradient-text">History</span>
                    </h1>
                    <p className="text-neutral-400 mt-1">
                        Recent activity, booking confirmations, and system alerts.
                    </p>
                </div>

                {notifications.length > 0 && (
                    <form action={handleMarkAllRead}>
                        <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="border-neutral-700 hover:bg-neutral-800 text-neutral-300">
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark all as read
                        </Button>
                    </form>
                )}
            </div>

            {notifications.length === 0 ? (
                <Card className="bg-mongodb-slate/50 border-neutral-800 border-dashed">
                    <CardContent className="py-20 text-center">
                        <Bell className="w-16 h-16 mx-auto text-neutral-700 mb-4 opacity-40" />
                        <h3 className="text-xl font-display font-bold text-white mb-2">No notifications yet</h3>
                        <p className="text-neutral-500 max-w-md mx-auto">
                            When clients book your appointments or when updates occur, they will appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif: any) => (
                        <Card
                            key={notif.id}
                            className={`bg-mongodb-slate/40 border-neutral-800 transition-all ${
                                !notif.isRead ? 'border-mongodb-spring/30 bg-mongodb-spring/5' : ''
                            }`}>
                            <CardContent className="p-5 flex items-start gap-4">
                                <div
                                    className={`p-2.5 rounded-xl ${
                                        !notif.isRead
                                            ? 'bg-mongodb-spring/10 text-mongodb-spring'
                                            : 'bg-neutral-800 text-neutral-400'
                                    }`}>
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className="text-base font-bold text-white truncate">
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-neutral-500 whitespace-nowrap flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(notif.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-400 leading-relaxed">
                                        {notif.message}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
