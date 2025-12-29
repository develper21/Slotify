'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/actions/notifications'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

export function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        loadNotifications()
    }, [userId])

    async function loadNotifications() {
        const data = await getNotifications(userId)
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.isRead).length)
    }

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const handleMarkAllRead = async () => {
        await markAllAsRead(userId)
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
        toast.success('All marked as read')
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full w-10 h-10">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mongodb-spring opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mongodb-spring border-2 border-mongodb-black"></span>
                    </span>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-80 md:w-96 bg-mongodb-black border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-mongodb-slate/20">
                                <h3 className="font-bold text-white uppercase tracking-widest text-[10px]">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[10px] text-mongodb-spring hover:underline font-bold uppercase tracking-widest">
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Bell className="w-12 h-12 text-neutral-800 mx-auto mb-4 opacity-20" />
                                        <p className="text-neutral-500 text-sm italic">All clear!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-800/50">
                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-4 hover:bg-neutral-900/50 transition-colors relative group ${!n.isRead ? 'bg-mongodb-spring/5' : ''}`}>
                                                <div className="flex gap-4">
                                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-mongodb-spring' : 'bg-transparent'}`} />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-white mb-1">{n.title}</p>
                                                        <p className="text-xs text-neutral-400 leading-relaxed mb-2">{n.message}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] text-neutral-600 font-medium">
                                                                {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                                                            </span>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {!n.isRead && (
                                                                    <button
                                                                        onClick={() => handleMarkAsRead(n.id)}
                                                                        className="p-1 hover:bg-neutral-800 rounded text-neutral-500 hover:text-mongodb-spring"
                                                                        title="Mark as read">
                                                                        <Check className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <Link
                                    href="/dashboard/notifications"
                                    className="block p-3 text-center text-xs font-bold text-neutral-500 hover:text-white bg-neutral-900/30 border-t border-neutral-800"
                                    onClick={() => setIsOpen(false)}>
                                    View full history
                                </Link>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
