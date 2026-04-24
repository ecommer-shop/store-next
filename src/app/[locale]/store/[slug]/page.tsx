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
import { getStoreFeaturedProductIds, getStoreMetadata, getStoreProducts, getStoreProfile } from './actions';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const [result, profile] = await Promise.all([
        getStoreMetadata(slug, locale),
        getStoreProfile(slug, locale),
    ]);
    const store = result.data.collection;

    if (!store) {
        return {
            title: 'Tienda no encontrada',
        };
    }

    const description =
        truncateDescription(profile?.storeDescription || store.description) ||
        `Conoce la tienda ${profile?.storeName || store.name} en ${SITE_NAME}`;

    return {
        title: profile?.storeName || store.name,
        description,
        alternates: {
            canonical: buildCanonicalUrl(`/store/${store.slug}`),
        },
        openGraph: {
            title: profile?.storeName || store.name,
            description,
            type: 'website',
            url: buildCanonicalUrl(`/store/${store.slug}`),
            images: buildOgImages(profile?.storeBannerUrl || store.featuredAsset?.preview, profile?.storeName || store.name),
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

    const store = metadataResult.data.collection;
    const allProducts = productsResult.data.search.items;

    if (!store) {
        notFound();
    }

    const storeName = profile?.storeName || store.name;
    const storeDescription = profile?.storeDescription || store.description || 'Sin descripcion de la tienda.';
    const storeBannerUrl = profile?.storeBannerUrl || store.featuredAsset?.preview;
    const featuredSet = new Set(featuredProductIds.slice(0, 3));
    const featuredProducts = allProducts.filter(product =>
        featuredSet.has(readFragment(ProductCardFragment, product).productId),
    );
    const remainingProducts = allProducts.filter(
        product => !featuredSet.has(readFragment(ProductCardFragment, product).productId),
    );

    return (
        <main className="container mx-auto px-4 py-8 mt-16 space-y-10">
            <section className="overflow-hidden rounded-xl bg-muted/40 border">
                <div className="relative h-56 md:h-72">
                    {storeBannerUrl ? (
                        <Image
                            src={storeBannerUrl}
                            alt={storeName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-r from-[#12123F] to-[#6BB8FF]" />
                    )}
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-bold">{storeName}</h1>
                    <div
                        className="mt-3 text-muted-foreground prose prose-sm max-w-none"
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
                <Link href="/" className="text-sm underline underline-offset-2">
                    Volver al inicio
                </Link>
            </section>
        </main>
    );
}
