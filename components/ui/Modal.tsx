'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md' }: ModalProps) {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full bg-white rounded-2xl shadow-xl animate-scale-in',
                    sizes[size]
                )}
            >
                {/* Header */}
                {(title || description) && (
                    <div className="px-6 py-4 border-b border-neutral-200">
                        <div className="flex items-start justify-between">
                            <div>
                                {title && (
                                    <h2 className="text-2xl font-display font-semibold">{title}</h2>
                                )}
                                {description && (
                                    <p className="mt-1 text-sm text-neutral-600">{description}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
                    {children}
                </div>
            </div>
        </div>
    )
}
