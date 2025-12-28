import {cacheLife, cacheTag, unstable_cache} from 'next/cache';
import {CartIcon} from './cart-icon';
import {query} from '@/lib/vendure/server/api';
import {GetActiveOrderQuery} from '@/lib/vendure/shared/queries';

export const NavbarCart = () =>
    unstable_cache( 
        async () => {
            const orderResult = await query(GetActiveOrderQuery, undefined, {
                useAuthToken: true,
                tags: ['cart'],
            });

            const cartItemCount = orderResult.data.activeOrder?.totalQuantity || 0;

            return <CartIcon cartItemCount={cartItemCount} />;
        },
        ["cart", "active-order"],
        {
            revalidate: 60 * 60
        }
    /*'use cache: private';
    cacheLife('minutes');
    cacheTag('cart');
    cacheTag('active-order');*/

    
)()
