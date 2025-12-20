'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function QuestionsTab({ appointment }: { appointment: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [questions, setQuestions] = useState([
        { id: '1', label: 'Name', type: 'text', required: true, system: true },
        { id: '2', label: 'Email', type: 'email', required: true, system: true },
        { id: '3', label: 'Phone Number', type: 'phone', required: true, system: true },
        { id: '4', label: 'Please describe your reason for visit', type: 'textarea', required: false, system: false },
    ])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('Questions updated successfully')
        } catch (error) {
            toast.error('Failed to update questions')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <Card className="bg-mongodb-slate/50 border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Booking Questions</CardTitle>
                        <Button type="button" variant="secondary" className="bg-neutral-800 text-white hover:bg-neutral-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {questions.map((question, index) => (
                            <div key={question.id} className="flex items-center gap-4 p-4 bg-mongodb-black rounded-lg border border-neutral-700 group">
                                <GripVertical className="w-5 h-5 text-neutral-600 cursor-move hover:text-white" />

                                <div className="flex-1">
                                    <p className="font-medium text-white flex items-center gap-2">
                                        {question.label}
                                        {question.required && <span className="text-red-500 text-xs">*</span>}
                                    </p>
                                    <p className="text-sm text-neutral-500 capitalize">{question.type}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm text-neutral-400 mr-4">
                                        <input
                                            type="checkbox"
                                            checked={question.required}
                                            disabled={question.system}
                                            onChange={() => {
                                                const newQuestions = [...questions]
                                                newQuestions[index].required = !newQuestions[index].required
                                                setQuestions(newQuestions)
                                            }}
                                            className="rounded border-neutral-600 bg-neutral-800 text-mongodb-spring focus:ring-mongodb-spring"
                                        />
                                        Required
                                    </label>

                                    {!question.system && (
                                        <Button type="button" variant="ghost" size="sm" className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10">
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
