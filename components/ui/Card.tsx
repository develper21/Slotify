import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean
    glass?: boolean
    highlight?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = true, glass = false, highlight = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-[#0C2331] border border-white/10 rounded-xl p-6 transition-all duration-250',
                    glass && 'bg-[#0C2331]/80 backdrop-blur-xl border-white/10',
                    highlight && 'border-mongodb-spring/40 shadow-[0_0_25px_rgba(0,237,100,0.1)]',
                    hover && 'hover:border-mongodb-spring/35 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,30,43,0.8),0_0_20px_rgba(0,237,100,0.1)]',
                    className
                )}
                {...props}>
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('mb-5', className)} {...props} />
    )
)

CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn('text-xl font-display font-bold text-white tracking-tight', className)} {...props} />
    )
)

CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn('text-sm text-neutral-400 mt-1 leading-relaxed', className)} {...props} />
    )
)

CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('space-y-4', className)} {...props} />
    )
)

CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3', className)} {...props} />
    )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
