'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {Button} from '@heroui/react';
import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export function Pagination({currentPage, totalPages}: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `${pathname}?${params.toString()}`;
    };

    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        let prev = 0;
        for (const i of range) {
            if (prev && i - prev > 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    };

    const pages = getPageNumbers();

    return (
        <nav className="flex items-center justify-center gap-2">
            <Button
                variant="ghost"
                size="md"
                isDisabled={currentPage === 1}
            >
                {currentPage === 1 ? (
                    <span className="flex h-9 w-9 items-center justify-center cursor-not-allowed text-muted-foreground">
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                    ) : (
                    <Button variant="ghost" size="md" >
                        <Link href={createPageUrl(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </Button>

            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                    <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                        ...
                    </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                if (isActive) {
                    return (
                    <span
                        key={pageNum}
                        className="flex h-9 min-w-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
                    >
                        {pageNum}
                    </span>
                    );
                }

                return (
                    <Button key={pageNum} variant="ghost" size="md">
                    <Link href={createPageUrl(pageNum)}>{pageNum}</Link>
                    </Button>
                );
            })}

            <Button
                variant="ghost"
                size="md"
                isDisabled={currentPage === totalPages}
            >
                {currentPage === totalPages ? (
                    <span className="flex h-9 w-9 items-center justify-center cursor-not-allowed text-muted-foreground">
                        <ChevronRight className="h-4 w-4" />
                    </span>
                    ) : (
                    <Button variant="ghost" size="md">
                        <Link href={createPageUrl(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </Button>
        </nav>
    );
}
