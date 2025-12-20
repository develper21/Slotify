import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

/**
 * Format time to readable string
 */
export function formatTime(time: string): string {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Format duration interval to readable string
 */
export function formatDuration(duration: string): string {
    // Duration comes as PostgreSQL interval like "00:30:00" or "01:00:00"
    const parts = duration.split(':')
    const hours = parseInt(parts[0])
    const minutes = parseInt(parts[1])

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`
    } else if (hours > 0) {
        return `${hours}h`
    } else {
        return `${minutes}m`
    }
}

/**
 * Generate shareable appointment link
 */
export function getAppointmentLink(appointmentId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${baseUrl}/appointments/${appointmentId}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (error) {
        console.error('Failed to copy:', error)
        return false
    }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Validate password against application requirements
 */
export function getPasswordValidationError(password: string): string | null {
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter'
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter'
    if (!/\d/.test(password)) return 'Password must include at least one number'
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include at least one special character'
    return null
}

/**
 * Generate time slots array
 */
export function generateTimeSlots(
    startTime: string,
    endTime: string,
    durationMinutes: number
): string[] {
    const slots: string[] = []
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    let currentMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    while (currentMinutes + durationMinutes <= endMinutes) {
        const hour = Math.floor(currentMinutes / 60)
        const minute = currentMinutes % 60
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
        currentMinutes += durationMinutes
    }

    return slots
}

/**
 * Get day of week name
 */
export function getDayName(dayOfWeek: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayOfWeek]
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
}
