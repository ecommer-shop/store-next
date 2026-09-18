import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from "@clerk/nextjs/server";

/**
 * Server-side auth check that redirects to sign-in if user is not authenticated
 * Must be called from a Server Component or Server Action
 */
export async function protectRoute() {
    const user = await auth();

    if (!user.userId) {
        const headersList = await headers();
        const referer = headersList.get('referer') || process.env.NEXT_PUBLIC_SITE_URL!;
        let refererUrl: URL;
        try {
            refererUrl = new URL(referer);
        } catch {
            refererUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL!);
        }
        const path = refererUrl.pathname;
        const localeMatch = path.match(/^\/(es|en)\b/);
        const locale = localeMatch ? localeMatch[1] : 'es';
        const origin = refererUrl.origin || process.env.NEXT_PUBLIC_SITE_URL!;
        const signInUrl = new URL(`/${locale}/sign-in`, origin);
        signInUrl.searchParams.set('redirect_url', refererUrl.toString());
        redirect(signInUrl.toString());
    }

    return user;
}