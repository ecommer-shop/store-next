'use client';
import {useState, useMemo, useEffect} from 'react';
import { trackViewItem, trackAddToCart } from '@/lib/analytics/events';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import NextLink from 'next/link';
import {RadioGroup, Label, Button, Radio, toast} from '@heroui/react';
import {ShoppingCart, CheckCircle2, Share2, Download} from 'lucide-react';
import {addToCart, checkProductInCart} from '@/app/[locale]/product/[slug]/actions';
import {Price} from '@/components/commerce/price';
import {ContinueShoppingButton} from '@/components/commerce/continue-shopping-button';
import clsx from "clsx";
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { GetProductVariantStock } from './actions';
import { ProductInfoStockStatus, STOCK_STATUS_COLORS } from './constants';
import { trackClickSellerProfile, trackShareProduct } from '@/lib/analytics/events';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        description: string;
        variants: Array<{
            id: string;
            name: string;
            sku: string;
            priceWithTax: number;
            stockLevel: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
                groupId: string;
                group: {
                    id: string;
                    code: string;
                    name: string;
                };
            }>;
        }>;
        optionGroups: Array<{
            id: string;
            code: string;
            name: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
            }>;
        }>;
    };
    searchParams: { [key: string]: string | string[] | undefined };
    storeLink?: { name: string; href: string };
    productImageUrl?: string | null;
}

export function ProductInfo({ product, searchParams, storeLink, productImageUrl }: ProductInfoProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [showGoToCart, setShowGoToCart] = useState(false);
    const t = useTranslations('Commerce');

    useEffect(() => {
        checkProductInCart(product.id).then((isInCart) => {
            if (isInCart) {
                setShowGoToCart(true);
            }
        });
    }, [product.id]);

    useEffect(() => {
        const variant = selectedVariant ?? product.variants[0];
        if (variant) {
            trackViewItem({ item_id: variant.id, item_name: product.name, price: variant.priceWithTax, seller_name: storeLink?.name });
        }
    }, [product.id]);

    // Initialize selected options from URL
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {};

        // Load from URL search params
        product.optionGroups.forEach((group) => {
            const paramValue = searchParams[group.code];
            if (typeof paramValue === 'string') {
                // Find the option by code
                const option = group.options.find((opt) => opt.code === paramValue);
                if (option) {
                    initialOptions[group.id] = option.id;
                }
            }
        });

        return initialOptions;
    });

    // Find the matching variant based on selected options
    const selectedVariant = useMemo(() => {
        if (product.variants.length === 1) {
            return product.variants[0];
        }

        // If not all option groups have a selection, return null
        if (Object.keys(selectedOptions).length !== product.optionGroups.length) {
            return null;
        }

        // Find variant that matches all selected options
        return product.variants.find((variant) => {
            const variantOptionIds = variant.options.map((opt) => opt.id);
            const selectedOptionIds = Object.values(selectedOptions);
            return selectedOptionIds.every((optId) => variantOptionIds.includes(optId));
        });
    }, [selectedOptions, product.variants, product.optionGroups]);

    const handleOptionChange = (groupId: string, optionId: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupId]: optionId,
        }));

        // Find the option group and option to get their codes
        const group = product.optionGroups.find((g) => g.id === groupId);
        const option = group?.options.find((opt) => opt.id === optionId);

        if (group && option) {
            // Update URL with option code
            const params = new URLSearchParams(currentSearchParams);
            params.set(group.code, option.code);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            setIsAdded(true)
            return;
        }

        setIsAdding(true);
        try {
            const result = await addToCart(selectedVariant.id, 1);

            if (result.success) {
                trackAddToCart({ item_id: selectedVariant.id, item_name: product.name, price: selectedVariant.priceWithTax, seller_name: storeLink?.name });
                setIsAdded(true);
                setShowGoToCart(true);
                toast.success(t(I18N.Commerce.productInfo.toast.addedTitle), {
                    actionProps: {
                        children: "Ir al carrito",
                        className: "text-foreground bg-success",
                        onPress: () => {
                            router.push('/cart')
                            toast.clear()
                        },

                    },
                    description: t(I18N.Commerce.productInfo.toast.addedDescription, { product: product.name }),
                });

                // Reset the added state after 2 seconds
                setTimeout(() => setIsAdded(false), 2000);
            } else {
                toast.danger(t(I18N.Commerce.productInfo.toast.errorTitle), {
                    description: result.error || t(I18N.Commerce.productInfo.toast.errorDescription),
                });
            }
        } catch {
            toast.danger(t(I18N.Commerce.productInfo.toast.errorTitle), {
                description: t(I18N.Commerce.productInfo.toast.errorDescription),
            });
        } finally {
            setIsAdding(false);
        }
    };
    const isInStock = selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK';
    const canAddToCart = selectedVariant && isInStock;

    const stockStatus = selectedVariant?.stockLevel as ProductInfoStockStatus;
    const statusColorClass = STOCK_STATUS_COLORS[stockStatus] || "text-muted-foreground";
    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: t(I18N.Commerce.productInfo.shareText),
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                trackShareProduct({ item_id: product.id, share_method: 'WebShareAPI' });
                toast.success(t(I18N.Commerce.productInfo.toast.shareSuccess));
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error al compartir:', error);
                    toast.danger(t(I18N.Commerce.productInfo.toast.shareError));
                }
            }
        }
    };

    const handleDownloadQR = () => {
        const params = new URLSearchParams({ slug: product.name });
        // usar slug del producto desde la URL actual
        const slugFromUrl = window.location.pathname.split('/').pop() ?? '';
        const url = `/api/product-qr?slug=${slugFromUrl}${productImageUrl ? `&image=${encodeURIComponent(productImageUrl)}` : ''}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `producto-${slugFromUrl}.png`;
        a.click();
    };

    return (
        <div className="space-y-5">
            {/* ── Nombre + precio ── */}
            <div className="pb-4" style={{ borderBottom: '1px solid rgba(107,184,255,0.2)' }}>
                <h1 className="text-2xl font-extrabold text-foreground leading-snug">{product.name}</h1>
                {selectedVariant && (
                    <p className="text-3xl font-black mt-2" style={{ color: '#12123F' }}>
                        <span className="dark:text-white"><Price value={selectedVariant.priceWithTax} /></span>
                    </p>
                )}
            </div>

            {/* ── Descripción ── */}
            <div className="prose prose-sm max-w-none text-muted-foreground">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Option Groups */}
            {product.optionGroups.length > 0 && (
                <div className="flex w-full flex-col items-start gap-10"
                    style={{
                        // @ts-expect-error - Overrides default variables
                        "--accent": "#6BB8FF",
                        "--accent-foreground": "#fff",
                        "--accent-hover": "#F1F1F1",
                        "--border-width": "2px",
                        "--border-width-field": "2px",
                        "--focus": "#6BB8FF",
                    }}>
                    {product.optionGroups.map((group) => (
                        <section key={group.id} className="flex w-full max-w-lg flex-col gap-4">
                            <RadioGroup
                                value={selectedOptions[group.id] || ''}
                                onChange={(value) => handleOptionChange(group.id, value)}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <Label className="text-base font-semibold">
                                        {group.name}
                                    </Label>
                                </div>
                                <div className="grid gap-x-4 md:grid-cols-2">
                                    {group.options.map((option) => (
                                        <div key={option.id}>
                                            <Radio
                                                value={option.id}
                                                id={option.id}
                                                className={clsx(
                                                    "group relative flex-col gap-4 rounded-xl border border-transparent bg-surface px-5 py-4 transition-all",
                                                    "data-[selected=true]:border-accent data-[selected=true]:bg-accent/10")}
                                            >
                                                <Radio.Control className="absolute top-3 right-4 size-5">
                                                    <Radio.Indicator />
                                                </Radio.Control>
                                                <Radio.Content className="flex flex-row items-start justify-start gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <Label
                                                            htmlFor={option.id}
                                                        >
                                                            {option.name}
                                                        </Label>
                                                    </div>
                                                </Radio.Content>
                                            </Radio>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </section>
                    ))}
                </div>
            )}

            {/* ── Stock Status ── */}
            {selectedVariant && stockStatus && (
                <div className="text-sm">
                    <span className={`${statusColorClass} font-semibold`}>
                        {t(I18N.Commerce.productInfo[stockStatus])}
                    </span>
                </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
                {/* Botón principal */}
                <Button
                    size="lg"
                    variant='primary'
                    className="w-full font-bold rounded-xl text-white"
                    style={canAddToCart ? { background: 'linear-gradient(90deg, #12123F, #1a1a5e)' } : {}}
                    isDisabled={!canAddToCart || isAdding}
                    onPress={handleAddToCart}
                >
                    {isAdding ? (
                        <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            {t(I18N.Commerce.productInfo.adding)}
                        </>
                    ) : isAdded ? (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            {t(I18N.Commerce.productInfo.addedToCart)}
                        </>
                    ) : !selectedVariant && product.optionGroups.length > 0 ? (
                        <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {t(I18N.Commerce.productInfo.selectOptions)}
                        </>
                    ) : !isInStock ? (
                        <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {t(I18N.Commerce.productInfo.OUT_OF_STOCK)}
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {t(I18N.Commerce.productInfo.addToCart)}
                        </>
                    )}
                </Button>

                {showGoToCart && (
                    <div className="flex flex-row gap-2 w-full">
                        <ContinueShoppingButton size="lg" className="flex-1 min-w-0" />
                        <Button
                            size="lg"
                            variant="primary"
                            className="flex-1 min-w-0 rounded-xl font-bold text-white"
                            style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
                            onPress={() => router.push('/cart')}
                        >
                            Ir al carrito
                        </Button>
                    </div>
                )}

                {/* Botones secundarios */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-muted-foreground rounded-xl"
                        onPress={handleShare}
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        {t(I18N.Commerce.productInfo.shareProduct)}
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-muted-foreground rounded-xl"
                        onPress={handleDownloadQR}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar QR
                    </Button>
                </div>
            </div>

            {/* ── ID/REFERENCIA + Tienda ── */}
            {(selectedVariant || storeLink) && (
                <div
                    className="space-y-1 text-xs text-muted-foreground pt-3"
                    style={{ borderTop: '1px solid rgba(107,184,255,0.2)' }}
                >
                    {selectedVariant && (
                        <div>
                            ID/REFERENCIA: <span className="font-medium">{selectedVariant.sku}</span>
                        </div>
                    )}
                    {storeLink && (
                        <div>
                            {t(I18N.Commerce.productInfo.storeLabel)}:{` `}
                            <NextLink
                                href={storeLink.href}
                                onClick={() => trackClickSellerProfile({ seller_name: storeLink.name })}
                                className="font-semibold underline underline-offset-2"
                                style={{ color: '#6BB8FF' }}
                            >
                                {storeLink.name}
                            </NextLink>
                        </div>
                    )}
                </div>
            )}

            {/* ── Invitación a calificar ── */}
            <div
                className="flex items-start gap-3 p-4 rounded-2xl mt-2"
                style={{
                    background: 'linear-gradient(135deg, rgba(107,184,255,0.08) 0%, rgba(153,105,248,0.08) 100%)',
                    border: '1px solid rgba(153,105,248,0.25)',
                }}
            >
                <span className="text-2xl select-none">⭐</span>
                <div>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                        ¿Ya tienes este producto?
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Tu opinión importa. Comparte tu experiencia y ayuda a otros compradores a elegir con confianza.
                    </p>
                </div>
            </div>
        </div>
    );
}
