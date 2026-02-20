import 'server-only';
import { getTopCollections } from '@/lib/vendure/cached';
import { unstable_cache } from 'next/cache';
import Image from "next/image";
import Link from "next/link";
import { CopyrightContent, FooterCategoriesLabel, FooterGitHubLink, UseLayoutText } from './footer-content';

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
/*
const getCachedTopCollections = unstable_cache(
    async () => {
        return getTopCollections();
    },
    ['top-collections'],
    {
        revalidate: 72 * 3600,
    }
);*/

const getCachedTopCollections = async () => {
    return await getTopCollections();
}
export async function Footer() {
    /*'use cache'
    cacheLife('days');*/
    const collections = await getCachedTopCollections();

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
                        <p className="text-sm font-semibold mb-4"><FooterCategoriesLabel /></p>
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
                        <p className="text-sm font-semibold mb-4"><UseLayoutText path={['footer','sections', 'about', 'title']}/></p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/about-us"
                                    className="hover:text-foreground transition-colors"
                                >
                                    <UseLayoutText path={['footer','sections', 'about', 'label']}/> 
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <CopyrightContent />
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
