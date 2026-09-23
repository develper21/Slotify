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
                mongodb: {
                    black: '#001E2B',
                    dark: '#001E2B',
                    card: '#0C2331',
                    cardHover: '#112D3E',
                    elevated: '#16384C',
                    border: '#1E3C4E',
                    borderLight: 'rgba(255, 255, 255, 0.08)',
                    forest: '#00684A',
                    forestDark: '#023430',
                    spring: '#00ED64',
                    springHover: '#00c754',
                    mint: '#00D4B2',
                    slate: '#1C2B36',
                    gray: '#3D4F58',
                    textMuted: '#94A3B8',
                    textDim: '#64748B',
                    light: '#E8EDEB',
                    white: '#FFFFFF',
                },
                primary: {
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    200: '#BBF7D0',
                    300: '#86EFAC',
                    400: '#4ADE80',
                    500: '#00ED64',
                    600: '#00684A',
                    700: '#004D39',
                    800: '#003E2F',
                    900: '#001E2B',
                },
                accent: {
                    500: '#00ED64',
                    600: '#00684A',
                },
                neutral: {
                    50: '#F9FBFA',
                    100: '#E8EDEB',
                    200: '#D1D7D3',
                    300: '#B1B7B3',
                    400: '#818783',
                    500: '#3D4F58',
                    600: '#2C3E47',
                    700: '#1C2B36',
                    800: '#0C1C26',
                    900: '#001E2B',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
            },
            boxShadow: {
                'sm': '0 2px 8px rgba(0,30,43,0.04)',
                'md': '0 4px 16px rgba(0,30,43,0.08)',
                'lg': '0 8px 32px rgba(0,30,43,0.12)',
                'xl': '0 16px 48px rgba(0,30,43,0.16)',
                'mongodb': '0 10px 30px -5px rgba(0, 30, 43, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                'spring-glow': '0 0 25px rgba(0, 237, 100, 0.25)',
                'spring-glow-lg': '0 0 45px rgba(0, 237, 100, 0.4)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.35)',
            },
            backgroundImage: {
                'gradient-mongodb': 'linear-gradient(135deg, #00ED64 0%, #00684A 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0C2331 0%, #001E2B 100%)',
                'gradient-card': 'linear-gradient(135deg, rgba(12, 35, 49, 0.8) 0%, rgba(0, 30, 43, 0.95) 100%)',
                'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 237, 100, 0.15), transparent 70%)',
                'atlas-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 237, 100, 0.08) 0%, transparent 60%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-slow': 'pulseGlow 4s ease-in-out infinite',
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
                    '0%': { transform: 'scale(0.97)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
                    '50%': { opacity: '0.6', transform: 'scale(1.05)' },
                },
            },
            borderRadius: {
                'mongodb': '8px',
                'mongodb-lg': '12px',
                'mongodb-xl': '16px',
            }
        },
    },
    plugins: [],
}
