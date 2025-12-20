import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            success: 'bg-green-100 text-green-700 border-green-200',
            warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            danger: 'bg-red-100 text-red-700 border-red-200',
            info: 'bg-blue-100 text-blue-700 border-blue-200',
            default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                    variants[variant],
                    className
                )}
                {...props}
            />
        )
    }
)

Badge.displayName = 'Badge'

export { Badge }
