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
        <svg viewBox="0 0 20 20" fill="white" style={{ width: 20, height: 20 }}>
            <g transform="translate(-284, -7279)">
                <path d="M289.869652,7279.12273 C288.241769,7279.19618 286.830805,7279.5942 285.691486,7280.72871 C284.548187,7281.86918 284.155147,7283.28558 284.081514,7284.89653 C284.035742,7285.90201 283.768077,7293.49818 284.544207,7295.49028 C285.067597,7296.83422 286.098457,7297.86749 287.454694,7298.39256 C288.087538,7298.63872 288.809936,7298.80547 289.869652,7298.85411 C298.730467,7299.25511 302.015089,7299.03674 303.400182,7295.49028 C303.645956,7294.859 303.815113,7294.1374 303.86188,7293.08031 C304.26686,7284.19677 303.796207,7282.27117 302.251908,7280.72871 C301.027016,7279.50685 299.5862,7278.67508 289.869652,7279.12273" />
                <path d="M289.951245,7297.06748 C288.981083,7297.0238 288.454707,7296.86201 288.103459,7296.72603 C287.219865,7296.3826 286.556174,7295.72155 286.214876,7294.84312 C285.623823,7293.32944 285.819846,7286.14023 285.872583,7284.97693 C285.924325,7283.83745 286.155174,7282.79624 286.959165,7281.99226 C287.954203,7280.99968 289.239792,7280.51332 297.993144,7280.90837 C299.135448,7280.95998 300.179243,7281.19026 300.985224,7281.99226 C301.980262,7282.98483 302.473801,7284.28014 302.071806,7292.99991 C302.028024,7293.96767 301.865833,7294.49274 301.729513,7294.84312 C300.829003,7297.15085 298.757333,7297.47145 289.951245,7297.06748" />
                <path d="M298.089663,7283.68956 C298.089663,7284.34665 298.623998,7284.88065 299.283709,7284.88065 C299.943419,7284.88065 300.47875,7284.34665 300.47875,7283.68956 C300.47875,7283.03248 299.943419,7282.49847 299.283709,7282.49847 C298.623998,7282.49847 298.089663,7283.03248 298.089663,7283.68956" />
                <path d="M288.862673,7288.98792 C288.862673,7291.80286 291.150266,7294.08479 293.972194,7294.08479 C296.794123,7294.08479 299.081716,7291.80286 299.081716,7288.98792 C299.081716,7286.17298 296.794123,7283.89205 293.972194,7283.89205 C291.150266,7283.89205 288.862673,7286.17298 288.862673,7288.98792" />
                <path d="M290.655732,7288.98792 C290.655732,7287.16159 292.140329,7285.67967 293.972194,7285.67967 C295.80406,7285.67967 297.288657,7287.16159 297.288657,7288.98792 C297.288657,7290.81525 295.80406,7292.29716 293.972194,7292.29716 C292.140329,7292.29716 290.655732,7290.81525 290.655732,7288.98792" />
            </g>
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
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.socialLinks.map(link => {
                            const isWhatsApp = link.platform === 'whatsapp';
                            const platformStyle = isWhatsApp
                                ? { bg: '#25D366', hover: '#1da851', icon: WhatsAppIcon }
                                : link.platform === 'facebook'
                                  ? { bg: '#1877F2', hover: '#166fe5', icon: FacebookIcon }
                                  : { bg: '#E4405F', hover: '#c13584', icon: InstagramIcon };
                            const Icon = platformStyle.icon;
                            return (
                                <div
                                    key={link.platform}
                                    className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            style={{ background: platformStyle.bg }}
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                        >
                                            <Icon />
                                        </div>
                                        <span className="text-lg font-semibold capitalize text-foreground">
                                            {link.platform}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {!isWhatsApp && (
                                            <a
                                                href={link.profileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ background: platformStyle.bg }}
                                                className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                                            >
                                                Seguir
                                            </a>
                                        )}
                                        <a
                                            href={link.dmLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ background: platformStyle.bg }}
                                            className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
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
