import { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecommer.shop';

return {
    rules: {
        userAgent: '*',
        allow: '/',
        disallow: [
            '/api/',
            '/*/api/',
            '/*/account/',
            '/*/cart/',
            '/*/checkout/',
            '/*/order-confirmation/',
            '/*/go',
        ],

    },
    sitemap: `${siteUrl}/sitemap.xml`,
    };

}