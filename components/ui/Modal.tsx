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
    className?: string
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md', className }: ModalProps) {
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
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-md"
                onClick={onClose}
            />
            <div
                className={cn(
                    'relative w-full bg-[#0C2331] border border-white/15 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] animate-scale-in text-white overflow-hidden',
                    sizes[size],
                    className
                )}>
                {(title || description) && (
                    <div className="px-6 py-5 border-b border-white/10 bg-[#001E2B]/50">
                        <div className="flex items-start justify-between">
                            <div>
                                {title && (
                                    <h2 className="text-xl font-display font-bold text-white tracking-tight">{title}</h2>
                                )}
                                {description && (
                                    <p className="mt-1 text-sm text-neutral-400">{description}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="ml-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
                    {children}
                </div>
            </div>
        </div>
    )
}
