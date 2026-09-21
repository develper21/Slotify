'use client'

import { usePathname } from 'next/navigation'
import { Check, Calendar, Clock, User, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BookingProgress() {
    const pathname = usePathname()

    const steps = [
        { name: 'Date', icon: Calendar, path: 'date' },
        { name: 'Time', icon: Clock, path: 'time' },
        { name: 'Details', icon: User, path: 'form' },
        { name: 'Payment', icon: CreditCard, path: 'payment' },
    ]

    const currentStepIndex = steps.findIndex(step => pathname.includes(step.path))

    return (
        <div className="flex items-center justify-center w-full max-w-2xl mx-auto mb-12">
            {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index < currentStepIndex
                const isActive = index === currentStepIndex
                const isLast = index === steps.length - 1

                return (
                    <div key={step.name} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center relative">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                isCompleted ? "bg-mongodb-spring border-mongodb-spring text-mongodb-black" :
                                    isActive ? "bg-mongodb-spring/10 border-mongodb-spring text-mongodb-spring shadow-[0_0_15px_rgba(0,237,100,0.2)]" :
                                        "bg-transparent border-neutral-800 text-neutral-600"
                            )}>
                                {isCompleted ? <Check className="w-5 h-5 stroke-[3px]" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <span className={cn(
                                "absolute -bottom-7 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-500",
                                isActive ? "text-mongodb-spring" : "text-neutral-600"
                            )}>
                                {step.name}
                            </span>
                        </div>
                        {!isLast && (
                            <div className="flex-1 h-[2px] mx-4 bg-neutral-800 rounded-full overflow-hidden">
                                <div className={cn(
                                    "h-full bg-mongodb-spring transition-all duration-700",
                                    isCompleted ? "w-full" : "w-0 shadow-[0_0_10px_rgba(0,237,100,0.5)]"
                                )} />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
