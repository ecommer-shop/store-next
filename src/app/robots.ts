import { MetadataRoute } from 'next';

const isProd = process.env.ALLOW_INDEXING === "true";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecommer.shop';

export default function robots(): MetadataRoute.Robots {

if (!isProd) {
    return {
        rules: {
            userAgent: '*',
            disallow: '/',
        },
    };
}
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
            '/*/search',
            '/*/go',
        ],

    },
    sitemap: `${siteUrl}/sitemap.xml`,
    };

}