import type {Metadata} from 'next';
import { getActiveCustomer } from '@/lib/vendure/actions';


import { ChangePasswordForm } from '../change-password-form';
import { EditProfileForm } from '../edit-profile-form';
import { EditEmailForm } from '../edit-email-form';
import { RedirectToSignIn, SignedOut, UserProfile } from '@clerk/nextjs';
import { es } from 'date-fns/locale';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { auth } from '@clerk/nextjs/server';
import UserProfileClient from '../user-profile';
import { Suspense } from 'react';

export default async function ProfilePage() { 

    const user = auth();

    if (!(await user).isAuthenticated){
        return (<SignedOut>
                    <RedirectToSignIn />
                </SignedOut>)
    }

    return(
        <Suspense fallback={<div className='p-6'>Cargando Perfil...</div>}>
            <UserProfileClient/>
        </Suspense>
    )
}