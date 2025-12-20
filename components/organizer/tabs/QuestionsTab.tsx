'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { upsertBookingQuestions } from '@/lib/actions/organizer'

export default function QuestionsTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [questions, setQuestions] = useState(() => {
        // Initialize with default system questions that are always there (visually)
        const systemQuestions = [
            { id: '1', label: 'Name', type: 'text', required: true, system: true },
            { id: '2', label: 'Email', type: 'email', required: true, system: true },
            { id: '3', label: 'Phone Number', type: 'phone', required: true, system: true },
        ]

        // Map existing booking_questions
        const customQuestions = (appointment.booking_questions || []).map((q: any) => ({
            id: q.id,
            label: q.question_text,
            type: q.question_type === 'single_line' ? 'text' :
                q.question_type === 'multi_line' ? 'textarea' :
                    q.question_type, // 'phone', 'radio', 'checkbox'
            required: q.is_mandatory,
            system: false,
            options: q.options // preserve options if any
        }))

        // Sort by order_index if available, or just push to end
        // For now, system first, then custom
        return [...systemQuestions, ...customQuestions]
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Filter out system questions, they aren't stored in booking_questions
            const questionsToSave = questions.filter(q => !q.system).map(q => ({
                question_text: q.label,
                question_type: q.type === 'text' ? 'single_line' :
                    q.type === 'textarea' ? 'multi_line' :
                        q.type,
                is_mandatory: q.required,
                options: q.options || null
            }))

            const result = await upsertBookingQuestions(appointment.id, questionsToSave)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Questions updated successfully')
            }
        } catch (error) {
            toast.error('Failed to update questions')
        } finally {
            setIsSubmitting(false)
        }
    }

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                id: `temp-${Date.now()}`,
                label: 'New Question',
                type: 'text',
                required: false,
                system: false
            }
        ])
    }

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...questions]
        newQuestions[index] = { ...newQuestions[index], [field]: value }
        setQuestions(newQuestions)
    }

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions]
        if (newQuestions[index].system) return
        newQuestions.splice(index, 1)
        setQuestions(newQuestions)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Booking Questions</CardTitle>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={addQuestion}
                            className="bg-neutral-800 text-white hover:bg-neutral-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {questions.map((question, index) => (
                            <div key={question.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-mongodb-black rounded-lg border border-neutral-700 group">
                                <GripVertical className="hidden sm:block w-5 h-5 text-neutral-600 cursor-move hover:text-white" />

                                <div className="flex-1 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                                    {/* Question Label Input */}
                                    <div className="flex-1">
                                        {question.system ? (
                                            <p className="font-medium text-white flex items-center gap-2">
                                                {question.label}
                                                <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">System</span>
                                            </p>
                                        ) : (
                                            <input
                                                type="text"
                                                value={question.label}
                                                onChange={(e) => updateQuestion(index, 'label', e.target.value)}
                                                className="w-full bg-transparent border-b border-neutral-700 focus:border-mongodb-spring outline-none text-white py-1 transition-colors"
                                                placeholder="Question Text"
                                            />
                                        )}
                                    </div>

                                    {/* Type Select */}
                                    <div className="w-full sm:w-32">
                                        {question.system ? (
                                            <p className="text-sm text-neutral-500 capitalize">{question.type}</p>
                                        ) : (
                                            <select
                                                value={question.type}
                                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                                className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:border-mongodb-spring outline-none"
                                            >
                                                <option value="text">Short Text</option>
                                                <option value="textarea">Long Text</option>
                                                <option value="phone">Phone</option>
                                                <option value="checkbox">Checkbox</option>
                                                <option value="radio">Radio</option>
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                    <label className="flex items-center gap-2 text-sm text-neutral-400">
                                        <input
                                            type="checkbox"
                                            checked={question.required}
                                            disabled={question.system}
                                            onChange={() => updateQuestion(index, 'required', !question.required)}
                                            className="rounded border-neutral-600 bg-neutral-800 text-mongodb-spring focus:ring-mongodb-spring"
                                        />
                                        Required
                                    </label>

                                    {!question.system && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeQuestion(index)}
                                            className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" isLoading={isSubmitting} className="bg-mongodb-spring text-mongodb-black hover:bg-mongodb-spring/90">
                        Save Questions
                    </Button>
                </div>
            </div>
        </form>
    )
}
