import {NextConfig} from 'next';

const nextConfig: NextConfig = {
    cacheComponents: true,
    output: 'standalone',
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
    i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'fr', 'es-419'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'es-419',
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
    domains: [
      {
        domain: 'ecommer.shop',
        defaultLocale: 'es-419',
        http: true,
        locales: ['en-US', 'es-419'],
      },
    ],
  },
};

export default nextConfig;