import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import {
    buildWideBannerSrcSet,
    ensureAssetSourceUrl,
    isDisplayableImageUrl,
    normalizeVendureAssetUrl,
} from '@/lib/vendure/shared/asset-url';
import {
    channelCodeMatchesStoreSlug,
    getStoreCollections,
    getStoreFeaturedProducts,
    getStoreMetadata,
    getStoreProducts,
    getStoreProfile,
} from './actions';
import { StoreProductCatalog } from './store-product-catalog';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const [result, profile] = await Promise.all([
        getStoreMetadata(slug, locale),
        getStoreProfile(slug, locale),
    ]);
    const channel = result.data.activeChannel;

    if (!channelCodeMatchesStoreSlug(slug, channel?.code) || !profile?.storeName?.trim()) {
        return {
            title: 'Tienda no encontrada',
        };
    }

    const title = profile.storeName;
    const description =
        truncateDescription(profile.storeDescription) || `Conoce la tienda ${title} en ${SITE_NAME}`;
    const ogImage =
        profile.storeHeaderBannerUrl || profile.storeBannerUrl;

    return {
        title,
        description,
        alternates: {
            canonical: buildCanonicalUrl(`/store/${slug}`),
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: buildCanonicalUrl(`/store/${slug}`),
            images: buildOgImages(ogImage, title),
        },
    };
}

export default async function StorePage({ params, searchParams }: Props) {
    const { slug, locale } = await params;
    const resolvedSearchParams = await searchParams;
    const [metadataResult, allProducts, profile, featuredProducts] = await Promise.all([
        getStoreMetadata(slug, locale),
        getStoreProducts(slug, locale, resolvedSearchParams),
        getStoreProfile(slug, locale),
        getStoreFeaturedProducts(slug, locale),
        getStoreCollections(slug, locale),
    ]);

    const channel = metadataResult.data.activeChannel;

    if (!channelCodeMatchesStoreSlug(slug, channel?.code) || !profile?.storeName?.trim()) {
        notFound();
    }

    const storeName = profile.storeName;
    const storeDescription = profile.storeDescription || 'Sin descripción de la tienda.';
    const storeLogoUrl = normalizeVendureAssetUrl(profile.storeBannerUrl);
    const storeLogoDisplayable = isDisplayableImageUrl(storeLogoUrl);
    const storeHeaderUrl = ensureAssetSourceUrl(profile.storeHeaderBannerUrl);
    const storeHeaderSrcSet = buildWideBannerSrcSet(profile.storeHeaderBannerUrl);
    const storeHeaderDisplayable = isDisplayableImageUrl(storeHeaderUrl);
    const featuredSet = new Set(
        featuredProducts.map(p => readFragment(ProductCardFragment, p).productId),
    );
    const remainingProducts = allProducts.filter(
        product => !featuredSet.has(readFragment(ProductCardFragment, product).productId),
    );

    return (
        <main className="mt-16 pb-12">
            {/* Cabecera: imagen personalizada del vendedor o fondo Ecommer por defecto */}
            <section className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden">
                {storeHeaderDisplayable && storeHeaderUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- full-res source + srcset evita blur de next/image fill
                    <img
                        src={storeHeaderUrl}
                        srcSet={storeHeaderSrcSet}
                        sizes="100vw"
                        alt=""
                        aria-hidden
                        decoding="async"
                        fetchPriority="high"
                        className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                ) : (
                    <>
                        <Image
                            src="/bg-light.webp"
                            alt=""
                            aria-hidden
                            fill
                            className="object-cover block dark:hidden"
                            sizes="100vw"
                            priority
                        />
                        <Image
                            src="/bg-dark.webp"
                            alt=""
                            aria-hidden
                            fill
                            className="object-cover hidden dark:block"
                            sizes="100vw"
                            priority
                        />
                        <div className="absolute inset-0 backdrop-blur-2xl bg-[#f1f1f1]/40 dark:bg-[#12123f]/40 pointer-events-none" />
                    </>
                )}
            </section>

            <div className="container mx-auto px-4">
                {/* Tarjeta de perfil flotante sobre la cabecera */}
                <section className="relative z-10 -mt-16 sm:-mt-20 mb-10">
                    <div className="rounded-2xl border bg-card shadow-lg p-5 sm:p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 md:gap-8">
                            {storeLogoDisplayable && storeLogoUrl ? (
                                <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 shrink-0 rounded-xl overflow-hidden ring-1 ring-border shadow-sm">
                                    <Image
                                        src={storeLogoUrl}
                                        alt={storeName}
                                        fill
                                        className="object-cover"
                                        sizes="112px"
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className="flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl font-bold text-muted-foreground ring-1 ring-border">
                                    {storeName.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-2">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                                    {storeName}
                                </h1>
                                <div
                                    className="text-muted-foreground prose prose-sm max-w-3xl dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: storeDescription }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Catálogo: destacados + todos los productos con la misma alineación */}
                <section className="mb-10">
                    <StoreProductCatalog
                        featuredProducts={featuredProducts}
                        products={remainingProducts}
                    />
                </section>

                <section>
                    <Link href={`/${locale}`} className="text-sm underline underline-offset-2">
                        Volver al inicio
                    </Link>
                </section>
            </div>
        </main>
    );
}
