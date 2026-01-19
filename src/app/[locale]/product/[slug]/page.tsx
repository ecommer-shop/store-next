import type { Metadata } from 'next';
import { query } from '@/lib/vendure/server/api';
import { GetProductDetailQuery } from '@/lib/vendure/shared/queries';
import { ProductImageCarousel } from '@/components/commerce/product-image-carousel';
import { RelatedProducts } from '@/components/commerce/related-products';
import {
    Accordion,
    Separator,
} from '@heroui/react';
import { notFound } from 'next/navigation';
import { cacheLife, cacheTag, unstable_cache } from 'next/cache';
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

interface PageProps<T = any> {
    params: Promise<T>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface ProductPageParams {
    locale: string;
    slug: string;
}

const getProductData = (slug: string) =>
  unstable_cache(
    async () => {
      return query(GetProductDetailQuery, { slug });
    },
    [`product-${slug}`],
    {
      revalidate: 300
    }
  )();


export async function generateMetadata({
    params,
}: PageProps<ProductPageParams>): Promise<Metadata> {
    const { slug } = await params;
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

export default async function ProductDetailPage({params, searchParams}: PageProps<ProductPageParams>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;

    const result = await getProductData(slug);

    const product = result.data.product;

    if (!product) {
        notFound();
    }

    // Get the primary collection (prefer deepest nested / most specific)
    const primaryCollection = product.collections?.find(c => c.parent?.id) ?? product.collections?.[0];
    const t = await getTranslations('Product');
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
                            <ProductInfo product={product} searchParams={searchParamsResolved} />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Product Benefits Section */}
            <section className="py-16 bg-muted/30 mt-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">{t(I18N.Product.whyChooseUs)}</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold">{t(I18N.Product.premiumQuality)}</h3>
                            <p className="text-muted-foreground">{t(I18N.Product.qualityDescription)}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold">{t(I18N.Product.ecoFriendly)}</h3>
                            <p className="text-muted-foreground">{t(I18N.Product.ecoDescription)}</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold">{t(I18N.Product.satisfactionGuaranteed)}</h3>
                            <p className="text-muted-foreground">{t(I18N.Product.satisfactionDescription)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Store FAQ Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-2xl font-bold text-center mb-8">{t(I18N.Product.faq)}</h2>
                    <Accordion lang="single" className="w-full">
                        
                        <Accordion.Item key="returns">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.returnPolicy)}
                                     <Accordion.Indicator className='text-foreground' fill='currentColor'/>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.returnDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Separator className='bg-[#12123F] dark:bg-[#F1F1F1]'/>
                        <Accordion.Item key="tracking">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.trackOrder)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor'/>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.trackDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Separator className='bg-[#12123F] dark:bg-[#F1F1F1]'/>
                        <Accordion.Item key="international">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    {t(I18N.Product.internationalShipping)}
                                    <Accordion.Indicator className='text-foreground' fill='currentColor'/>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body className='text-foreground'>
                                    {t(I18N.Product.internationalDescription)}
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Separator className='bg-[#12123F] dark:bg-[#F1F1F1]'/>
                    </Accordion>
                </div>
            </section>

            {primaryCollection && (
                <RelatedProducts
                    collectionSlug={primaryCollection.slug}
                    currentProductId={product.id}
                />
            )}
        </Suspense>
    );
}
