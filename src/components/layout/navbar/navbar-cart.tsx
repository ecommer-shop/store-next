export const dynamic = 'force-dynamic';

import {cacheLife, cacheTag, unstable_cache} from 'next/cache';
import {CartIcon} from './cart-icon';
import {query} from '@/lib/vendure/server/api';
import {GetActiveOrderQuery} from '@/lib/vendure/shared/queries';
import { getAuthToken } from '@/lib/vendure/server/auth';

export async function NavbarCart() {
    const token = await getAuthToken();

    const cart = token
    ? await query(GetActiveOrderQuery, {}, {
                useAuthToken: true,
                tags: ['cart'],
            }) : null;

    const cartItemCount = cart?.data.activeOrder?.totalQuantity || 0;

    return <CartIcon cartItemCount={cartItemCount} />;
}
