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
import { isDisplayableImageUrl, normalizeVendureAssetUrl } from '@/lib/vendure/shared/asset-url';
import {
    channelCodeMatchesStoreSlug,
    getStoreFeaturedProducts,
    getStoreMetadata,
    getStoreProducts,
    getStoreProfile,
} from './actions';

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="white" style={{ width: 20, height: 20 }}>
            <path d="M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="white" style={{ width: 20, height: 20 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H15V13.9999H17.0762C17.5066 13.9999 17.8887 13.7245 18.0249 13.3161L18.4679 11.9871C18.6298 11.5014 18.2683 10.9999 17.7564 10.9999H15V8.99992C15 8.49992 15.5 7.99992 16 7.99992H18C18.5523 7.99992 19 7.5522 19 6.99992V6.31393C19 5.99091 18.7937 5.7013 18.4813 5.61887C17.1705 5.27295 16 5.27295 16 5.27295C13.5 5.27295 12 6.99992 12 8.49992V10.9999H10C9.44772 10.9999 9 11.4476 9 11.9999V12.9999C9 13.5522 9.44771 13.9999 10 13.9999H12V21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
            <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" />
        </svg>
    );
}

export const dynamic = 'force-dynamic';

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
    const [metadataResult, allProducts, profile, featuredProducts] = await Promise.all([
        getStoreMetadata(slug, locale),
        getStoreProducts(slug, locale),
        getStoreProfile(slug, locale),
        getStoreFeaturedProducts(slug, locale),
    ]);

    const channel = metadataResult.data.activeChannel;

    if (!channelCodeMatchesStoreSlug(slug, channel?.code) || !profile?.storeName?.trim()) {
        notFound();
    }

    const storeName = profile.storeName;
    const storeDescription = profile.storeDescription || 'Sin descripcion de la tienda.';
    const storeBannerUrl = normalizeVendureAssetUrl(profile.storeBannerUrl);
    const storeBannerDisplayable = isDisplayableImageUrl(storeBannerUrl);
    const featuredSet = new Set(
        featuredProducts.map(p => readFragment(ProductCardFragment, p).productId),
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
                    {storeBannerDisplayable && storeBannerUrl ? (
                        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-2 ring-border shadow-md flex-shrink-0">
                            <Image
                                src={storeBannerUrl}
                                alt={storeName}
                                fill
                                className="object-cover"
                                sizes="80px"
                                unoptimized
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

                {profile?.socialLinks?.length ? (
                    <section className="flex flex-col sm:flex-row gap-2">
                        {profile.socialLinks.map(link => {
                            const isWhatsApp = link.platform === 'whatsapp';
                            const platformColor = isWhatsApp
                                ? '#25D366'
                                : link.platform === 'facebook'
                                  ? '#1877F2'
                                  : '#E4405F';
                            const Icon = isWhatsApp
                                ? WhatsAppIcon
                                : link.platform === 'facebook'
                                  ? FacebookIcon
                                  : InstagramIcon;
                            const label = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
                            return (
                                <div
                                    key={link.platform}
                                    className="rounded-xl p-3 flex flex-col gap-2 shadow-sm flex-1 w-fit"
                                    style={{ background: platformColor }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-7 h-7 flex items-center justify-center [&>svg]:fill-white shrink-0">
                                            <Icon />
                                        </span>
                                        <span className="text-xs font-medium text-white/80 truncate">
                                            {label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {!isWhatsApp && (
                                            <a
                                                href={link.profileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full px-2.5 py-1 text-xs font-medium bg-white hover:bg-white/80 transition-all duration-200 shrink-0"
                                                style={{ color: platformColor }}
                                            >
                                                Seguir
                                            </a>
                                        )}
                                        <a
                                            href={link.dmLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-full px-2.5 py-1 text-xs font-medium bg-white hover:bg-white/80 transition-all duration-200 shrink-0"
                                            style={{ color: platformColor }}
                                        >
                                            {isWhatsApp ? 'Chatear' : 'Mensaje'}
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                ) : null}

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Productos destacados</h2>
                    {featuredProducts.length ? (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {featuredProducts.map((product, index) => (
                                <ProductCard key={`featured-product-${index}`} product={product} storeName={storeName} />
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
                                <ProductCard key={`store-product-${index}`} product={product} storeName={storeName} />
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
