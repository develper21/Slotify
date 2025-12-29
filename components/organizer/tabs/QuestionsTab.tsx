'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, GripVertical, Trash2, HelpCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateAppointment } from '@/lib/actions/organizer'

export default function QuestionsTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [questions, setQuestions] = useState(() => {
        const systemQuestions = [
            { id: 'sys-1', label: 'Full Name', type: 'text', required: true, system: true },
            { id: 'sys-2', label: 'Email Address', type: 'email', required: true, system: true },
        ]

        const existing = appointment.questions || []
        return [...systemQuestions, ...existing]
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const customQuestions = questions.filter(q => !q.system)

            const result = await updateAppointment(appointment.id, { questions: customQuestions })
            if (!result.success) {
                toast.error(result.message || 'Saving failed')
            } else {
                toast.success('Booking form updated!')
            }
        } catch (error) {
            toast.error('Unexpected error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                id: `q-${Date.now()}`,
                label: 'Untitled Question',
                type: 'text',
                required: false,
                system: false
            }
        ])
    }

    const updateQuestion = (id: string, field: string, value: any) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q))
    }

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id || q.system))
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
            <Card className="bg-mongodb-slate/30 border-neutral-800 shadow-2xl backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-mongodb-black/40 border-b border-neutral-800 p-6 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-white text-xl flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-mongodb-spring" />
                            Booking Form Designer
                        </CardTitle>
                        <p className="text-neutral-500 text-sm mt-1">Add custom fields you want customers to fill when booking.</p>
                    </div>
                    <Button
                        type="button"
                        onClick={addQuestion}
                        variant="primary"
                        className="rounded-xl h-11 px-6 font-bold shadow-mongodb-spring/10 shadow-lg text-mongodb-black">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                    </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {questions.map((question, index) => (
                        <div key={question.id} className={`group flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl border transition-all ${question.system ? 'bg-mongodb-black/20 border-neutral-800/50 opacity-80' : 'bg-mongodb-black/60 border-neutral-700 hover:border-mongodb-spring/40'}`}>
                            <div className="flex items-center gap-3 flex-1">
                                {!question.system && <GripVertical className="w-5 h-5 text-neutral-700 group-hover:text-neutral-500 cursor-grab" />}

                                <div className="flex-1">
                                    {question.system ? (
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-widest text-neutral-600 mb-1">Required Core Field</span>
                                            <span className="text-white font-bold">{question.label}</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-mongodb-spring px-1">Custom Field</span>
                                            <input
                                                type="text"
                                                value={question.label}
                                                onChange={(e) => updateQuestion(question.id, 'label', e.target.value)}
                                                className="w-full bg-transparent border-none text-white font-bold text-lg focus:ring-0 p-0 placeholder:text-neutral-600"
                                                placeholder="Enter question here..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-mongodb-black/40 p-2 rounded-xl border border-neutral-800">
                                {!question.system && (
                                    <select
                                        value={question.type}
                                        onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                                        className="bg-transparent text-neutral-400 text-xs font-bold uppercase tracking-wider outline-none border-none py-1 px-2 focus:text-white">
                                        <option value="text">Short Answer</option>
                                        <option value="textarea">Paragraph</option>
                                        <option value="phone">Phone Number</option>
                                        <option value="checkbox">Multi-Check</option>
                                    </select>
                                )}

                                {question.system && (
                                    <span className="text-neutral-600 text-xs font-bold uppercase tracking-widest px-4">Standard</span>
                                )}

                                <div className="w-px h-4 bg-neutral-800" />

                                <label className="flex items-center gap-2 cursor-pointer group/check">
                                    <input
                                        type="checkbox"
                                        checked={question.required}
                                        disabled={question.system}
                                        onChange={() => updateQuestion(question.id, 'required', !question.required)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${question.required ? 'bg-mongodb-spring border-mongodb-spring' : 'border-neutral-600 group-hover/check:border-neutral-400'}`}>
                                        {question.required && <CheckCircle2 className="w-3 h-3 text-mongodb-black" />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${question.required ? 'text-white' : 'text-neutral-600'}`}>Mandatory</span>
                                </label>

                                {!question.system && (
                                    <>
                                        <div className="w-px h-4 bg-neutral-800" />
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(question.id)}
                                            className="text-neutral-600 hover:text-red-500 transition-colors px-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end pt-6">
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            variant="primary"
                            className="rounded-xl px-12 h-14 shadow-lg shadow-mongodb-spring/10 font-black">
                            Save Booking Form
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
