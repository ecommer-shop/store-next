interface SearchTermProps {
    searchParams: Promise<{
        q?: string
    }>;
}

export async function SearchTerm({searchParams}: SearchTermProps) {
    const searchParamsResolved = await searchParams;
    const searchTerm = (searchParamsResolved.q as string) || '';

    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold">
                {searchTerm ? `Search results for "${searchTerm}"` : 'Search'}
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
