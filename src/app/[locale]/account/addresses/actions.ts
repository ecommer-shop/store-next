'use server';

import {mutate} from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies } from '@/lib/vendure/server/auth';
import {
    CreateCustomerAddressMutation,
    UpdateCustomerAddressMutation,
    DeleteCustomerAddressMutation,
} from '@/lib/vendure/shared/mutations';
import {revalidatePath} from 'next/cache';
import { CreateAddressPayload, UpdateAddressPayload } from './addresses-client';
import { cookies } from 'next/headers';

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

const token = async () => {
    const cookiesStore = await cookies();
    const tokenAuth = getAuthTokenFromCookies(cookiesStore);
    return tokenAuth!
}

export async function createAddress(address: CreateAddressPayload) {
    const result = await mutate(
        CreateCustomerAddressMutation,
        {input: address},
        {token: (await token()), useAuthToken: true}     
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create address');
    }
    
    revalidatePath('/account/addresses');
    return result.data.createCustomerAddress;
}

export async function updateAddress(address: UpdateAddressPayload) {
    const result = await mutate(
        UpdateCustomerAddressMutation,
        {
            input: address
        },
        {token: (await token()), useAuthToken: true}     
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to update address');
    }

    revalidatePath('/account/addresses');
    return result.data.updateCustomerAddress;
}

export async function deleteAddress(id: string) {
    const result = await mutate(
        DeleteCustomerAddressMutation,
        {id},
        {token: (await token()), useAuthToken: true}      
    );

    if (!result.data.deleteCustomerAddress.success) {
        throw new Error('Failed to delete address');
    }

    revalidatePath('/account/addresses');
    return result.data.deleteCustomerAddress;
}

export async function setDefaultShippingAddress(id: string) {
    const result = await mutate(
        UpdateCustomerAddressMutation,
        {
            input: {
                id,
                defaultShippingAddress: true,
            },
        },
        {token: (await token()), useAuthToken: true}     
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to set default shipping address');
    }

    revalidatePath('/account/addresses');
    return result.data.updateCustomerAddress;
}

export async function setDefaultBillingAddress(id: string) {
    const result = await mutate(
        UpdateCustomerAddressMutation,
        {
            input: {
                id,
                defaultBillingAddress: true,
            },
        },
        {token: (await token()), useAuthToken: true}     
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to set default billing address');
    }

    revalidatePath('/account/addresses');
    return result.data.updateCustomerAddress;
}
