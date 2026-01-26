import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    cacheComponents: false,
    output: 'standalone',
    productionBrowserSourceMaps: false,
    images: {
        // This is necessary to display images from your local Vendure instance
        
        remotePatterns: [
            {
                hostname: 'readonlydemo.vendure.io',
            },
            {
                hostname: 'demo.vendure.io'
            },
            {
                hostname: 'localhost'
            },
            {
                hostname: 'ecommer.shop'
            },
            {
                hostname: 'admin.ecommer.shop'
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