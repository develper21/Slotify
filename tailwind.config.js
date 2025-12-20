/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'hsl(215, 100%, 97%)',
                    100: 'hsl(215, 96%, 94%)',
                    200: 'hsl(215, 95%, 88%)',
                    300: 'hsl(215, 94%, 78%)',
                    400: 'hsl(215, 96%, 68%)',
                    500: 'hsl(215, 100%, 50%)',
                    600: 'hsl(215, 100%, 45%)',
                    700: 'hsl(215, 100%, 35%)',
                    800: 'hsl(215, 100%, 25%)',
                    900: 'hsl(215, 100%, 15%)',
                },
                accent: {
                    50: 'hsl(270, 100%, 97%)',
                    100: 'hsl(270, 100%, 94%)',
                    200: 'hsl(270, 100%, 88%)',
                    300: 'hsl(270, 100%, 78%)',
                    400: 'hsl(270, 100%, 68%)',
                    500: 'hsl(270, 100%, 60%)',
                    600: 'hsl(270, 100%, 50%)',
                    700: 'hsl(270, 100%, 40%)',
                    800: 'hsl(270, 100%, 30%)',
                    900: 'hsl(270, 100%, 20%)',
                },
                neutral: {
                    50: 'hsl(220, 20%, 98%)',
                    100: 'hsl(220, 20%, 95%)',
                    200: 'hsl(220, 20%, 90%)',
                    300: 'hsl(220, 20%, 80%)',
                    400: 'hsl(220, 20%, 60%)',
                    500: 'hsl(220, 20%, 40%)',
                    600: 'hsl(220, 20%, 30%)',
                    700: 'hsl(220, 20%, 20%)',
                    800: 'hsl(220, 20%, 15%)',
                    900: 'hsl(220, 20%, 10%)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                'sm': '0 2px 8px rgba(0,0,0,0.04)',
                'md': '0 4px 16px rgba(0,0,0,0.08)',
                'lg': '0 8px 32px rgba(0,0,0,0.12)',
                'xl': '0 16px 48px rgba(0,0,0,0.16)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, hsl(215, 100%, 50%), hsl(270, 100%, 60%))',
                'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
