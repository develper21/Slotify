import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-neutral-200', className)}
            {...props}
        />
    )
}
