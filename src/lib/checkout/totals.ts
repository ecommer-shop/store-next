export interface DiscountAmount {
    amountWithTax: number;
}

export function totalDiscountAmout(discounts?: DiscountAmount[] | null): number {
    return (discounts ?? []).reduce((sum: number, d: DiscountAmount) => sum + (d.amountWithTax ?? 0), 0);
}

export function discountedTotal(
    subtotalWithTax: number,
    shippingWithTax: number,
    discounts?: DiscountAmount[] | null,
): number {
    return subtotalWithTax + shippingWithTax - Math.abs(totalDiscountAmout(discounts));
}