export const dynamic = 'force-dynamic';
import {CartIcon} from '../cart-icon';
import { getAuthToken } from '@/lib/vendure/server/auth';
import { getActiveOrderQueryForCart } from './actions';

export async function NavbarCart() {
    const token = await getAuthToken();

    let cart = await getActiveOrderQueryForCart(token);

    const cartItemCount = cart?.data.activeOrder?.totalQuantity || 0;

    return <CartIcon cartItemCount={cartItemCount} />;
}
