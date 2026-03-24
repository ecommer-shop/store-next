import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    cacheComponents: false,
    output: 'standalone',
    productionBrowserSourceMaps: false,
    allowedDevOrigins: [
        'http://localhost:3001',
        'https://bipyramidal-colby-preworthy.ngrok-free.dev',
        'bipyramidal-colby-preworthy.ngrok-free.dev'],
    images: {
        // This is necessary to display images from your local Vendure instance
        
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname: 'ecommer.shop'
            },
            {
                hostname: 'admin.ecommer.shop'
            },
            {
                hostname: 'admin-stg.ecommer.shop'
            },
            {
                protocol: 'https',
                hostname: '**.s3.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.s3.us-east-2.amazonaws.com',
                pathname: '/**',
            }
        ],
    },
    experimental: {
        rootParams: true
    },
    turbopack: {
        resolveAlias: {
            '@': './src',
        },
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);