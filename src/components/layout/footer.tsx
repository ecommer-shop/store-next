import 'server-only';
import { getTopCollections } from '@/lib/vendure/cached';

import Image from "next/image";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { I18N } from '@/i18n/keys';
import { Users } from 'lucide-react';

function FooterBrandName() {
    // Can hardcode or translate - for now keep as is since it's brand name
    return "Ecommer SHop";
}

function FooterVendureLabel() {
    return "Vendure";
}

type TopCollections = {
    id: string;
    name: string;
    slug: string;
}[];

type TopCollection = {
    id: string;
    name: string;
    slug: string;
};
const getCachedTopCollections = async () => {
    return await getTopCollections();
}
export async function Footer() {
    /*'use cache'
    cacheLife('days');*/
    const [collections, tLayout, tAbout, tUsers] = await Promise.all([
        getCachedTopCollections(),
        getTranslations('Layout'),
        getTranslations('About'),
        getTranslations('Users'),
    ]);

    return (
        <footer className="border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-sm font-semibold mb-4 uppercase tracking-wider">
                            <FooterBrandName />
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-4">{tLayout(I18N.Layout.footer.sections.categories)}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {collections.map((collection: TopCollection) => (
                                <li key={collection.id}>
                                    <Link
                                        href={`/collection/${collection.slug}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-4">{tLayout(I18N.Layout.footer.sections.about.title)}</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/about-us"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {tLayout(I18N.Layout.footer.sections.about.label)}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/users"
                                    className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                                >
                                    <Users className="size-3.5 opacity-70" />
                                    {tUsers('footer.link')}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {tAbout('documents.terms')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {tAbout('documents.warranty')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {tAbout('documents.withdrawal')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=10"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                >
                                    {tAbout('documents.paymentReversal')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <div>
                        {tLayout(I18N.Layout.footer.copyright, {year: new Date().getFullYear()})}
                    </div>
                    <div className="flex items-center gap-2">

                        <Image
                            src="/logo-dark.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="inset-0 h-6 w-auto block dark:hidden"
                            priority
                        />

                        {/* Dark */}
                        <Image
                            src="/logo-light.webp"
                            alt="Ecommer"
                            width={60}
                            height={60}
                            className="inset-0 h-6 w-auto hidden dark:block"
                            priority
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
