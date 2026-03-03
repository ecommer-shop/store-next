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
                hostname: 'ecommer-stg-assets-willian.s3.us-east-2.amazonaws.com'
            },
            {
                hostname: 'ecommer-stg-product-images.s3.us-east-2.amazonaws.com'
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