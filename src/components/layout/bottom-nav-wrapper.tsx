export const dynamic = 'force-dynamic';

import { BottomNav } from './bottom-nav';
import { getAuthToken } from '@/lib/vendure/server/auth';
import { getActiveOrderQueryForCart } from './navbar/navbar-cart/actions';

export async function BottomNavWrapper() {
  const token = await getAuthToken();
  let cart = await getActiveOrderQueryForCart(token);
  const cartItemCount = cart?.data.activeOrder?.totalQuantity || 0;

  return <BottomNav cartItemCount={cartItemCount} />;
}
