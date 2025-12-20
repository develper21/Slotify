'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Clock, Users, Globe, Lock, MoreVertical, Edit2, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'

export default function AppointmentCard({ appointment }: { appointment: any }) {
    const primaryImage = appointment.image_url

    return (
        <Card hover className="group flex flex-col h-full bg-mongodb-slate/40 border-neutral-700/30 overflow-hidden">
            {/* Header/Image Area */}
            <div className="relative h-40 overflow-hidden">
                {primaryImage ? (
                    <img
                        src={primaryImage}
                        alt={appointment.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-mongodb-black/40 flex items-center justify-center">
                        <Clock className="w-12 h-12 text-neutral-800" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-mongodb-black/90 via-mongodb-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={appointment.is_active ? 'primary' : 'default'} className="backdrop-blur-md bg-mongodb-black/40">
                        {appointment.is_active ? (
                            <div className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                <span>Active</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                <span>Inactive</span>
                            </div>
                        )}
                    </Badge>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-mongodb-black/60 hover:bg-mongodb-black">
                        <MoreVertical className="w-4 h-4 text-white" />
                    </Button>
                </div>
            </div>

            <CardHeader className="pt-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight group-hover:text-mongodb-spring transition-colors">
                        {appointment.title}
                    </CardTitle>
                </div>
                <CardDescription className="line-clamp-1 text-xs">
                    {appointment.description || 'No description provided'}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-mongodb-black/30 rounded-mongodb p-2 flex flex-col items-center justify-center text-center border border-neutral-700/20">
                        <Clock className="w-3.5 h-3.5 text-mongodb-spring mb-1" />
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">Duration</span>
                        <span className="text-xs text-white font-medium">{formatDuration(appointment.duration)}</span>
                    </div>
                    <div className="bg-mongodb-black/30 rounded-mongodb p-2 flex flex-col items-center justify-center text-center border border-neutral-700/20">
                        <Users className="w-3.5 h-3.5 text-blue-400 mb-1" />
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">Capacity</span>
                        <span className="text-xs text-white font-medium">{appointment.max_capacity || '1'}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0 border-t border-neutral-700/20 bg-mongodb-black/20 p-3">
                <div className="grid grid-cols-2 gap-2 w-full">
                    <Link href={`/appointments/${appointment.id}/edit`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full text-xs h-9 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">
                            <Edit2 className="w-3 h-3 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Link href={`/book/${appointment.id}`} className="w-full">
                        <Button variant="secondary" size="sm" className="w-full text-xs h-9 border-none">
                            <Eye className="w-3 h-3 mr-2" />
                            View
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
