import type { Metadata } from 'next';
import { isLegacyProductDetailWithoutSellerShopError } from '@/lib/vendure/graphql-validation-fallback';
import { query } from '@/lib/vendure/server/api';
import { GetProductDetailLegacyQuery, GetProductDetailQuery, SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { ProductImageCarousel } from '@/components/commerce/product-image-carousel';
import { RelatedProducts } from '@/components/commerce/related-products';
import { buildSearchInput, getCurrentPage } from '@/lib/vendure/shared/search-helpers';
import { FacetFilters } from '@/components/commerce/facet-filters/facet-filters';
import { Accordion, Spinner } from '@heroui/react';
import { ChevronDownIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import { ProductInfo } from '@/components/commerce/product-info/product-info';
import { ProductGrid } from '@/components/commerce/product-grid';
import { Suspense } from 'react';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';
import { ReviewsSection } from '@/components/commerce/reviews-section-inline';

interface PageProps<T = any> {
    params: Promise<T>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface ProductPageParams {
    locale: string;
    slug: string;
}

const vendureProductDetailFetch = { cache: 'no-store' as const };

export const dynamic = 'force-dynamic';

async function getProductData(slug: string) {
    try {
        return await query(GetProductDetailQuery, { slug }, { fetch: vendureProductDetailFetch });
    } catch (error) {
        if (!isLegacyProductDetailWithoutSellerShopError(error)) {
            throw error;
        }
        return query(GetProductDetailLegacyQuery, { slug }, { fetch: vendureProductDetailFetch });
    }
}

export async function generateMetadata({
    params,
}: PageProps<ProductPageParams>): Promise<Metadata> {
    const { slug, locale } = await params;
    const result = await getProductData(slug);
    const product = result.data.product;

    if (!product) {
        return {
            title: I18N.Product.notFound,
        };
    }

    const description = truncateDescription(product.description);
    const ogImage = product.assets?.[0]?.preview;

    return {
        title: product.name,
        description: description || `Shop ${product.name} at ${SITE_NAME}`,
        alternates: {
            canonical: buildCanonicalUrl(`/product/${product.slug}`),
        },
        openGraph: {
            title: product.name,
            description: description || `Shop ${product.name} at ${SITE_NAME}`,
            type: 'website',
            url: buildCanonicalUrl(`/product/${product.slug}`),
            images: buildOgImages(ogImage, product.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description || `Shop ${product.name} at ${SITE_NAME}`,
            images: ogImage ? [ogImage] : undefined,
        },
    };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps<ProductPageParams>) {
    const { slug, locale } = await params;
    const searchParamsResolved = await searchParams;

    const page = getCurrentPage(searchParamsResolved);
    const result = await getProductData(slug);
    const productDataPromise = query(SearchProductsQuery, {
        input: buildSearchInput({ searchParams: searchParamsResolved }),
    });

    const product = result.data.product;
    if (!product) {
        notFound();
    }

    const sellerShop = (product as { sellerShop?: { channelCode: string; sellerName: string } | null })
        .sellerShop;
    const storeLink =
        sellerShop?.channelCode && sellerShop?.sellerName
            ? { name: sellerShop.sellerName, href: `/${locale}/store/${sellerShop.channelCode}` }
            : undefined;

    const productId = product.id;
    const variantId = product.variants[0]?.id;
    const primaryCollection = product.collections?.find(c => c.parent?.id) ?? product.collections?.[0];
    const t = await getTranslations('Product');

    return (
        <Suspense fallback={<p>{I18N.Account.common.loading}</p>}>

            {/* ── Hero: imagen + info + reseñas inline ── */}
            <div className="container mx-auto px-4 py-8 mt-16 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 items-start">

                    {/* Columna izquierda: imagen */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <ProductImageCarousel images={product.assets} />
                    </div>

                    {/* Columna derecha: info + reseñas */}
                    <div className="flex flex-col gap-8">
                        <Suspense fallback={
                            <div className="h-40 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <circle cx="18" cy="12" r="0" fill="#12123f"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle>
                                    <circle cx="12" cy="12" r="0" fill="#12123f"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle>
                                    <circle cx="6" cy="12" r="0" fill="#12123f"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle>
                                </svg>
                            </div>
                        }>
                            <ProductInfo
                                product={{ ...product }}
                                storeLink={storeLink}
                                searchParams={searchParamsResolved}
                                 productImageUrl={product.assets?.[0]?.preview ?? null}
                                 primaryCollection={primaryCollection}
                             />
                        </Suspense>

                        {/* Reseñas: justo debajo del nombre de la tienda */}
                        <ReviewsSection productId={productId} variantId={variantId} />
                    </div>
                </div>
            </div>

            {/* ── Productos relacionados por categoría ── */}
            {primaryCollection?.slug && (
                <div className="container mx-auto px-4 pb-10 max-w-6xl">
                    {/* Header compacto */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Productos relacionados
                            </h2>
                        </div>
                        {/* Decorative line */}
                        <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    </div>
                    <Suspense fallback={
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
                                    <div className="aspect-square bg-muted" />
                                    <div className="p-3 space-y-2">
                                        <div className="h-4 bg-muted rounded w-3/4" />
                                        <div className="h-5 bg-muted rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    }>
                        <RelatedProducts
                            collectionSlug={primaryCollection.slug}
                            currentProductId={productId}
                            locale={locale}
                        />
                    </Suspense>
                </div>
            )}

            {/* ── CTA Vendedores ── */}
            <section
                className="py-16 mt-10 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #12123F 0%, #1e1b6e 50%, #2d1a7e 100%)' }}
            >
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{ background: '#9969F8', transform: 'translate(-40%, -40%)' }} />
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{ background: '#6BB8FF', transform: 'translate(40%, 40%)' }} />

                <div className="relative container mx-auto px-4 max-w-3xl text-center">
                    <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: '#6BB8FF' }}>
                        PARA VENDEDORES
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                        ¿Quieres vender con nosotros?
                    </h2>
                    <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
                        Conoce la vista de vendedores y descubre cómo crear tu tienda, gestionar productos y escalar tus ventas en minutos.
                    </p>
                    <a
                        href="/vendedores"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
                        style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
                    >
                        Ir a Vendedores
                    </a>
                </div>
            </section>

            {/* ── Más productos ── */}
            <div className="py-10 container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                            <FacetFilters productDataPromise={productDataPromise} />
                        </Suspense>
                    </aside>
                    <div className="lg:col-span-3">
                        <Suspense fallback={<div className="flex flex-col mt-17 items-center gap-2"><Spinner color="current" /></div>}>
                            <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* ── FAQ: al final de la página ── */}
            <section className="py-16 bg-muted/30 dark:bg-muted/10">
                <div className="container mx-auto px-4 max-w-3xl">
                    <p className="text-xs font-bold tracking-[0.25em] uppercase text-center mb-2" style={{ color: '#9969F8' }}>
                        SOPORTE
                    </p>
                    <h2 className="text-2xl font-extrabold text-center mb-8 text-foreground">
                        {t(I18N.Product.faq)}
                    </h2>
                    <Accordion className="w-full">
                        {[
                            { key: 'returns',        q: I18N.Product.returnPolicy,        a: I18N.Product.returnDescription },
                            { key: 'tracking',       q: I18N.Product.trackOrder,          a: I18N.Product.trackDescription },
                            { key: 'shippingCost',   q: I18N.Product.shippingCost,        a: I18N.Product.shippingCostDescription },
                            { key: 'deliveryTime',   q: I18N.Product.deliveryTime,        a: I18N.Product.deliveryDescription },
                            { key: 'paymentMethods', q: I18N.Product.paymentMethods,      a: I18N.Product.paymentDescription },
                            { key: 'paymentSecurity',q: I18N.Product.paymentSecurity,     a: I18N.Product.paymentSecurityDescription },
                            { key: 'invoice',        q: I18N.Product.invoice,             a: I18N.Product.invoiceDescription },
                            { key: 'support',        q: I18N.Product.support,             a: I18N.Product.supportDescription },
                        ].map(({ key, q, a }) => (
                            <Accordion.Item key={key} className="border-b border-border last:border-b-0">
                                <Accordion.Heading>
                                    <Accordion.Trigger className="flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium hover:underline">
                                        <span className="text-foreground">{t(q)}</span>
                                        <ChevronDownIcon className="text-[#9969F8] size-4 shrink-0 transition-transform duration-200" />
                                    </Accordion.Trigger>
                                </Accordion.Heading>
                                <Accordion.Panel>
                                    <Accordion.Body>
                                        <div className="pb-4 text-sm text-muted-foreground leading-relaxed">
                                            {t(a)}
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </section>

        </Suspense>
    );
}
