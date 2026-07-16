'use server';

import { mutate, query } from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies, requireClerkAuth } from '@/lib/vendure/server/auth';
import {
    GetMySubscriptionQuery,
    GetAllPlansQuery,
    GetWompiSignatureQuery,
} from '@/lib/vendure/shared/queries';
import {
    CreateSubscriptionMutation,
    CreatePendingSubscriptionMutation,
    StopAutoRenewMutation,
    CancelSubscriptionMutation,
} from '@/lib/vendure/shared/mutations';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const token = async () => {
    await requireClerkAuth();
    const cookiesStore = await cookies();
    return getAuthTokenFromCookies(cookiesStore)!;
};

export async function getMySubscription() {
    const result = await query(
        GetMySubscriptionQuery,
        {},
        { token: (await token()), useAuthToken: true }
    );
    return result.data.mySubscription;
}

export async function getAllPlans() {
    const result = await query(
        GetAllPlansQuery,
        {},
        { token: (await token()), useAuthToken: true }
    );
    return result.data.allPlans;
}

export async function createSubscription(tokenStr: string, planId: number, paymentMethod: string) {
    const result = await mutate(
        CreateSubscriptionMutation,
        { token: tokenStr, planId, paymentMethod },
        { token: (await token()), useAuthToken: true }
    );

    if (!result.data.createSubscriptionWithPayment) {
        throw new Error('Failed to create subscription');
    }

    revalidatePath('/account/billing');
    return result.data.createSubscriptionWithPayment;
}

export async function createPendingPayment(planId: number, paymentMethod: string) {
    const result = await mutate(
        CreatePendingSubscriptionMutation,
        { planId, paymentMethod },
        { token: (await token()), useAuthToken: true }
    );

    if (!result.data.createPendingSubscription) {
        throw new Error('Failed to create pending subscription');
    }

    revalidatePath('/account/billing');
    return result.data.createPendingSubscription;
}

export async function stopAutoRenew(subscriptionId: number) {
    const result = await mutate(
        StopAutoRenewMutation,
        { subscriptionId },
        { token: (await token()), useAuthToken: true }
    );

    if (!result.data.stopAutoRenew) {
        throw new Error('Failed to stop auto-renew');
    }

    revalidatePath('/account/billing');
    return result.data.stopAutoRenew;
}

export async function cancelSubscription(subscriptionId: number) {
    const result = await mutate(
        CancelSubscriptionMutation,
        { subscriptionId },
        { token: (await token()), useAuthToken: true }
    );

    if (!result.data.cancelSubscription) {
        throw new Error('Failed to cancel subscription');
    }

    revalidatePath('/account/billing');
    return result.data.cancelSubscription;
}

export async function getPaymentSignature(amountInCents: number, paymentReference: string) {
    const result = await query(
        GetWompiSignatureQuery,
        { amountInCents, paymentReference },
        { token: (await token()) }
    );
    return result.data.GetPaymentSignature;
}
