import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Price } from '@/components/commerce/price';
import { removeFromCart } from './actions';
import { Button } from '@heroui/react';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';
import SelectLineCheckbox from './select-line-checkbox';
import { QuantityStepper } from './quantity-stepper';

type ActiveOrder = {
    id: string;
    currencyCode: string;
    lines: Array<{
        id: string;
        quantity: number;
        unitPriceWithTax: number;
        linePriceWithTax: number;
        productVariant: {
            id: string;
            name: string;
            sku: string;
            product: {
                name: string;
                slug: string;
                featuredAsset?: {
                    preview: string;
                } | null;
            };
        };
    }>;
};

export async function CartItems({ activeOrder }: { activeOrder: ActiveOrder | null }) {
    const t = await getTranslations('Cart');

    if (!activeOrder || activeOrder.lines.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
                    <ShoppingCart className="w-9 h-9 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t(I18N.Cart.empty.title)}</h2>
                <p className="text-muted-foreground mb-6 max-w-xs">
                    {t(I18N.Cart.empty.description)}
                </p>
                <Link
                    href="/search"
                    className="inline-flex items-center justify-center rounded-xl bg-[#9969F8] text-white font-semibold px-6 py-3 hover:opacity-90 transition"
                >
                    {t(I18N.Cart.empty.continueShopping)}
                </Link>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 space-y-3">
            {activeOrder.lines.map((line) => (
                <div
                    key={line.id}
                    className="relative flex gap-3 p-3 sm:p-4 border border-border rounded-2xl bg-card shadow-sm"
                >
                    {/* Checkbox — top-left, overlapping image */}
                    <div className="absolute top-3 left-3 z-10">
                        <SelectLineCheckbox lineId={line.id} />
                    </div>

                    {/* Product image */}
                    <Link
                        href={`/product/${line.productVariant.product.slug}`}
                        className="flex-shrink-0 mt-1"
                    >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted border border-border">
                            {line.productVariant.product.featuredAsset ? (
                                <Image
                                    src={line.productVariant.product.featuredAsset.preview}
                                    alt={line.productVariant.name}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                        {/* Top row: name + line price */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1 pl-5 sm:pl-0">
                                <Link
                                    href={`/product/${line.productVariant.product.slug}`}
                                    className="font-semibold text-sm leading-tight hover:underline line-clamp-2 text-foreground"
                                >
                                    {line.productVariant.product.name}
                                </Link>
                                {line.productVariant.name !== line.productVariant.product.name && (
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                        {line.productVariant.name}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    SKU: {line.productVariant.sku}
                                </p>
                            </div>

                            {/* Line total — always visible */}
                            <div className="flex-shrink-0 text-right">
                                <p className="font-bold text-base text-foreground">
                                    <Price value={line.linePriceWithTax} currencyCode={activeOrder.currencyCode} />
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    <Price value={line.unitPriceWithTax} currencyCode={activeOrder.currencyCode} /> {t(I18N.Cart.items.each)}
                                </p>
                            </div>
                        </div>

                        {/* Bottom row: stepper + delete */}
                        <div className="flex items-center justify-between gap-2">
                            <QuantityStepper lineId={line.id} quantity={line.quantity} />

                            <form
                                action={async () => {
                                    'use server';
                                    await removeFromCart(line.id);
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border hover:border-red-500/30 transition-all p-0"
                                    aria-label={t(I18N.Cart.items.remove)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
