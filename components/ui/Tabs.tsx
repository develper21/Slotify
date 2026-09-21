'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TabsProps {
    defaultValue: string
    children: React.ReactNode
    className?: string
}

export interface TabsListProps {
    children: React.ReactNode
    className?: string
}

export interface TabsTriggerProps {
    value: string
    children: React.ReactNode
    className?: string
}

export interface TabsContentProps {
    value: string
    children: React.ReactNode
    className?: string
}

const TabsContext = React.createContext<{
    activeTab: string
    setActiveTab: (value: string) => void
}>({
    activeTab: '',
    setActiveTab: () => { },
})

export function Tabs({ defaultValue, children, className }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultValue)

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn('w-full', className)}>{children}</div>
        </TabsContext.Provider>
    )
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 p-1 bg-mongodb-black/50 border border-neutral-700/50 rounded-mongodb',
                className
            )}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    const isActive = activeTab === value

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={cn(
                'px-4 py-1.5 rounded-mongodb text-sm font-semibold transition-all duration-200',
                isActive
                    ? 'bg-mongodb-forest text-white shadow-mongodb'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5',
                className
            )}>
            {children}
        </button>
    )
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    const { activeTab } = React.useContext(TabsContext)

    if (activeTab !== value) return null

    return (
        <div className={cn('mt-6 animate-fade-in', className)}>
            {children}
        </div>
    )
}
