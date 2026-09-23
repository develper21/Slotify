import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'subtle'
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-mongodb-black disabled:opacity-50 disabled:cursor-not-allowed select-none'

        const variants = {
            primary: 'bg-mongodb-spring text-mongodb-black font-bold hover:bg-white hover:scale-[1.02] active:scale-95 focus:ring-mongodb-spring shadow-[0_4px_14px_rgba(0,237,100,0.25)] hover:shadow-[0_6px_22px_rgba(0,237,100,0.4)]',
            secondary: 'bg-mongodb-forest text-white border border-mongodb-spring/20 hover:bg-mongodb-forest/80 focus:ring-mongodb-forest',
            ghost: 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 focus:ring-white/20',
            danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white focus:ring-red-500',
            outline: 'bg-transparent text-mongodb-spring border border-mongodb-spring/40 hover:bg-mongodb-spring/10 hover:border-mongodb-spring focus:ring-mongodb-spring',
            subtle: 'bg-mongodb-card text-white border border-white/10 hover:bg-mongodb-elevated hover:border-white/20 focus:ring-mongodb-spring/30',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
            md: 'px-4 py-2.5 text-sm font-semibold gap-2',
            lg: 'px-6 py-3 text-base font-semibold gap-2.5',
            xl: 'px-8 py-4 text-lg font-bold gap-3',
            icon: 'h-9 w-9 p-2',
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}>
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
