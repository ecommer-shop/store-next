import { RedirectToSignIn, SignedOut, UserProfile } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import UserProfileClient from '../user-profile';
import { Suspense } from 'react';

export default function ProfilePage() { 
    return(
        <Suspense fallback={<div className='p-6'>Cargando Perfil...</div>}>
            <UserProfileClient/>
        </Suspense>
    )
}