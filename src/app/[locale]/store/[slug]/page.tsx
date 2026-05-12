import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/commerce/product-card';
import { readFragment } from '@/graphql';
import { ProductCardFragment } from '@/lib/vendure/shared/fragments';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
} from '@/lib/vendure/shared/metadata';
import {
    channelCodeMatchesStoreSlug,
    getStoreFeaturedProductIds,
    getStoreMetadata,
    getStoreProducts,
    getStoreProfile,
} from './actions';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
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
            images: buildOgImages(profile.storeBannerUrl, title),
        },
    };
}

export default async function StorePage({ params }: Props) {
    const { slug, locale } = await params;
    const [metadataResult, productsResult, profile, featuredProductIds] = await Promise.all([
        getStoreMetadata(slug, locale),
        getStoreProducts(slug, locale),
        getStoreProfile(slug, locale),
        getStoreFeaturedProductIds(slug, locale),
    ]);

    const channel = metadataResult.data.activeChannel;
    const allProducts = productsResult.data.search.items;

    if (!channelCodeMatchesStoreSlug(slug, channel?.code) || !profile?.storeName?.trim()) {
        notFound();
    }

    const storeName = profile.storeName;
    const storeDescription = profile.storeDescription || 'Sin descripcion de la tienda.';
    const rawBanner = profile.storeBannerUrl?.trim();
    /** next/image solo acepta URL absolutas (`http(s)://`) o paths que empiecen con `/`. */
    const storeBannerUrl = rawBanner && /^(https?:\/\/|\/)/i.test(rawBanner) ? rawBanner : null;
    const featuredSet = new Set(featuredProductIds.slice(0, 3));
    const featuredProducts = allProducts.filter(product =>
        featuredSet.has(readFragment(ProductCardFragment, product).productId),
    );
    const remainingProducts = allProducts.filter(
        product => !featuredSet.has(readFragment(ProductCardFragment, product).productId),
    );

    return (
        <main className="mt-16 space-y-10 pb-10">
            {/* Hero a ancho completo con fondo light/dark estilo home */}
            <section className="relative overflow-hidden">
                <Image
                    src="/bg-light.webp"
                    alt=""
                    aria-hidden
                    width={1600}
                    height={500}
                    className="absolute inset-0 h-full w-full object-cover block dark:hidden"
                />
                <Image
                    src="/bg-dark.webp"
                    alt=""
                    aria-hidden
                    width={1600}
                    height={500}
                    className="absolute inset-0 h-full w-full object-cover hidden dark:block"
                />
                <div className="absolute inset-0 backdrop-blur-2xl bg-[#f1f1f1]/40 dark:bg-[#12123f]/40 pointer-events-none" />

                <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center justify-center gap-2 text-foreground"
                    >
                        <Image
                            src="/logo-dark.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="h-8 sm:h-10 w-auto block dark:hidden"
                            priority
                        />
                        <Image
                            src="/logo-light.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="h-8 sm:h-10 w-auto hidden dark:block"
                            priority
                        />
                        <span className="text-xl sm:text-2xl font-semibold tracking-tight">
                            Ecommer
                        </span>
                    </Link>
                </div>
            </section>

            <div className="container mx-auto px-4 space-y-10">
                <section className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {storeBannerUrl ? (
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-2 ring-border shadow-md flex-shrink-0">
                            <Image
                                src={storeBannerUrl}
                                alt={storeName}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </div>
                    ) : null}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                            {storeName}
                        </h1>
                        <div
                            className="text-muted-foreground prose prose-sm max-w-2xl"
                            dangerouslySetInnerHTML={{ __html: storeDescription }}
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Productos destacados</h2>
                    {featuredProducts.length ? (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {featuredProducts.map((product, index) => (
                                <ProductCard key={`featured-product-${index}`} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Esta tienda no tiene productos destacados por ahora.</p>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Todos los productos</h2>
                        <p className="text-sm text-muted-foreground">{allProducts.length} productos</p>
                    </div>
                    {remainingProducts.length ? (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {remainingProducts.map((product, index) => (
                                <ProductCard key={`store-product-${index}`} product={product} />
                            ))}
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="rounded-md border p-6 text-sm text-muted-foreground">
                            Aun no hay productos publicados para esta tienda.
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No hay más productos en esta tienda.</p>
                    )}
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
