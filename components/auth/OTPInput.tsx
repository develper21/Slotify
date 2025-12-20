'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
    length?: number
    onComplete: (otp: string) => void
    disabled?: boolean
    error?: boolean
    className?: string
}

export function OTPInput({
    length = 6,
    onComplete,
    disabled = false,
    error = false,
    className
}: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus()
    }, [])

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && isNaN(Number(value))) return

        const newOtp = [...otp]
        // Take only the last character if multiple are pasted
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        // Move to next input if value entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }

        // Check if OTP is complete
        const otpString = newOtp.join('')
        if (otpString.length === length && !newOtp.includes('')) {
            onComplete(otpString)
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus()
            }
        }

        // Move to next input on arrow right
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }

        // Move to previous input on arrow left
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text/plain').trim()

        // Only process if pasted data is all numbers
        if (!/^\d+$/.test(pastedData)) return

        const pastedArray = pastedData.slice(0, length).split('')
        const newOtp = [...otp]

        pastedArray.forEach((char, index) => {
            if (index < length) {
                newOtp[index] = char
            }
        })

        setOtp(newOtp)

        // Focus last filled input or first empty
        const lastFilledIndex = Math.min(pastedArray.length - 1, length - 1)
        inputRefs.current[lastFilledIndex]?.focus()

        // Check if complete
        const otpString = newOtp.join('')
        if (otpString.length === length) {
            onComplete(otpString)
        }
    }

    const clearOTP = () => {
        setOtp(new Array(length).fill(''))
        inputRefs.current[0]?.focus()
    }

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={cn(
                            "w-12 h-14 text-center text-2xl font-bold rounded-lg transition-all",
                            "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2",
                            error
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-neutral-300 focus:border-primary focus:ring-primary",
                            disabled && "bg-neutral-100 cursor-not-allowed opacity-50",
                            digit && !error && "border-primary"
                        )}
                        aria-label={`OTP digit ${index + 1}`}
                    />
                ))}
            </div>

            {error && (
                <button
                    type="button"
                    onClick={clearOTP}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                >
                    Clear and try again
                </button>
            )}
        </div>
    )
}
