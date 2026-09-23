'use client'

import * as React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export interface ConfirmOptions {
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    /** true (default) => red destructive button; false => primary */
    destructive?: boolean
}

/**
 * Branded replacement for native window.confirm().
 *
 * Usage:
 *   const { confirm, confirmDialog } = useConfirmDialog()
 *   const ok = await confirm({ title: 'Delete?', description: 'This is permanent.' })
 *   if (!ok) return
 *   return (<>{content}{confirmDialog}</>)
 */
export function useConfirmDialog() {
    const [options, setOptions] = React.useState<ConfirmOptions | null>(null)
    const resolveRef = React.useRef<((value: boolean) => void) | null>(null)

    const confirm = React.useCallback((opts: ConfirmOptions = {}) => {
        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve
            setOptions(opts)
        })
    }, [])

    const settle = React.useCallback((value: boolean) => {
        resolveRef.current?.(value)
        resolveRef.current = null
        setOptions(null)
    }, [])

    const confirmDialog = (
        <Modal isOpen={!!options} onClose={() => settle(false)} title={options?.title} className="max-w-sm">
            <div className="space-y-5">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-sm text-neutral-300 leading-relaxed pt-1.5">{options?.description}</p>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                    <Button variant="ghost" onClick={() => settle(false)} className="rounded-xl">
                        {options?.cancelLabel || 'Cancel'}
                    </Button>
                    <Button
                        variant={options?.destructive === false ? 'primary' : 'danger'}
                        onClick={() => settle(true)}
                        className="rounded-xl font-bold">
                        {options?.confirmLabel || 'Confirm'}
                    </Button>
                </div>
            </div>
        </Modal>
    )

    return { confirm, confirmDialog }
}
