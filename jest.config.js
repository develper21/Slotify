const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    testMatch: [
        '<rootDir>/tests/frontend/**/*.test.[jt]s?(x)',
        '<rootDir>/tests/server/**/*.test.[jt]s?(x)',
    ],
    collectCoverageFrom: [
        'app/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/.next/**',
    ],
}

module.exports = createJestConfig(config)
