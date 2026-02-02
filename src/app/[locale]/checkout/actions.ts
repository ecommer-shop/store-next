'use server';

import { mutate, query } from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies } from '@/lib/vendure/server/auth';
import {
    SetOrderShippingAddressMutation,
    SetOrderBillingAddressMutation,
    SetOrderShippingMethodMutation,
    AddPaymentToOrderMutation,
    CreateCustomerAddressMutation,
    TransitionOrderToStateMutation,
} from '@/lib/vendure/shared/mutations';
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
}



export async function setShippingAddress(
    shippingAddress: AddressInput,
    useSameForBilling: boolean
) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const shippingResult = await mutate(
        SetOrderShippingAddressMutation,
        { input: shippingAddress },
        { token, useAuthToken: true }
    );

    if (shippingResult.data.setOrderShippingAddress.__typename !== 'Order') {
        throw new Error('Failed to set shipping address');
    }

    if (useSameForBilling) {
        await mutate(
            SetOrderBillingAddressMutation,
            { input: shippingAddress },
            { token, useAuthToken: true }
        );
    }

    revalidatePath('/checkout');
}

export async function setShippingMethod(shippingMethodId: string) {
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

export async function createCustomerAddress(address: AddressInput) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const result = await mutate(
        CreateCustomerAddressMutation,
        { input: address },
        { token, useAuthToken: true }
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create customer address');
    }

    revalidatePath('/checkout');
    return result.data.createCustomerAddress;
}

export async function transitionToArrangingPayment() {
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

export async function placeOrder(paymentMethodCode: string) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
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
    updateTag('cart');
    updateTag('active-order');

    redirect(`/order-confirmation/${orderCode}`);
}

export async function getPaymentSignature(amountInCents: number) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;

    const signature = await query(GetWompiSignatureQuery, {
        amountInCents: amountInCents!
    }, {
        token
    })

    return signature.data.GetPaymentSignature;
}
