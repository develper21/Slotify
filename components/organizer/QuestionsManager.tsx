'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Plus, HelpCircle, Trash2, Edit, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { updateAppointment } from '@/lib/actions/organizer'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AppointmentWithQuestions {
    id: string
    title: string
    duration: number | null
    questions: any
}

interface QuestionDraft {
    label: string
    type: string
    required: boolean
}

const emptyDraft: QuestionDraft = { label: '', type: 'text', required: false }

export function QuestionsManager({ appointments }: { appointments: AppointmentWithQuestions[] }) {
    const router = useRouter()
    const [selectedAptId, setSelectedAptId] = useState<string>(appointments[0]?.id || '')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const { confirm, confirmDialog } = useConfirmDialog()

    // Question form state (add + edit dono ke liye)
    const [draft, setDraft] = useState<QuestionDraft>(emptyDraft)

    const selectedAppointment = appointments.find(a => a.id === selectedAptId)
    const questionsList = Array.isArray(selectedAppointment?.questions) ? selectedAppointment.questions : []

    const openAddModal = () => {
        setEditingQuestionId(null)
        setDraft(emptyDraft)
        setIsModalOpen(true)
    }

    const openEditModal = (q: any) => {
        setEditingQuestionId(q.id)
        setDraft({
            label: q.label || '',
            type: q.type || 'text',
            required: !!q.required,
        })
        setIsModalOpen(true)
    }

    const handleSaveQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!draft.label.trim() || !selectedAppointment) return

        setSaving(true)
        try {
            let updatedQuestions
            if (editingQuestionId) {
                // Edit: existing question ko in-place update karo
                updatedQuestions = questionsList.map((q: any) =>
                    q.id === editingQuestionId
                        ? { ...q, label: draft.label.trim(), type: draft.type, required: draft.required }
                        : q
                )
            } else {
                const newQ = {
                    id: `q-${Date.now()}`,
                    label: draft.label.trim(),
                    type: draft.type,
                    required: draft.required,
                    system: false
                }
                updatedQuestions = [...questionsList, newQ]
            }

            const res = await updateAppointment(selectedAppointment.id, { questions: updatedQuestions })

            if (res.success) {
                toast.success(editingQuestionId ? 'Question updated!' : 'Question added to booking form!')
                setIsModalOpen(false)
                setEditingQuestionId(null)
                setDraft(emptyDraft)
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to save question')
            }
        } catch (err) {
            toast.error('Unexpected error')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if (!selectedAppointment) return

        const confirmed = await confirm({
            title: 'Remove Question',
            description: 'Are you sure you want to remove this question from the booking form?',
            confirmLabel: 'Remove',
        })
        if (!confirmed) return

        setSaving(true)
        try {
            const updatedQuestions = questionsList.filter((q: any) => q.id !== questionId)
            const res = await updateAppointment(selectedAppointment.id, { questions: updatedQuestions })

            if (res.success) {
                toast.success('Question removed')
                router.refresh()
            } else {
                toast.error(res.message || 'Failed to remove question')
            }
        } catch (err) {
            toast.error('Unexpected error')
        } finally {
            setSaving(false)
        }
    }

    if (!appointments || appointments.length === 0) {
        return (
            <Card className="bg-mongodb-slate/30 border-neutral-800 text-center py-16">
                <CardContent className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-mongodb-spring/10 flex items-center justify-center mx-auto text-mongodb-spring">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No Services Found</h3>
                    <p className="text-sm text-neutral-400 max-w-md mx-auto">
                        Create your first appointment service before configuring custom intake questions.
                    </p>
                    <Link href="/dashboard/appointments/new">
                        <Button variant="primary" className="rounded-xl font-bold">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Appointment
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Service selector bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-mongodb-slate/40 p-4 rounded-2xl border border-neutral-800 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Service:</span>
                    <select
                        value={selectedAptId}
                        onChange={(e) => setSelectedAptId(e.target.value)}
                        className="bg-mongodb-black/80 border border-neutral-700 text-white text-sm font-semibold rounded-xl px-4 py-2 focus:outline-none focus:border-mongodb-spring transition-colors cursor-pointer"
                    >
                        {appointments.map(apt => (
                            <option key={apt.id} value={apt.id}>
                                {apt.title} ({apt.duration || 60}m)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        onClick={openAddModal}
                        className="rounded-xl font-bold h-10 px-4 shadow-lg shadow-mongodb-spring/10 text-mongodb-black"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </Button>
                    {selectedAppointment && (
                        <Link href={`/dashboard/appointments/${selectedAppointment.id}/edit`}>
                            <Button variant="ghost" className="rounded-xl text-neutral-400 hover:text-white h-10 px-3">
                                <ExternalLink className="w-4 h-4 mr-1.5" />
                                Edit in Designer
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Core default fields */}
            <div className="space-y-4">
                <div className="text-xs font-black uppercase tracking-widest text-neutral-500 px-1">
                    System Core Fields (Auto-included)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-mongodb-black/40 border-neutral-800/80">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-mongodb-spring">Required</span>
                                <h4 className="text-sm font-bold text-white mt-0.5">Full Name</h4>
                                <p className="text-xs text-neutral-500">Captured automatically during reservation</p>
                            </div>
                            <Badge variant="default">System Text</Badge>
                        </CardContent>
                    </Card>

                    <Card className="bg-mongodb-black/40 border-neutral-800/80">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-mongodb-spring">Required</span>
                                <h4 className="text-sm font-bold text-white mt-0.5">Email Address</h4>
                                <p className="text-xs text-neutral-500">Destination for calendar invites and reminders</p>
                            </div>
                            <Badge variant="default">System Email</Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Custom Questions List */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
                        Custom Intake Questions ({questionsList.length})
                    </span>
                </div>

                {questionsList.length === 0 ? (
                    <Card className="bg-mongodb-slate/20 border-dashed border-neutral-800 p-8 text-center rounded-2xl">
                        <p className="text-sm text-neutral-400">No custom questions added to this service yet.</p>
                        <p className="text-xs text-neutral-500 mt-1">Click "Add Question" above to ask attendees for phone numbers, project notes, or goals.</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {questionsList.map((q: any, idx: number) => (
                            <Card key={q.id || idx} className="bg-mongodb-slate/30 border-neutral-800 hover:border-neutral-700 transition-colors">
                                <CardContent className="p-5 flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={q.required ? 'warning' : 'default'}>
                                                {q.required ? 'Required' : 'Optional'}
                                            </Badge>
                                            <span className="text-xs text-neutral-500 font-mono capitalize">{q.type || 'text'}</span>
                                        </div>
                                        <h4 className="text-base font-bold text-white">{q.label}</h4>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Edit button — pehle sirf import tha, button missing tha */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={saving}
                                            onClick={() => openEditModal(q)}
                                            className="text-neutral-400 hover:text-mongodb-spring hover:bg-mongodb-spring/10 rounded-xl"
                                            title="Edit question"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={saving}
                                            onClick={() => handleDeleteQuestion(q.id)}
                                            className="text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                                            title="Remove question"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add / Edit Question Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingQuestionId ? 'Edit Intake Question' : 'Add Custom Intake Question'}
                className="max-w-md"
            >
                <form onSubmit={handleSaveQuestion} className="space-y-4 pt-2">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            Question Label / Prompt
                        </label>
                        <Input
                            placeholder="e.g. What is your primary objective for this call?"
                            value={draft.label}
                            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                            required
                            className="bg-mongodb-black border-neutral-700 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                            Field Type
                        </label>
                        <select
                            value={draft.type}
                            onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                            className="w-full bg-mongodb-black border border-neutral-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-mongodb-spring"
                        >
                            <option value="text">Single Line Text</option>
                            <option value="textarea">Multi-line Paragraph</option>
                            <option value="phone">Phone Number</option>
                            <option value="checkbox">Yes/No Checkbox</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="isRequired"
                            checked={draft.required}
                            onChange={(e) => setDraft({ ...draft, required: e.target.checked })}
                            className="w-4 h-4 rounded bg-mongodb-black border-neutral-700 text-mongodb-spring focus:ring-mongodb-spring"
                        />
                        <label htmlFor="isRequired" className="text-sm font-medium text-neutral-300 cursor-pointer">
                            Make this field required to book
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={saving}
                            className="rounded-xl font-bold shadow-lg shadow-mongodb-spring/10 text-mongodb-black"
                        >
                            {editingQuestionId ? 'Update Field' : 'Save Field'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {confirmDialog}
        </div>
    )
}
