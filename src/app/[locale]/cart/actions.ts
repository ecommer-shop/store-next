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

export async function applyPromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    const res = await mutate(ApplyPromotionCodeMutation, {couponCode: code}, {token: (await token()), useAuthToken: true});
    updateTag('cart');
}

export async function removePromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    const res = await mutate(RemovePromotionCodeMutation, {couponCode: code}, {token: (await token()), useAuthToken: true});
    updateTag('cart');
}
