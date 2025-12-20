'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'

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
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {label}
                </label>
            )}

            {/* Select Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                    w-full px-4 py-3 rounded-lg border-2
                    flex items-center justify-between
                    transition-all duration-200
                    ${disabled ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
                    ${error ? 'border-red-500' : 'border-neutral-200'}
                    ${isOpen ? 'border-primary ring-4 ring-primary/10' : ''}
                    ${!disabled && !error ? 'hover:border-primary/50' : ''}
                `}
            >
                <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-400'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden">
                    {/* Search Input */}
                    {options.length > 5 && (
                        <div className="p-2 border-b border-neutral-200">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:border-primary"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
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
                                    className={`
                                        w-full px-4 py-3 text-left flex items-center justify-between
                                        transition-colors duration-150
                                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                        ${option.value === value ? 'bg-primary/10 text-primary' : 'text-neutral-700'}
                                        ${!option.disabled && option.value !== value ? 'hover:bg-neutral-50' : ''}
                                    `}
                                >
                                    <span className="text-sm">{option.label}</span>
                                    {option.value === value && (
                                        <Check className="w-4 h-4 text-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
