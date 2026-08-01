'use server';

import {mutate} from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies, requireClerkAuth } from '@/lib/vendure/server/auth';
import {
    CreateCustomerAddressMutation,
    UpdateCustomerAddressMutation,
    DeleteCustomerAddressMutation,
    UpdateCustomerMutation,
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
    matiasCityId?: string;
    dni?: string;
    identityDocumentId?: string;
    customFields?: {
        matiasCityId?: string | null;
        dni?: string | null;
        identityDocumentId?: string | null;
        latitude?: number | string | null;
        longitude?: number | string | null;
        neighborhood?: string | null;
        googlePlaceId?: string | null;
    };
}

interface UpdateAddressInput extends AddressInput {
    id: string;
}

const token = async () => {
    await requireClerkAuth();
    const cookiesStore = await cookies();
    const tokenAuth = getAuthTokenFromCookies(cookiesStore);
    return tokenAuth!
}

async function syncCustomerFiscalFields(
    authToken: string,
    address: CreateAddressPayload | UpdateAddressPayload,
) {
    const fiscalDni = (address.dni || address.customFields?.dni || '').trim();
    const identityDocumentId =
        address.identityDocumentId || address.customFields?.identityDocumentId || '1';
    if (!fiscalDni) {
        return;
    }
    await mutate(
        UpdateCustomerMutation,
        {
            input: {
                customFields: {
                    dni: fiscalDni,
                    identityDocumentId,
                },
            },
        } as any,
        { token: authToken, useAuthToken: true },
    );
}

export async function createAddress(address: CreateAddressPayload) {
    const authToken = await token();
    await syncCustomerFiscalFields(authToken, address);
    const result = await mutate(
        CreateCustomerAddressMutation,
        {input: normalizeInvoiceAddressInput(address)} as any,
        {token: authToken, useAuthToken: true}     
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create address');
    }
    
    revalidatePath('/account/addresses');
    return result.data.createCustomerAddress;
}

export async function updateAddress(address: UpdateAddressPayload) {
    const authToken = await token();
    await syncCustomerFiscalFields(authToken, address);
    const result = await mutate(
        UpdateCustomerAddressMutation,
        {
            input: normalizeInvoiceAddressInput(address)
        } as any,
        {token: authToken, useAuthToken: true}     
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to update address');
    }

    revalidatePath('/account/addresses');
    return result.data.updateCustomerAddress;
}

function normalizeInvoiceAddressInput(
    address: CreateAddressPayload | UpdateAddressPayload,
) {
    const { matiasCityId, dni, identityDocumentId, customFields, ...rest } = address;
    const cityId = matiasCityId || customFields?.matiasCityId || null;
    const fiscalDni = (dni || customFields?.dni || '').trim() || null;
    const fiscalDocumentType =
        (identityDocumentId || customFields?.identityDocumentId || '').trim() || null;
    return {
        ...rest,
        customFields: {
            ...customFields,
            matiasCityId: cityId,
            dni: fiscalDni,
            identityDocumentId: fiscalDocumentType,
        },
    };
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
