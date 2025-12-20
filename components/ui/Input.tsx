import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    labelClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, labelClassName, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className={cn("block text-sm font-medium text-neutral-300 mb-1.5 ml-1", labelClassName)}>
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            'input',
                            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500 font-medium animate-slide-up ml-1">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
