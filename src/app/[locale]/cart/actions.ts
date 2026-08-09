'use server';

import {mutate} from '@/lib/vendure/server/api';
import { getAuthToken } from '@/lib/vendure/server/auth';
import {
    RemoveFromCartMutation,
    AdjustCartItemMutation,
    ApplyPromotionCodeMutation,
    RemovePromotionCodeMutation
} from '@/lib/vendure/shared/mutations';
import {updateTag} from 'next/cache';
const token = async () => {
    const t = await getAuthToken();
    return t!
}
export async function removeFromCart(lineId: string) {
    await mutate(RemoveFromCartMutation, {lineId}, {token: (await token()), useAuthToken: true});
    updateTag('cart');
}

export async function adjustQuantity(lineId: string, quantity: number): Promise<{ actualQuantity: number }> {
    const result = await mutate(AdjustCartItemMutation, {lineId, quantity}, {token: (await token()), useAuthToken: true});
    updateTag('cart');
    // Return the actual quantity Vendure set (may be capped by stock)
    const lines: any[] = (result?.data as any)?.adjustOrderLine?.lines ?? [];
    const line = lines.find((l: any) => l.id === lineId);
    return { actualQuantity: line?.quantity ?? quantity };
}

export type ApplyPromotionCodeState = {
    success: boolean;
    reason?: 'invalid' | 'expired' | 'limit' | 'network';
    message?: string;
    limit?: number | null;
};

export async function applyPromotionCode(
    _prevState: ApplyPromotionCodeState | null,
    formData: FormData,
): Promise<ApplyPromotionCodeState> {
    const code = formData.get('code') as string;
    if (!code) return {success: false};

    try {
        const res = await mutate(ApplyPromotionCodeMutation, {couponCode: code}, {token: (await token()), useAuthToken: true});
        updateTag('cart');

        const result = (res.data as any)?.applyCouponCode as
            | { __typename: string; message?: string; limit?: number | null }
            | undefined;

        switch (result?.__typename) {
            case 'CouponCodeInvalidError':
                return {success: false, reason: 'invalid', message: result.message};
            case 'CouponCodeExpiredError':
                return {success: false, reason: 'expired', message: result.message};
            case 'CouponCodeLimitError':
                return {success: false, reason: 'limit', message: result.message, limit: result.limit};
            default:
                return {success: true};
        }
    } catch (error) {
        return {
            success: false,
            reason: 'network',
            message: error instanceof Error ? error.message : 'Network error',
        };
    }
}

export async function removePromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    await mutate(RemovePromotionCodeMutation, {couponCode: code}, {token: (await token()), useAuthToken: true});
    updateTag('cart');
}
