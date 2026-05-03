import type { Metadata } from 'next';
import { query } from '@/lib/vendure/server/api';
import { GetProductDetailQuery } from '@/lib/vendure/shared/queries';
import { ProductImageCarousel } from '@/components/commerce/product-image-carousel';
// import { RelatedProducts } from '@/components/commerce/related-products';
import { SearchProductsQuery } from '@/lib/vendure/shared/queries';
import { buildSearchInput, getCurrentPage } from '@/lib/vendure/shared/search-helpers';
import { FacetFilters } from '@/components/commerce/facet-filters/facet-filters';
import { RelatedProductsGrid } from '@/components/commerce/related-products-grid';
import {
    Accordion,
    Separator,
    Spinner,
    Tabs
} from '@heroui/react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import { ProductInfo } from '@/components/commerce/product-info';
import { Suspense } from 'react';
import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';
import { ReviewsSection } from '@/components/commerce/reviews-section-inline';
import { ProductGrid } from '@/components/commerce/product-grid';

interface PageProps<T = any> {
    params: Promise<T>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface ProductPageParams {
    locale: string;
    slug: string;
}
const getProductData = (slug: string, locale: string) => {
    return query(GetProductDetailQuery, { slug });
}

export async function generateMetadata({
    params,
}: PageProps<ProductPageParams>): Promise<Metadata> {
    const { slug, locale } = await params;
    const result = await getProductData(slug, locale);
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
    const result = await getProductData(slug, locale);
    const productDataPromise = query(SearchProductsQuery, {
        input: buildSearchInput({ searchParams: searchParamsResolved })
    });
    const product = result.data.product;

    if (!product) {
        notFound();
    }

    const productId = product.id;
    const variantId = product.variants[0]?.id;
    const storeCollection = product.collections?.[0];

    // Get the primary collection (prefer deepest nested / most specific)
    const primaryCollection = product.collections?.find(c => c.parent?.id) ?? product.collections?.[0];
    const t = await getTranslations('Product');
    const tHome = await getTranslations('Home');

    return (
        <Suspense fallback={
            <p>{I18N.Account.common.loading}</p>
        }>
            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Image Carousel */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <ProductImageCarousel images={product.assets} />
                    </div>

                    {/* Right Column: Product Info */}
                    <div>
                        <Suspense fallback={
                            <div className="h-40 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <circle cx="18" cy="12" r="0" fill="#12123f">
                                        <animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                    </circle>
                                    <circle cx="12" cy="12" r="0" fill="#12123f">
                                        <animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                    </circle>
                                    <circle cx="6" cy="12" r="0" fill="#12123f">
                                        <animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                    </circle>
                                </svg>
                            </div>
                        }>
                            <ProductInfo
                                product={{
                                    ...product,
                                    store: storeCollection
                                        ? {
                                            name: storeCollection.name,
                                            slug: storeCollection.slug,
                                        }
                                        : undefined,
                                }}
                                searchParams={searchParamsResolved}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>

            <div className="mt-16 container mx-auto px-4">
                <ReviewsSection
                    productId={productId}
                    variantId={variantId}
                />
            </div>

            {/* Product Benefits Section */}
            <section className="py-16 bg-muted/30 mt-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">{t(I18N.Product.whyChooseUs)}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center overflow-hidden">
                                <Image src="/Icono-CyC.png" width={80} height={80} alt="Cámara de Comercio" className="object-contain" />
                            </div>
                            <h3 className="text-xl font-semibold">{tHome(I18N.Home.features.cyc.title)}</h3>
                            <p className="text-muted-foreground text-sm">{tHome(I18N.Home.features.cyc.description)}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center overflow-hidden">
                                <Image src="/Icono-Dian.png" width={80} height={80} alt="DIAN" className="object-contain" />
                            </div>
                            <h3 className="text-xl font-semibold">{tHome(I18N.Home.features.dian.title)}</h3>
                            <p className="text-muted-foreground text-sm">{tHome(I18N.Home.features.dian.description)}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                                <Image src="/Icono-Wompi.png" width={80} height={80} alt="Wompi" className="object-contain scale-125" />
                            </div>
                            <h3 className="text-xl font-semibold">{tHome(I18N.Home.features.wompi.title)}</h3>
                            <p className="text-muted-foreground text-sm">{tHome(I18N.Home.features.wompi.description)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Store FAQ Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-2xl font-bold text-center mb-8">{t(I18N.Product.faq)}</h2>
                    <Accordion lang="single" className="w-full">

                        <Accordion.Item key="returns" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.returnPolicy)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.returnDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item key="tracking" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.trackOrder)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.trackDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item key="shippingCost" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.shippingCost)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.shippingCostDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item key="deliveryTime" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.deliveryTime)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.deliveryDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item key="paymentMethods" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.paymentMethods)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.paymentDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item key="paymentSecurity" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.paymentSecurity)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.paymentSecurityDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item key="invoice" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.invoice)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.invoiceDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item key="support" className="border-b border-[#12123F] dark:border-[#F1F1F1] py-2">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.support)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor' />
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.supportDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                    </Accordion>
                </div>
            </section>

            <div className="p-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                        <FacetFilters productDataPromise={productDataPromise} />
                    </Suspense>
                </aside>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    <Suspense fallback={
                        <div className="flex flex-col mt-17 items-center gap-2">
                            <Spinner color="current" />
                        </div>
                    }>
                        <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} />
                    </Suspense>
                </div>
            </div>
        </Suspense>
    );
}
