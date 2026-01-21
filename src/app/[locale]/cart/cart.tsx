import {CartItems} from "@/app/[locale]/cart/cart-items";
import {OrderSummary} from "@/app/[locale]/cart/order-summary";
import {PromotionCode} from "@/app/[locale]/cart/promotion-code";
import {query} from "@/lib/vendure/server/api";
import {GetActiveOrderQuery} from "@/lib/vendure/shared/queries";

export async function Cart() {

    const {data} = await query(GetActiveOrderQuery, {}, {
        useAuthToken: true,
    });

    const activeOrder = data.activeOrder;

    // Handle empty cart case
    if (!activeOrder || activeOrder.lines.length === 0) {
        return <CartItems activeOrder={null}/>;
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <CartItems activeOrder={activeOrder}/>

            <div className="lg:col-span-1">
                <OrderSummary activeOrder={activeOrder}/>
                <PromotionCode activeOrder={activeOrder}/>
            </div>
        </div>
    )
}