'use server';

import {mutate} from '@/lib/vendure/server/api';
import { getAuthToken } from '@/lib/vendure/server/auth';
import {
    CreateCustomerAddressMutation,
    UpdateCustomerAddressMutation,
    DeleteCustomerAddressMutation,
    AuthenticateWithClerk,
} from '@/lib/vendure/shared/mutations';
import { auth, clerkClient } from '@clerk/nextjs/server';
import {revalidatePath} from 'next/cache';
import { CreateAddressPayload, UpdateAddressPayload } from './addresses-client';

interface AddressInput {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryId: string;
    phoneNumber: string;
    company?: string;
    countryCode: string
}

interface UpdateAddressInput extends AddressInput {
    id: string;
}

export async function createAddress(address: CreateAddressPayload) {

    const tokenAuth = await getAuthToken(); 
    const result = await mutate(
        CreateCustomerAddressMutation,
        {input: address},
        {token: tokenAuth!, useAuthToken: true}     
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create address');
    }
    
    revalidatePath('/account/addresses');
    return result.data.createCustomerAddress;
}

export async function updateAddress(address: UpdateAddressPayload) {
    
    const tokenAuth = await getAuthToken(); 
    const result = await mutate(
        UpdateCustomerAddressMutation,
        {
            input: address
        },
        {token: tokenAuth!, useAuthToken: true}     
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to update address');
    }

    revalidatePath('/account/addresses');
    return result.data.updateCustomerAddress;
}

export async function deleteAddress(id: string) {
    const tokenAuth = await getAuthToken(); 
    const result = await mutate(
        DeleteCustomerAddressMutation,
        {id},
        {token: tokenAuth!, useAuthToken: true}      
    );

    if (!result.data.deleteCustomerAddress.success) {
        throw new Error('Failed to delete address');
    }

    revalidatePath('/account/addresses');
    return result.data.deleteCustomerAddress;
}

export async function setDefaultShippingAddress(id: string) {
    const tokenAuth = await getAuthToken(); 
    const result = await mutate(
        UpdateCustomerAddressMutation,
        {
            input: {
                id,
                defaultShippingAddress: true,
            },
        },
        {token: tokenAuth!, useAuthToken: true}     
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to set default shipping address');
    }

    revalidatePath('/account/addresses');
    return result.data.updateCustomerAddress;
}

export async function setDefaultBillingAddress(id: string) {
    const tokenAuth = await getAuthToken(); 
    const result = await mutate(
        UpdateCustomerAddressMutation,
        {
            input: {
                id,
                defaultBillingAddress: true,
            },
        },
        {token: tokenAuth!, useAuthToken: true}     
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to set default billing address');
    }

    revalidatePath('/account/addresses');
    return result.data.updateCustomerAddress;
}
