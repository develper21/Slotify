'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

interface Column<T> {
    key: string
    header: string
    render?: (item: T) => React.ReactNode
    sortable?: boolean
    width?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    keyExtractor: (item: T) => string
    onRowClick?: (item: T) => void
    actions?: (item: T) => React.ReactNode
    emptyMessage?: string
    pageSize?: number
    className?: string
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    actions,
    emptyMessage = 'No data available',
    pageSize = 10,
    className = ''
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [currentPage, setCurrentPage] = useState(1)

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0

        const aValue = a[sortKey]
        const bValue = b[sortKey]

        if (aValue === bValue) return 0

        const comparison = aValue > bValue ? 1 : -1
        return sortOrder === 'asc' ? comparison : -comparison
    })

    const totalPages = Math.ceil(sortedData.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = sortedData.slice(startIndex, endIndex)

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortOrder('asc')
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    if (data.length === 0) {
        return (
            <div className={`bg-mongodb-slate/50 rounded-xl shadow-sm p-12 text-center border border-neutral-800 ${className}`}>
                <p className="text-neutral-400">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className={`bg-mongodb-slate/50 rounded-xl shadow-sm overflow-hidden border border-neutral-800 ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-mongodb-black border-b border-neutral-800">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`
                                        px-6 py-4 text-left text-sm font-semibold text-neutral-300
                                        ${column.sortable ? 'cursor-pointer hover:bg-neutral-800/50' : ''}
                                        ${column.width || ''}
                                    `}
                                    onClick={() => column.sortable && handleSort(column.key)}>
                                    <div className="flex items-center gap-2">
                                        {column.header}
                                        {column.sortable && (
                                            <div className="flex flex-col">
                                                <ChevronUp
                                                    className={`w-3 h-3 -mb-1 ${sortKey === column.key && sortOrder === 'asc'
                                                        ? 'text-mongodb-spring'
                                                        : 'text-neutral-600'
                                                        }`}
                                                />
                                                <ChevronDown
                                                    className={`w-3 h-3 ${sortKey === column.key && sortOrder === 'desc'
                                                        ? 'text-mongodb-spring'
                                                        : 'text-neutral-600'
                                                        }`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {paginatedData.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                onClick={() => onRowClick?.(item)}
                                className={`
                                    transition-colors duration-150
                                    ${onRowClick ? 'cursor-pointer hover:bg-neutral-800/30' : 'hover:bg-neutral-800/10'}
                                `}>
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-neutral-300">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {actions(item)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between bg-mongodb-black/30">
                    <div className="text-sm text-neutral-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className={`min-w-[2.5rem] ${page !== currentPage ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : ''}`}>
                                        {page}
                                    </Button>
                                )
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={page} className="text-neutral-600">...</span>
                            }
                            return null
                        })}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
