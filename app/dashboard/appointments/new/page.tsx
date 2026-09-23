'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ChevronLeft, Info, Calendar, Clock, MapPin, Users, DollarSign, Sparkles, ArrowRight } from 'lucide-react'
import { createAppointment } from '@/lib/actions/organizer'
import { getCurrentUser } from '@/lib/actions/auth'
import { toast } from 'sonner'
import { formatDuration } from '@/lib/utils'

export default function NewAppointmentPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 45,
        locationDetails: 'Google Meet',
        price: 0,
        maxCapacity: 1,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.title.trim()) {
            newErrors.title = 'Session title is required'
        }
        if (formData.duration <= 0) {
            newErrors.duration = 'Valid duration is required'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please complete all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            const user = await getCurrentUser()

            if (!user) {
                toast.error('Session expired. Please log in again.')
                router.push('/login')
                return
            }

            const result = await createAppointment(user.id, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                duration: formData.duration,
                locationDetails: formData.locationDetails,
                price: Number(formData.price || 0),
            })

            if (!result.success) {
                toast.error(result.message || 'Failed to create plan')
            } else {
                toast.success('Appointment created! Now configure availability & questions.')
                router.push(`/dashboard/appointments/${result.appointmentId}/edit`)
            }
        } catch (error) {
            console.error('Error creating appointment:', error)
            toast.error('Failed to create appointment')
        } finally {
            setIsSubmitting(false)
        }
    }

    const durationPresets = [15, 30, 45, 60, 90]
    const locationPresets = ['Google Meet', 'Zoom Meeting', 'Phone Call', 'In-Person Office']

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-4 animate-fade-in">
            {/* Header */}
            <div>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-neutral-400 hover:text-mongodb-spring mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Appointments
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-mongodb-spring/10 border border-mongodb-spring/25 flex items-center justify-center text-mongodb-spring">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-black text-white tracking-tight">
                            Create New <span className="gradient-text">Appointment Slot</span>
                        </h1>
                        <p className="text-neutral-400 text-sm mt-0.5">
                            Define your service details, duration, pricing, and location.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form + Live Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Inputs (7 Cols) */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
                    <Card hover={false} className="bg-[#0C2331] border-white/10 p-6 space-y-6">
                        <div className="border-b border-white/5 pb-4">
                            <h3 className="text-base font-bold text-white">General Information</h3>
                            <p className="text-xs text-neutral-400 mt-0.5">Title and public description shown to clients</p>
                        </div>

                        {/* Title */}
                        <Input
                            label="Session Title *"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g. 1-on-1 Strategy & Architecture Consultation"
                            error={errors.title}
                            required
                        />

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest px-0.5">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Explain the agenda, what the client should prepare, and expected deliverables..."
                                className="w-full px-4 py-3 bg-[#001E2B] rounded-lg border border-[#1E3C4E] text-white placeholder:text-neutral-500 text-sm transition-all duration-200 outline-none focus:border-mongodb-spring focus:ring-2 focus:ring-mongodb-spring/20 resize-none"
                            />
                        </div>

                        {/* Duration Presets */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest px-0.5">
                                Duration (Minutes) *
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {durationPresets.map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => handleChange('duration', d)}
                                        className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                                            formData.duration === d
                                                ? 'bg-mongodb-spring text-mongodb-black border-mongodb-spring shadow-[0_2px_10px_rgba(0,237,100,0.3)]'
                                                : 'bg-[#001E2B] text-neutral-300 border-white/10 hover:border-white/20'
                                        }`}>
                                        {d} mins
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pricing & Capacity Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Session Price ($ USD)"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                                hint="Set $0 for free consultations"
                            />

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest px-0.5">
                                    Attendee Capacity
                                </label>
                                <select
                                    value={formData.maxCapacity}
                                    onChange={(e) => handleChange('maxCapacity', parseInt(e.target.value))}
                                    className="w-full px-4 py-3 bg-[#001E2B] rounded-lg border border-[#1E3C4E] text-white text-sm outline-none focus:border-mongodb-spring focus:ring-2 focus:ring-mongodb-spring/20">
                                    <option value={1}>1-on-1 (Private Session)</option>
                                    <option value={2}>2 Attendees (Dual)</option>
                                    <option value={5}>Up to 5 Attendees</option>
                                    <option value={10}>Up to 10 Attendees (Group)</option>
                                </select>
                            </div>
                        </div>

                        {/* Location Selection */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest px-0.5">
                                Meeting Location / Venue
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {locationPresets.map((loc) => (
                                    <button
                                        key={loc}
                                        type="button"
                                        onClick={() => handleChange('locationDetails', loc)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                            formData.locationDetails === loc
                                                ? 'bg-mongodb-mint/20 text-mongodb-mint border-mongodb-mint/50'
                                                : 'bg-[#001E2B] text-neutral-400 border-white/5 hover:text-white'
                                        }`}>
                                        {loc}
                                    </button>
                                ))}
                            </div>
                            <Input
                                value={formData.locationDetails}
                                onChange={(e) => handleChange('locationDetails', e.target.value)}
                                placeholder="Custom address or link instructions..."
                            />
                        </div>
                    </Card>

                    {/* Submit Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-neutral-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isSubmitting}
                            className="font-bold shadow-mongodb px-8">
                            Save & Proceed to Setup
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                    </div>
                </form>

                {/* Live Card Preview (5 Cols) */}
                <div className="lg:col-span-5 sticky top-24 space-y-4">
                    <div className="flex items-center gap-2 px-1 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                        <span className="w-2 h-2 rounded-full bg-mongodb-spring animate-pulse" />
                        Live Marketplace Preview
                    </div>

                    <Card hover={false} className="bg-[#0C2331] border-mongodb-spring/30 shadow-[0_0_30px_rgba(0,237,100,0.1)] p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <Badge variant={formData.price > 0 ? 'primary' : 'success'} dot>
                                {formData.price > 0 ? `$${formData.price}` : 'Free Slot'}
                            </Badge>
                            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-mongodb-spring" />
                                {formData.duration} mins
                            </span>
                        </div>

                        <h3 className="text-xl font-display font-bold text-white mb-2 line-clamp-2">
                            {formData.title || 'Your Session Title Appears Here'}
                        </h3>
                        <p className="text-sm text-neutral-400 mb-6 line-clamp-3 leading-relaxed">
                            {formData.description || 'Describe your consultation here. Clients will see this overview when selecting a time slot.'}
                        </p>

                        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#001E2B] border border-white/5 text-xs text-neutral-300 mb-6">
                            <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-3.5 h-3.5 text-mongodb-spring shrink-0" />
                                <span className="truncate">{formData.locationDetails || 'Online Meeting'}</span>
                            </div>
                            <div className="flex items-center gap-2 truncate">
                                <Users className="w-3.5 h-3.5 text-mongodb-mint shrink-0" />
                                <span>{formData.maxCapacity === 1 ? '1-on-1' : `Max ${formData.maxCapacity} seats`}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-neutral-500 font-mono">Status: Ready to publish</span>
                            <Button size="sm" variant="primary" className="font-bold pointer-events-none opacity-90">
                                Book Slot →
                            </Button>
                        </div>
                    </Card>

                    <div className="p-4 rounded-xl bg-[#0C2331]/40 border border-white/5 text-xs text-neutral-400 flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-mongodb-spring shrink-0 mt-0.5" />
                        <p>
                            After saving this basic configuration, you can set your weekly operating days & hours, and build custom form questions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
