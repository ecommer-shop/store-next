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

    let initialSelectedIds: string[] = activeOrder.lines.map(l => l.id);
    try {
        const unselectedCookie = cookieStore.get(`unselectedLines_${activeOrder.id}`);
        const selectedCookie = cookieStore.get(`selectedLines_${activeOrder.id}`);
        
        if (unselectedCookie && unselectedCookie.value) {
            const unselected = JSON.parse(decodeURIComponent(unselectedCookie.value));
            if (Array.isArray(unselected)) {
                initialSelectedIds = activeOrder.lines.map(l => l.id).filter(id => !unselected.includes(id));
            }
        } else if (selectedCookie && selectedCookie.value) {
            const selected = JSON.parse(decodeURIComponent(selectedCookie.value));
            if (Array.isArray(selected)) {
                 // Migrate: we take whatever was selected, and assume everything else is newly unselected? 
                 // No! If there is no unselectedCookie, it means they might have unselected things in the past.
                 // But wait, if they did, the old system ONLY tracked `selectedLines`.
                 // So we can fallback to the old system's array for backwards compatibility.
                 // Wait, if they add a new item, it wouldn't be in `selected`, but we want it checked!
                 // So we should assume that anything not in `selected` AND not in `activeOrder` from before is new.
                 // This is too hard without knowing the previous order state. 
                 // Let's just use `selected` to initialize, next time `unselected` will be written.
                 // Wait, if it's an existing cart, newly added items wouldn't be checked. 
                 // However, since we want "always checked by default", if we just ignore the old `selectedCookie` they will just have to uncheck things again once. It's a minor inconvenience for a proper fix. Let's merge: checked = (old selected) + (any new items). But we don't know what's new.
                 // Actually, let's just initialize using `selected` for backwards compatibility, but from now on we use `unselected`.
                 initialSelectedIds = selected;
                 
                 // Wait! What if we add any IDs that are NOT in `selected` AND we assume they are new? We can't know.
                 // Let's just use `selected` if it exists and `unselected` does not.
            }
        }
    } catch (e) {
        // Fallback to all selected
    }

    return (
        <SelectedItemsProvider orderId={activeOrder.id} initialSelectedIds={initialSelectedIds} allLineIds={activeOrder.lines.map(l => l.id)}>
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