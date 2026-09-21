import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'default'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            success: 'bg-green-500/10 text-green-400 border-green-500/20',
            warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            danger: 'bg-red-500/10 text-red-400 border-red-500/20',
            info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            primary: 'badge-primary',
            default: 'bg-neutral-700/50 text-neutral-300 border-neutral-700',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'badge border',
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
