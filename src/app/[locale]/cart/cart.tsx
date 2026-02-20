import { CartItems } from "@/app/[locale]/cart/cart-items";
import { OrderSummary } from "@/app/[locale]/cart/order-summary";
import { PromotionCode } from "@/app/[locale]/cart/promotion-code";
import { SelectedItemsProvider } from "@/app/[locale]/cart/selected-items-context";
import { query } from "@/lib/vendure/server/api";
import { getAuthToken, getAuthTokenFromCookies } from "@/lib/vendure/server/auth";
import { GetActiveOrderQuery } from "@/lib/vendure/shared/queries";
import { cookies } from "next/headers";

export async function Cart() {
    const cookieStore = await cookies()
    const token = getAuthTokenFromCookies(cookieStore)!
    const { data } = await query(GetActiveOrderQuery, {}, {
        token,
        useAuthToken: true,
    });

    const activeOrder = data.activeOrder;

    // Handle empty cart case
    if (!activeOrder || activeOrder.lines.length === 0) {
        return <CartItems activeOrder={null} />;
    }

    let initialSelectedIds: string[] | null = null;
    try {
        const cookie = cookieStore.get(`selectedLines_${activeOrder.id}`);
        if (cookie && cookie.value) {
            initialSelectedIds = JSON.parse(decodeURIComponent(cookie.value));
        }
    } catch (e) {
        initialSelectedIds = null;
    }

    return (
        <SelectedItemsProvider orderId={activeOrder.id} initialSelectedIds={initialSelectedIds}>
          <div className="grid lg:grid-cols-3 gap-8">
              <CartItems activeOrder={activeOrder} />

              <div className="lg:col-span-1">
                  <OrderSummary activeOrder={activeOrder} />
                  <PromotionCode activeOrder={activeOrder} />
              </div>
          </div>
        </SelectedItemsProvider>
    )
}