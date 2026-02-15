import { CartItems } from "@/app/[locale]/cart/cart-items";
import { OrderSummary } from "@/app/[locale]/cart/order-summary";
import { PromotionCode } from "@/app/[locale]/cart/promotion-code";
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

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <CartItems activeOrder={activeOrder} />

            <div className="lg:col-span-1">
                <OrderSummary activeOrder={activeOrder} />
                <PromotionCode activeOrder={activeOrder} />
            </div>
        </div>
    )
}