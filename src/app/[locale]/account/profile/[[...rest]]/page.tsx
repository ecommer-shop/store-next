import { RedirectToSignIn, SignedOut, UserProfile } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import UserProfileClient from '../user-profile';
import { Suspense } from 'react';
import { Spinner } from '@heroui/react';

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center gap-2">
                <Spinner color="current" />
            </div>
        }>
            <UserProfileClient />
        </Suspense>
    )
}