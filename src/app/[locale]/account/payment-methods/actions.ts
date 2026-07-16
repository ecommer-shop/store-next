'use server';

import { cookies } from 'next/headers';
import { query, mutate } from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies } from '@/lib/vendure/server/auth';
import { SavedPaymentMethodsQuery } from '@/lib/vendure/shared/queries';
import { DeleteSavedPaymentMethodMutation, SetDefaultPaymentMethodMutation } from '@/lib/vendure/shared/mutations';
export async function getSavedPaymentMethods() {
    const cookiesStore = await cookies();
    const token = getAuthTokenFromCookies(cookiesStore);
    
    if (!token) {
        return [];
    }

    try {
        const result = await query(SavedPaymentMethodsQuery, {}, { token, useAuthToken: true });
        return result.data?.savedPaymentMethods || [];
    } catch (error) {
        console.error('Error fetching saved payment methods:', error);
        return [];
    }
}

export async function deleteSavedPaymentMethod(id: string) {
    const cookiesStore = await cookies();
    const token = getAuthTokenFromCookies(cookiesStore);
    
    if (!token) {
        return false;
    }

    try {
        const result: any = await mutate(DeleteSavedPaymentMethodMutation, { id }, { token, useAuthToken: true });
        return result.data?.deleteSavedPaymentMethod?.success || false;
    } catch (error) {
        console.error('Error deleting saved payment method:', error);
        return false;
    }
}

export async function setDefaultPaymentMethod(id: string) {
    const cookiesStore = await cookies();
    const token = getAuthTokenFromCookies(cookiesStore);
    
    if (!token) {
        return null;
    }

    try {
        const result: any = await mutate(SetDefaultPaymentMethodMutation, { id }, { token, useAuthToken: true });
        return result.data?.setDefaultPaymentMethod || null;
    } catch (error) {
        console.error('Error setting default payment method:', error);
        return null;
    }
}
