import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';

// Supported cache tags that can be revalidated
const VALID_TAGS = [
    'collections',
    'countries',
    'featured-products',
] as const;

// Dynamic tags follow patterns like 'product-{slug}', 'collection-{slug}', 'related-products-{slug}'
const DYNAMIC_TAG_PATTERNS = [
    /^product-.+$/,
    /^collection-.+$/,
    /^related-products-.+$/,
];

function isValidTag(tag: string): boolean {
    if ((VALID_TAGS as readonly string[]).includes(tag)) return true;
    return DYNAMIC_TAG_PATTERNS.some(pattern => pattern.test(tag));
}

export async function POST(request: NextRequest) {
    // Verify the secret token
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.REVALIDATION_SECRET;

    if (!expectedToken) {
        console.error('REVALIDATION_SECRET environment variable not set');
        return NextResponse.json(
            {error: 'Server configuration error'},
            {status: 500}
        );
    }

    if (authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json(
            {error: 'Unauthorized'},
            {status: 401}
        );
    }

    try {
        const body = await request.json();
        const {tags} = body;

        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json(
                {error: 'Missing or invalid "tags" array in request body'},
                {status: 400}
            );
        }

        // Validate and revalidate each tag
        const results: {tag: string; success: boolean; error?: string}[] = [];

        for (const tag of tags) {
            if (typeof tag !== 'string') {
                results.push({tag: String(tag), success: false, error: 'Invalid tag type'});
                continue;
            }

            if (!isValidTag(tag)) {
                results.push({tag, success: false, error: 'Unknown tag'});
                continue;
            }

            try {
                revalidateTag(tag, {expire: 0});
                results.push({tag, success: true});
            } catch {
                results.push({tag, success: false, error: 'Revalidation failed'});
            }
        }

        const allSuccessful = results.every(r => r.success);

        return NextResponse.json(
            {
                revalidated: allSuccessful,
                results,
                timestamp: Date.now(),
            },
            {status: allSuccessful ? 200 : 207} // 207 = Multi-Status
        );
    } catch {
        return NextResponse.json(
            {error: 'Invalid JSON body'},
            {status: 400}
        );
    }
}
