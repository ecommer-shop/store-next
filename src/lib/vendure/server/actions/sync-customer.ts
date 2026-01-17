'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { query } from '@/lib/vendure/server/api';
import { RegisterCustomerAccountMutation } from '@/lib/vendure/shared/mutations';


export async function syncCustomerWithVendure() {
    const {getToken} = await auth();
    const user = await currentUser();
    
    if (!user) return;
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) return;
    
    const token = await getToken({
        expiresInSeconds: 3600
    })
    const result = await query(RegisterCustomerAccountMutation, {
        input:{
            emailAddress: email,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
        }
    });

    if (result.data.registerCustomerAccount.__typename !== 'Success') {
        if ('errorCode' in result.data.registerCustomerAccount && result.data.registerCustomerAccount.errorCode === 'EMAIL_ADDRESS_CONFLICT_ERROR') {
            return; // ya existe
        }
    }
}
