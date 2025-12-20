/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        // Suppress webpack cache warnings
        config.infrastructureLogging = {
            level: 'error',
        }
        // Ignore specific warnings
        config.ignoreWarnings = [
            /Serializing big strings/,
            /Critical dependency/,
        ]
        return config
    },
    // Suppress other build warnings
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    // Suppress Edge Runtime warnings
    logging: {
        fetches: {
            fullUrl: false,
        },
    },
    // Suppress static generation errors for dynamic routes
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
    // Experimental features
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
}

module.exports = nextConfig
