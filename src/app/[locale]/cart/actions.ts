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

export async function adjustQuantity(lineId: string, quantity: number) {
    await mutate(AdjustCartItemMutation, {lineId, quantity}, {token: (await token()), useAuthToken: true});
    updateTag('cart');
}

export async function applyPromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    const res = await mutate(ApplyPromotionCodeMutation, {couponCode: code}, {token: (await token()), useAuthToken: true});
    console.log({res: res.data.applyCouponCode})
    updateTag('cart');
}

export async function removePromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    const res = await mutate(RemovePromotionCodeMutation, {couponCode: code}, {token: (await token()), useAuthToken: true});
    console.log({removeRes: res.data.removeCouponCode});
    updateTag('cart');
}
