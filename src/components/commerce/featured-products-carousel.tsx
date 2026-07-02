'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FragmentOf, readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import { Price } from '@/components/commerce/price';
import { normalizeVendureAssetUrl } from '@/lib/vendure/shared/asset-url';

interface FeaturedProductsCarouselProps {
    products: Array<FragmentOf<typeof ProductCardFragment>>;
}

export function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!products || products.length === 0) {
        return null;
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    const product = readFragment(ProductCardFragment, products[currentIndex]);
    const previewSrc = normalizeVendureAssetUrl(product.productAsset?.preview) ?? '';

    return (
        <div className="relative rounded-2xl border border-[#12123F]/10 dark:border-[#F1F1F1]/15 bg-background overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
                <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {previewSrc ? (
                        <Image
                            src={previewSrc}
                            alt={product.productName}
                            fill
                            className="object-cover"
                            sizes="192px"
                            unoptimized
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                            Sin imagen
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-foreground">{product.productName}</h3>
                    <p className="text-lg font-semibold text-[#6BB8FF]">
                        <Price value={
                            product.priceWithTax.__typename === 'SinglePrice'
                                ? product.priceWithTax.value
                                : product.priceWithTax.min
                        } />
                    </p>
                    <Link
                        href={`/product/${product.slug}`}
                        className="inline-block rounded-lg bg-[#12123F] dark:bg-[#F1F1F1] text-white dark:text-[#12123F] text-sm font-semibold px-5 py-2 hover:opacity-90 transition-opacity"
                    >
                        Ver detalles
                    </Link>
                </div>
            </div>

            {products.length > 1 && (
                <>
                    <Button
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground"
                        size="sm"
                        isIconOnly
                        onClick={goToPrevious}
                        aria-label="Producto destacado anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-foreground"
                        size="sm"
                        isIconOnly
                        onClick={goToNext}
                        aria-label="Siguiente producto destacado"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="flex justify-center gap-1.5 pb-4">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1.5 rounded-full transition-all ${
                                    index === currentIndex ? 'w-6 bg-[#6BB8FF]' : 'w-1.5 bg-muted-foreground/30'
                                }`}
                                aria-label={`Ir al destacado ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}