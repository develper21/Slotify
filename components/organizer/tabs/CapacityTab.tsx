'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateAppointment } from '@/lib/actions/organizer'
import { toast } from 'sonner'
import { Users, Info } from 'lucide-react'

export default function CapacityTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [maxCapacity, setMaxCapacity] = useState(appointment.max_capacity || 1)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const result = await updateAppointment(appointment.id, { max_capacity: maxCapacity })
            if (!result.success) {
                toast.error(result.message || 'Update failed')
            } else {
                toast.success('Capacity settings updated!')
            }
        } catch (error) {
            toast.error('Failed to update capacity')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl">
            <Card className="bg-mongodb-slate/30 border-neutral-800 shadow-xl overflow-hidden backdrop-blur-sm">
                <CardHeader className="bg-mongodb-black/40 border-b border-neutral-800 p-6 flex flex-row items-center gap-4">
                    <div className="p-3 bg-mongodb-spring/10 rounded-2xl">
                        <Users className="w-6 h-6 text-mongodb-spring" />
                    </div>
                    <div>
                        <CardTitle className="text-white text-xl">Capacity Control</CardTitle>
                        <p className="text-neutral-500 text-sm mt-1">Manage how many people can join a single session.</p>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="flex items-start gap-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                        <Info className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                        <div className="text-sm text-neutral-400 leading-relaxed">
                            <span className="text-yellow-500 font-bold block mb-1 uppercase tracking-widest text-[10px]">Important Note</span>
                            Setting capacity higher than 1 allows multiple customers to book the same time slot simultaneously. This is ideal for webinars, classes, or group sessions.
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Max Participants per Slot"
                            type="number"
                            min="1"
                            max="500"
                            value={maxCapacity}
                            onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 1)}
                            className="bg-mongodb-black border-neutral-700 text-white focus:border-mongodb-spring h-14 text-lg font-bold"
                            labelClassName="text-neutral-400 font-bold uppercase text-[10px] tracking-widest px-1 mb-2"
                        />
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs text-neutral-600">Current setting: {maxCapacity === 1 ? 'Individual Session' : `Group Session (${maxCapacity} max)`}</span>
                            <div className="flex gap-2">
                                {[1, 5, 10, 25].map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setMaxCapacity(val)}
                                        className={`text-[10px] font-bold px-3 py-1 rounded-md border transition-all ${maxCapacity === val ? 'bg-mongodb-spring border-mongodb-spring text-mongodb-black' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-neutral-800">
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            variant="primary"
                            className="rounded-xl px-12 h-14 font-black shadow-lg shadow-mongodb-spring/10"
                        >
                            Update Capacity
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
