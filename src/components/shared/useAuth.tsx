
import { redirect } from 'next/navigation';
import { auth } from "@clerk/nextjs/server";

/**
 * Server-side auth check that redirects to sign-in if user is not authenticated
 * Must be called from a Server Component or Server Action
 */
export async function protectRoute() {
    const user = await auth();

    if (!user.userId) {
        redirect('/sign-in');
    }

    return user;
}