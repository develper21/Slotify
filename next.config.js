/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.stripe.com',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        config.infrastructureLogging = {
            level: 'error',
        }
        config.ignoreWarnings = [
            /Serializing big strings/,
            /Critical dependency/,
        ]
        return config
    },
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    logging: {
        fetches: {
            fullUrl: false,
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
}

module.exports = nextConfig
