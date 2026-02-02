'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { query } from '@/lib/vendure/server/api';
import { AuthenticateWithClerk, RegisterCustomerAccountMutation } from '@/lib/vendure/shared/mutations';
import { mutate } from '../../server/api';
import { setAuthToken, setAuthTokenOnCookies, setJWT } from '../auth';
import { cookies } from 'next/headers';
import { GetWompiSignatureQuery } from '../../shared/queries';


export async function syncCustomerWithVendure() {
    const {sessionId} = await auth();
    const user = await currentUser();
    
    if (!user) return;
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return;
    const cookiesStore = await cookies();
    const client = await clerkClient()
    const token = await client.sessions.getToken(
        sessionId!,
        "vendure"
    )
    const result = await mutate(RegisterCustomerAccountMutation, {
        input:{
            emailAddress: email,
            firstName: user.username ?? user.firstName,
            lastName: user.lastName ?? '',
            password: email,
            phoneNumber: user.primaryPhoneNumber?.phoneNumber ?? '',
        },
        token
    });

    const login = await mutate(AuthenticateWithClerk, {
        token: token.jwt
    })

    await setAuthToken(login.token!);
    await setJWT(token.jwt);
    setAuthTokenOnCookies(cookiesStore, login.token!)

    if (result.data.registerCustomerAccount.__typename !== 'Success') {
        if ('errorCode' in result.data.registerCustomerAccount && result.data.registerCustomerAccount.errorCode === 'EMAIL_ADDRESS_CONFLICT_ERROR') {
            return; // ya existe
        }
    }
}
