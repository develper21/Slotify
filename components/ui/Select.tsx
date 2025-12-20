'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

interface SelectProps {
    options: SelectOption[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    label?: string
    error?: string
    disabled?: boolean
    className?: string
}

export function Select({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    label,
    error,
    disabled = false,
    className = ''
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <div className={cn('relative w-full', className)} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-neutral-300 mb-1.5 ml-1">
                    {label}
                </label>
            )}

            {/* Select Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    'input flex items-center justify-between',
                    disabled && 'opacity-50 cursor-not-allowed bg-neutral-800',
                    error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
                    isOpen && 'border-mongodb-spring ring-1 ring-mongodb-spring/50'
                )}
            >
                <span className={selectedOption ? 'text-white' : 'text-neutral-500'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        'w-4 h-4 text-neutral-500 transition-transform duration-200',
                        isOpen && 'rotate-180 text-mongodb-spring'
                    )}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-mongodb-slate border border-neutral-700/50 rounded-mongodb shadow-xl overflow-hidden animate-scale-in">
                    {/* Search Input */}
                    {options.length > 5 && (
                        <div className="p-2 border-b border-neutral-700/50 bg-mongodb-black/30">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-3 py-1.5 bg-mongodb-black/50 rounded-mongodb border border-neutral-700/50 text-sm text-white focus:outline-none focus:border-mongodb-spring"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto scrollbar-thin">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-neutral-500 text-center">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => !option.disabled && handleSelect(option.value)}
                                    disabled={option.disabled}
                                    className={cn(
                                        'w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors duration-150',
                                        option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                                        option.value === value
                                            ? 'bg-mongodb-spring/10 text-mongodb-spring'
                                            : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    <span className="text-sm font-medium">{option.label}</span>
                                    {option.value === value && (
                                        <Check className="w-4 h-4 text-mongodb-spring" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-1.5 text-sm text-red-500 font-medium animate-slide-up ml-1">{error}</p>
            )}
        </div>
    )
}
