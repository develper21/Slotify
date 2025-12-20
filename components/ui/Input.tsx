import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false)
        const [hasValue, setHasValue] = React.useState(false)

        return (
            <div className="w-full">
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            'w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none peer',
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
                            label && 'pt-6 pb-2',
                            className
                        )}
                        ref={ref}
                        onFocus={(e) => {
                            setIsFocused(true)
                            props.onFocus?.(e)
                        }}
                        onBlur={(e) => {
                            setIsFocused(false)
                            setHasValue(!!e.target.value)
                            props.onBlur?.(e)
                        }}
                        {...props}
                    />
                    {label && (
                        <label
                            className={cn(
                                'absolute left-4 transition-all duration-200 pointer-events-none',
                                isFocused || hasValue || props.value
                                    ? 'top-2 text-xs text-neutral-500'
                                    : 'top-1/2 -translate-y-1/2 text-base text-neutral-400'
                            )}
                        >
                            {label}
                        </label>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-500 animate-slide-up">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
