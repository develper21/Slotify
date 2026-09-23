import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'default' | 'outline'
    dot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', dot = false, children, ...props }, ref) => {
        const variants = {
            success: 'bg-mongodb-spring/10 text-mongodb-spring border-mongodb-spring/30',
            primary: 'bg-mongodb-spring/15 text-mongodb-spring border-mongodb-spring/40 font-bold',
            warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            danger: 'bg-red-500/10 text-red-400 border-red-500/30',
            info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
            outline: 'bg-transparent text-neutral-300 border-white/20',
            default: 'bg-[#16384C] text-neutral-300 border-white/10',
        }

        const dotColors = {
            success: 'bg-mongodb-spring animate-pulse',
            primary: 'bg-mongodb-spring',
            warning: 'bg-amber-400',
            danger: 'bg-red-400',
            info: 'bg-cyan-400',
            outline: 'bg-neutral-400',
            default: 'bg-neutral-400',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border select-none',
                    variants[variant],
                    className
                )}
                {...props}>
                {dot && (
                    <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
                )}
                {children}
            </div>
        )
    }
)

Badge.displayName = 'Badge'

export { Badge }
