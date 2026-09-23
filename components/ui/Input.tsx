import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    labelClassName?: string
    hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, hint, labelClassName, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className={cn("block text-xs font-bold text-neutral-400 uppercase tracking-widest px-0.5", labelClassName)}>
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            'w-full px-4 py-3 bg-[#001E2B] rounded-lg border border-[#1E3C4E] text-white placeholder:text-neutral-500 text-sm font-medium transition-all duration-200 outline-none focus:border-mongodb-spring focus:ring-2 focus:ring-mongodb-spring/20 disabled:opacity-50 disabled:cursor-not-allowed',
                            error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {hint && !error && (
                    <p className="text-xs text-neutral-500 px-0.5">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-400 font-medium px-0.5">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
