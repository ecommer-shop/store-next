'use server';

import { mutate, query } from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies, requireClerkAuth } from '@/lib/vendure/server/auth';
import {
    SetOrderShippingAddressMutation,
    SetOrderBillingAddressMutation,
    SetOrderShippingMethodMutation,
    AddPaymentToOrderMutation,
    RemoveFromCartMutation,
    CreateCustomerAddressMutation,
    UpdateCustomerAddressMutation,
    TransitionOrderToStateMutation,
    SetOrderDynamicShippingMethod,
    UpdateCustomerMutation
} from '@/lib/vendure/shared/mutations';
import { GetActiveOrderQuery } from '@/lib/vendure/shared/queries';
import { GetWompiSignatureQuery } from '@/lib/vendure/shared/queries';
import { revalidatePath, updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

interface AddressInput {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
    phoneNumber: string;
    company?: string;
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

const DEFAULT_DELIVERY_PRICE_COP = 8500;

export type DeliveryCostQuote = {
    price: {
        value: number;
        currencyCode: 'COP';
    };
};

export async function setShippingAddress(
    shippingAddress: AddressInput,
    useSameForBilling: boolean,
    fiscalDni?: string,
    identityDocumentId?: string
) {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore);
    if (!token) {
        throw new Error('AUTH_REQUIRED');
    }
    const fiscalDniFromAddress = fiscalDni || shippingAddress.dni || shippingAddress.customFields?.dni;
    const identityDocumentIdFromAddress =
        identityDocumentId || shippingAddress.identityDocumentId || shippingAddress.customFields?.identityDocumentId || '1';

    if (fiscalDniFromAddress?.trim()) {
        await mutate(
            UpdateCustomerMutation,
            {
                input: {
                    customFields: {
                        dni: fiscalDniFromAddress.trim(),
                        identityDocumentId: identityDocumentIdFromAddress,
                    },
                },
            } as any,
            { token, useAuthToken: true }
        );
    }

    const input = normalizeInvoiceAddressInput(shippingAddress);
    const shippingResult = await mutate(
        SetOrderShippingAddressMutation,
        { input } as any,
        { token, useAuthToken: true }
    );

    if (shippingResult.data.setOrderShippingAddress.__typename !== 'Order') {
        throw new Error('Failed to set shipping address');
    }

    if (useSameForBilling) {
        await mutate(
            SetOrderBillingAddressMutation,
            { input } as any,
            { token, useAuthToken: true }
        );
    }

    revalidatePath('/checkout');
}

export async function setShippingMethod(shippingMethodId: string) {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const result = await mutate(
        SetOrderShippingMethodMutation,
        { shippingMethodId: [shippingMethodId] },
        { token, useAuthToken: true }
    );
    
    if (result.data.setOrderShippingMethod.__typename !== 'Order') {
        throw new Error('Failed to set shipping method');
    }

    revalidatePath('/checkout');
}

export async function setDynamicShippingPrice(price: number) {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    await mutate(
        SetOrderDynamicShippingMethod,
        { price: Math.round(price) },

        { token, useAuthToken: true }
    );
    revalidatePath('/checkout');
}

export async function calculateDeliveryCostQuote(): Promise<DeliveryCostQuote> {
    return {
        price: {
            value: DEFAULT_DELIVERY_PRICE_COP,
            currencyCode: 'COP',
        },
    };
}

export async function calculateAndSetDeliveryCost() {
    const quote = await calculateDeliveryCostQuote();
    await setDynamicShippingPrice(quote.price.value);
    return quote;
}

export async function createCustomerAddress(address: AddressInput) {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore);
    if (!token) {
        throw new Error('AUTH_REQUIRED');
    }
    const result = await mutate(
        CreateCustomerAddressMutation,
        { input: normalizeInvoiceAddressInput(address) } as any,
        { token, useAuthToken: true }
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create customer address');
    }

    revalidatePath('/checkout');
    return result.data.createCustomerAddress;
}

function normalizeInvoiceAddressInput(address: AddressInput): AddressInput {
    const { matiasCityId, dni, identityDocumentId, customFields, ...rest } = address;
    const cityId = matiasCityId || customFields?.matiasCityId;
    const fiscalDni = dni || customFields?.dni;
    const fiscalDocumentType = identityDocumentId || customFields?.identityDocumentId;
    return {
        ...rest,
        customFields: {
            ...customFields,
            ...(cityId ? { matiasCityId: cityId } : {}),
            ...(fiscalDni ? { dni: fiscalDni } : {}),
            ...(fiscalDocumentType ? { identityDocumentId: fiscalDocumentType } : {}),
        },
    };
}

export async function updateCustomerAddress(id: string, address: AddressInput) {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore);
    if (!token) {
        throw new Error('AUTH_REQUIRED');
    }
    const result = await mutate(
        UpdateCustomerAddressMutation,
        { input: { id, ...normalizeInvoiceAddressInput(address) } } as any,
        { token, useAuthToken: true }
    );

    if (!result.data.updateCustomerAddress) {
        throw new Error('Failed to update customer address');
    }

    revalidatePath('/checkout');
    return result.data.updateCustomerAddress;
}

export async function transitionToArrangingPayment() {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const result = await mutate(
        TransitionOrderToStateMutation,
        { state: 'ArrangingPayment' },
        { token, useAuthToken: true }
    );

    if (result.data.transitionOrderToState?.__typename === 'OrderStateTransitionError') {
        const errorResult = result.data.transitionOrderToState;
        throw new Error(
            `Failed to transition order state: ${errorResult.errorCode} - ${errorResult.message}`
        );
    }

    revalidatePath('/checkout');
}

export async function placeOrder(
    paymentMethodCode: string,
    selectedLineIds?: string[],
    _shippingMethodIds?: string[],
    _shippingPriceWithTax?: number,
) {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;

    // If selectedLineIds provided, remove unselected lines from the active order
    if (Array.isArray(selectedLineIds)) {
        if (selectedLineIds.length === 0) {
            throw new Error('No items selected for the order');
        }

        // Fetch active order to know current lines
        const activeOrderRes = await query(GetActiveOrderQuery, {}, { token, useAuthToken: true });
        const activeOrder = activeOrderRes.data.activeOrder;
        if (activeOrder && Array.isArray(activeOrder.lines)) {
            const linesToRemove = activeOrder.lines.filter((l: any) => !selectedLineIds.includes(l.id));
            for (const line of linesToRemove) {
                try {
                    await mutate(RemoveFromCartMutation, { lineId: line.id }, { token, useAuthToken: true });
                } catch (err) {
                    console.error('Failed to remove unselected line before placing order', line.id, err);
                }
            }
        }
    }

    // First, transition the order to ArrangingPayment state
    await transitionToArrangingPayment();

    // Prepare metadata based on payment method
    const metadata: Record<string, unknown> = {};

    // For standard payment, include the required fields
    if (paymentMethodCode === 'standard-payment') {
        metadata.shouldDecline = false;
        metadata.shouldError = false;
        metadata.shouldErrorOnSettle = false;
    }

    // Add payment to the order
    const result = await mutate(
        AddPaymentToOrderMutation,
        {
            input: {
                method: paymentMethodCode,
                metadata,
            },
        },
        { token, useAuthToken: true }
    );

    if (result.data.addPaymentToOrder.__typename !== 'Order') {
        const errorResult = result.data.addPaymentToOrder;
        throw new Error(
            `Failed to place order: ${errorResult.errorCode} - ${errorResult.message}`
        );
    }

    const orderCode = result.data.addPaymentToOrder.code;

    // Update the cart tag to immediately invalidate cached cart data
    // After placing the order, remove items from the active cart
    try {
        const activeOrderRes = await query(GetActiveOrderQuery, {}, { token, useAuthToken: true });
        const activeOrder = activeOrderRes.data.activeOrder;
        if (activeOrder && activeOrder.lines && activeOrder.lines.length > 0) {
            for (const line of activeOrder.lines) {
                try {
                    await mutate(RemoveFromCartMutation, { lineId: line.id }, { token, useAuthToken: true });
                } catch (err) {
                    // ignore individual removal errors
                    console.error('Failed to remove cart line', line.id, err);
                }
            }
        }
    } catch (err) {
        console.error('Failed to clear cart after order placement', err);
    }

    updateTag('cart');
    updateTag('active-order');

    redirect(`/order-confirmation/${orderCode}`);
}

export async function getPaymentSignature(amountInCents: number, paymentReference: string) {
    await requireClerkAuth();
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;

    const signature = await query(GetWompiSignatureQuery, {
        amountInCents: amountInCents!,
        paymentReference: paymentReference
    }, {
        token
    })

    return signature.data.GetPaymentSignature;
}
