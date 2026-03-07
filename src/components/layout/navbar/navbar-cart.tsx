export const dynamic = 'force-dynamic';
import {CartIcon} from './cart-icon';
import {query} from '@/lib/vendure/server/api';
import {GetActiveOrderQuery} from '@/lib/vendure/shared/queries';
import { getAuthToken } from '@/lib/vendure/server/auth';

export async function NavbarCart() {
    const token = await getAuthToken();

    let cart = null;

    if (token) {
        try {
            cart = await query(
                GetActiveOrderQuery,
                {},
                {
                    useAuthToken: true,
                    tags: ['cart'],
                }
            );
        } catch (err) {
            // Fallback to default language if the current locale lacks translations
            cart = await query(
                GetActiveOrderQuery,
                {},
                {
                    useAuthToken: true,
                    tags: ['cart'],
                    languageCode: 'en',
                }
            );
        }
    }

    const cartItemCount = cart?.data.activeOrder?.totalQuantity || 0;

    return <CartIcon cartItemCount={cartItemCount} />;
}
