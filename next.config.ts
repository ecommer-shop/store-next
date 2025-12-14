import {NextConfig} from 'next';

const nextConfig: NextConfig = {
    cacheComponents: true,
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
    }
};

export default nextConfig;