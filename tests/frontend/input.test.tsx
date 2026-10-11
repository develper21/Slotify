import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
    it('renders a labeled input and hint', () => {
        render(<Input label="Email" name="email" hint="We will not share your email." />)

        expect(screen.getByText('Email')).toBeTruthy()
        expect(screen.getByRole('textbox').getAttribute('name')).toBe('email')
        expect(screen.getByText('We will not share your email.')).toBeTruthy()
    })

    it('shows the error instead of the hint when validation fails', () => {
        render(<Input name="email" hint="Enter a valid email." error="Email is required." />)

        expect(screen.getByText('Email is required.')).toBeTruthy()
        expect(screen.queryByText('Enter a valid email.')).toBeNull()
    })
})
