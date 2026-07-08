interface SearchTermProps {
    searchParams: Promise<{
        q?: string
    }>;
}

import { I18N } from '@/i18n/keys';
import { getTranslations } from 'next-intl/server';

export async function SearchTerm({searchParams}: SearchTermProps) {
    const searchParamsResolved = await searchParams;
    const searchTerm = (searchParamsResolved.q as string) || '';
    const t = await getTranslations('Search');
    return (
        <div className="mb-2">
            <h1 className="text-xl font-bold md:text-3xl">
                {searchTerm ? `${t(I18N.Search.searchResults)} "${searchTerm}"` : t(I18N.Search.title)}
            </h1>
        </div>
    )
}

export function SearchTermSkeleton() {
    return (
        <div className="mb-2">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
    )
}
