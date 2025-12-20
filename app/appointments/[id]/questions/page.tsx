'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ChevronLeft, Plus, Edit, Trash2, GripVertical, HelpCircle } from 'lucide-react'
import { createBookingQuestion, updateBookingQuestion, deleteBookingQuestion } from '@/lib/actions/organizer'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Question {
    id: string
    question_text: string
    question_type: 'single_line' | 'multi_line' | 'phone' | 'radio' | 'checkbox'
    options: string[] | null
    is_mandatory: boolean
    order_index: number
}

const QUESTION_TYPES = [
    { value: 'single_line', label: 'Single Line Text', icon: '📝' },
    { value: 'multi_line', label: 'Multi Line Text', icon: '📄' },
    { value: 'phone', label: 'Phone Number', icon: '📞' },
    { value: 'radio', label: 'Radio Buttons', icon: '🔘' },
    { value: 'checkbox', label: 'Checkboxes', icon: '☑️' },
]

export default function QuestionsPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [questions, setQuestions] = useState<Question[]>([])
    const [appointment, setAppointment] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
    const [formData, setFormData] = useState({
        question_text: '',
        question_type: 'single_line' as Question['question_type'],
        options: [''],
        is_mandatory: false,
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('appointments')
                .select(`
          *,
          booking_questions (*)
        `)
                .eq('id', params.id)
                .single()

            if (error) throw error

            setAppointment(data)
            setQuestions(data.booking_questions?.sort((a: any, b: any) => a.order_index - b.order_index) || [])
        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load questions')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenModal = (question?: Question) => {
        if (question) {
            setEditingQuestion(question)
            setFormData({
                question_text: question.question_text,
                question_type: question.question_type,
                options: question.options || [''],
                is_mandatory: question.is_mandatory,
            })
        } else {
            setEditingQuestion(null)
            setFormData({
                question_text: '',
                question_type: 'single_line',
                options: [''],
                is_mandatory: false,
            })
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingQuestion(null)
    }

    const handleAddOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, ''],
        }))
    }

    const handleRemoveOption = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index),
        }))
    }

    const handleOptionChange = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => (i === index ? value : opt)),
        }))
    }

    const handleSubmit = async () => {
        if (!formData.question_text.trim()) {
            toast.error('Question text is required')
            return
        }

        if (['radio', 'checkbox'].includes(formData.question_type)) {
            const validOptions = formData.options.filter(opt => opt.trim())
            if (validOptions.length < 2) {
                toast.error('Please provide at least 2 options')
                return
            }
        }

        try {
            const questionData = {
                question_text: formData.question_text,
                question_type: formData.question_type,
                options: ['radio', 'checkbox'].includes(formData.question_type)
                    ? formData.options.filter(opt => opt.trim())
                    : null,
                is_mandatory: formData.is_mandatory,
                order_index: editingQuestion ? editingQuestion.order_index : questions.length,
            }

            if (editingQuestion) {
                const result = await updateBookingQuestion(editingQuestion.id, questionData)
                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success('Question updated!')
                    loadData()
                    handleCloseModal()
                }
            } else {
                const result = await createBookingQuestion(params.id, questionData)
                if (result.error) {
                    toast.error(result.error)
                } else {
                    toast.success('Question added!')
                    loadData()
                    handleCloseModal()
                }
            }
        } catch (error) {
            toast.error('Failed to save question')
        }
    }

    const handleDelete = async (questionId: string) => {
        if (!confirm('Are you sure you want to delete this question?')) {
            return
        }

        try {
            const result = await deleteBookingQuestion(questionId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Question deleted!')
                loadData()
            }
        } catch (error) {
            toast.error('Failed to delete question')
        }
    }

    const getQuestionTypeLabel = (type: string) => {
        return QUESTION_TYPES.find(t => t.value === type)?.label || type
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-neutral-200 rounded w-1/3" />
                        <div className="h-64 bg-neutral-200 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push(`/appointments/${params.id}/edit`)}
                        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Edit
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                                Booking Questions
                            </h1>
                            <p className="text-neutral-600">{appointment?.title}</p>
                        </div>
                        <Button onClick={() => handleOpenModal()}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Question
                        </Button>
                    </div>
                </div>

                {/* Info Card */}
                <Card className="mb-6 bg-blue-50 border-blue-200">
                    <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-900">Collect Custom Information</p>
                                <p className="text-sm text-blue-800 mt-1">
                                    Add questions to collect specific information from customers during booking. Questions appear in the order listed below.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions List */}
                {questions.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <HelpCircle className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
                                No Questions Yet
                            </h3>
                            <p className="text-neutral-500 mb-6">
                                Add custom questions to collect information from customers
                            </p>
                            <Button onClick={() => handleOpenModal()}>
                                <Plus className="w-5 h-5 mr-2" />
                                Add Your First Question
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <Card key={question.id} hover>
                                <CardContent className="py-4">
                                    <div className="flex items-start gap-4">
                                        <GripVertical className="w-5 h-5 text-neutral-400 mt-1 cursor-move" />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-neutral-900 mb-1">
                                                        {question.question_text}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="info">
                                                            {getQuestionTypeLabel(question.question_type)}
                                                        </Badge>
                                                        {question.is_mandatory && (
                                                            <Badge variant="warning">Required</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenModal(question)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(question.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {question.options && question.options.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-neutral-500 mb-1">Options:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {question.options.map((option, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-neutral-100 text-neutral-700 text-sm rounded"
                                                            >
                                                                {option}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add/Edit Question Modal */}
                <Modal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    title={editingQuestion ? 'Edit Question' : 'Add Question'}
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Question Text */}
                        <Input
                            label="Question Text"
                            value={formData.question_text}
                            onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
                            placeholder="e.g., What is your preferred time?"
                            required
                        />

                        {/* Question Type */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Question Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {QUESTION_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, question_type: type.value as any }))}
                                        className={cn(
                                            'p-4 rounded-lg border-2 text-left transition-all',
                                            formData.question_type === type.value
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-neutral-200 hover:border-primary-300'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{type.icon}</span>
                                            <span className="font-medium text-neutral-900">{type.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Options (for radio and checkbox) */}
                        {['radio', 'checkbox'].includes(formData.question_type) && (
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Options <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    {formData.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                            />
                                            {formData.options.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveOption(index)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleAddOption}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Option
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Mandatory Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_mandatory}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_mandatory: e.target.checked }))}
                                className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                                <p className="font-medium text-neutral-900">Required Question</p>
                                <p className="text-sm text-neutral-600">Customers must answer this question</p>
                            </div>
                        </label>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="ghost"
                                onClick={handleCloseModal}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="flex-1"
                            >
                                {editingQuestion ? 'Update Question' : 'Add Question'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}
