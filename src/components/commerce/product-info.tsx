'use client';
import {useState, useMemo, useTransition} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {RadioGroup, Label, Button, Radio} from '@heroui/react';
import {ShoppingCart, CheckCircle2} from 'lucide-react';
import {addToCart} from '@/app/[locale]/product/[slug]/actions';
import {toast} from 'sonner';
import {Price} from '@/components/commerce/price';
import clsx from "clsx";

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
}

export function ProductInfo({product, searchParams}: ProductInfoProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);

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
            router.push(`${pathname}?${params.toString()}`, {scroll: false});
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        startTransition(async () => {
            const result = await addToCart(selectedVariant.id, 1);

            if (result.success) {
                setIsAdded(true);
                toast.success('Added to cart', {
                    description: `${product.name} has been added to your cart`,
                });

                // Reset the added state after 2 seconds
                setTimeout(() => setIsAdded(false), 2000);
            } else {
                toast.error('Error', {
                    description: result.error || 'Failed to add item to cart',
                });
            }
        });
    };

    const isInStock = selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK';
    const canAddToCart = selectedVariant && isInStock;

    return (
        <div className="space-y-6">
            {/* Product Title */}
            <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {selectedVariant && (
                    <p className="text-2xl font-bold mt-2">
                        <Price value={selectedVariant.priceWithTax}/>
                    </p>
                )}
            </div>

            {/* Product Description */}
            <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{__html: product.description}}/>
                
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
                                isOnSurface
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

            {/* Stock Status */}
            {selectedVariant && (
                <div className="text-sm">
                    {isInStock ? (
                        <span className="text-green-600 font-semibold">In Stock</span>
                    ) : (
                        <span className="text-destructive font-semibold">Out of Stock</span>
                    )}
                </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-4">
                <Button
                    size="lg"
                    variant='ghost'
                    className="w-full hover:bg-[#6BB8FF] dark:hover:bg-[#9969F8]"
                    isDisabled={!canAddToCart || isPending}
                    onClick={handleAddToCart}
                >
                    {isAdded ? (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5"/>
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-5 w-5"/>
                            {isPending
                                ? 'Adding...'
                                : !selectedVariant && product.optionGroups.length > 0
                                    ? 'Select Options'
                                    : !isInStock
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                        </>
                    )}
                </Button>
            </div>

            {/* SKU */}
            {selectedVariant && (
                <div className="text-xs text-foreground">
                    SKU: {selectedVariant.sku}
                </div>
            )}
        </div>
    );
}
