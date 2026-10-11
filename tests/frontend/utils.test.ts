import { describe, expect, it } from '@jest/globals'
import {
    formatDuration,
    formatTime,
    generateTimeSlots,
    getPasswordValidationError,
    isValidEmail,
    isValidPhone,
} from '@/lib/utils'

describe('frontend validation and booking helpers', () => {
    describe('isValidEmail', () => {
        it.each([
            ['customer@example.com', true],
            ['first.last+booking@example.co.uk', true],
            ['missing-at.example.com', false],
            ['customer@', false],
            ['customer name@example.com', false],
        ])('validates %s as %s', (email, expected) => {
            expect(isValidEmail(email)).toBe(expected)
        })
    })

    describe('isValidPhone', () => {
        it.each([
            ['+1 (555) 123-4567', true],
            ['123456789', false],
            ['phone1234567890', false],
        ])('validates %s as %s', (phone, expected) => {
            expect(isValidPhone(phone)).toBe(expected)
        })
    })

    describe('getPasswordValidationError', () => {
        it.each([
            ['shortA1', 'Password must be at least 8 characters'],
            ['lowercase1!', 'Password must include at least one uppercase letter'],
            ['UPPERCASE1!', 'Password must include at least one lowercase letter'],
            ['NoNumber!!', 'Password must include at least one number'],
            ['NoSpecial1', 'Password must include at least one special character'],
            ['ValidPass1!', null],
        ])('returns the expected result for a password', (password, expectedError) => {
            expect(getPasswordValidationError(password)).toBe(expectedError)
        })
    })

    it('creates only complete appointment slots within the requested time range', () => {
        expect(generateTimeSlots('09:00', '10:00', 30)).toEqual(['09:00', '09:30'])
        expect(generateTimeSlots('09:15', '10:00', 30)).toEqual(['09:15'])
        expect(generateTimeSlots('10:00', '10:00', 30)).toEqual([])
    })

    it('formats 12-hour time and appointment durations', () => {
        expect(formatTime('00:05')).toBe('12:05 AM')
        expect(formatTime('12:30')).toBe('12:30 PM')
        expect(formatTime('18:45')).toBe('6:45 PM')
        expect(formatDuration('01:30')).toBe('1h 30m')
        expect(formatDuration('00:45')).toBe('45m')
        expect(formatDuration('invalid')).toBe('30m')
    })
})
