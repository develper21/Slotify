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
                    forest: '#00684A',
                    spring: '#00ED64',
                    slate: '#1C2B36',
                    gray: '#3D4F58',
                    light: '#E8EDEB',
                    white: '#FFFFFF',
                },
                primary: {
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    200: '#BBF7D0',
                    300: '#86EFAC',
                    400: '#4ADE80',
                    500: '#00ED64', // MongoDB Spring Green
                    600: '#00684A', // MongoDB Forest Green
                    700: '#004D39',
                    800: '#003E2F',
                    900: '#001E2B', // MongoDB Black
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
                sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            boxShadow: {
                'sm': '0 2px 8px rgba(0,30,43,0.04)',
                'md': '0 4px 16px rgba(0,30,43,0.08)',
                'lg': '0 8px 32px rgba(0,30,43,0.12)',
                'xl': '0 16px 48px rgba(0,30,43,0.16)',
                'mongodb': '0 4px 10px -2px rgba(0, 30, 43, 0.3)',
            },
            backgroundImage: {
                'gradient-mongodb': 'linear-gradient(135deg, #00ED64, #00684A)',
                'gradient-dark': 'linear-gradient(135deg, #001E2B, #1C2B36)',
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
            borderRadius: {
                'mongodb': '6px',
            }
        },
    },
    plugins: [],
}
