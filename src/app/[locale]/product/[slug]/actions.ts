'use server';

import { mutate } from '@/lib/vendure/server/api';
import { AddToCartMutation } from '@/lib/vendure/shared/mutations';
import { updateTag } from 'next/cache';
import { setAuthToken, getAuthToken, getAuthTokenFromCookies } from '@/lib/vendure/server/auth';
import { cookies } from 'next/headers';


export async function addToCart(variantId: string, quantity: number = 1) {
  try {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!

    const result = await mutate(AddToCartMutation, { variantId, quantity }, { token, useAuthToken: true });
    
    // Only store the auth token if we don't have one yet (new session)
    const existingToken = await getAuthToken();
    if (result.token && !existingToken) {
      await setAuthToken(result.token);
    }

    if (result.data.addItemToOrder.__typename === 'Order') {
      // Revalidate cart data across all pages
      updateTag('cart');
      updateTag('active-order');
      return { success: true, order: result.data.addItemToOrder };
    } else {
      return { success: false, error: result.data.addItemToOrder.message };
    }
  } catch {
    return { success: false, error: 'Failed to add item to cart' };
  }
}
