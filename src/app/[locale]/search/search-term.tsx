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
        <div className="mb-6">
            <h1 className="text-3xl font-bold">
                {searchTerm ? `${t(I18N.Search.searchResults)} "${searchTerm}"` : t(I18N.Search.title)}
            </h1>
        </div>
    )
}

export function SearchTermSkeleton() {
    return (
        <div className="mb-6">
            <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
    )
}
