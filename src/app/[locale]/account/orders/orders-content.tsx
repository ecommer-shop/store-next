import {query} from '@/lib/vendure/server/api';

import {GetCustomerOrdersQuery} from '@/lib/vendure/shared/queries';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {ArrowRightIcon} from "lucide-react";
import {Button} from "@heroui/react";
import {Price} from '@/components/commerce/price';
import {OrderStatusBadge} from '@/components/commerce/order-status-badge';
import {formatDate} from '@/lib/vendure/shared/format';
import Link from "next/link";
import {redirect} from "next/navigation";
import { Protect, RedirectToSignIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { getAuthToken } from '@/lib/vendure/server/auth';
import { getTranslations } from 'next-intl/server';
import { I18N } from '@/i18n/keys';

const ITEMS_PER_PAGE = 10;
interface PageProps {
    params: {
        locale: string;
        currantPage: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
}
export default async function OrdersContent(props: PageProps) {
    const token = await getAuthToken();
    const t = await getTranslations('Account.orders');
    const searchParams = await props.searchParams;
    const pageParam = searchParams.page;
    const currentPage = parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam || '1', 10);
    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    
    const {data} = await query(
        GetCustomerOrdersQuery,
        {
            options: {
                take: ITEMS_PER_PAGE,
                skip,
            },
        },
        {
            token: token
        }
    );

    const orders = data.activeCustomer?.orders.items;
    const totalItems = data.activeCustomer?.orders.totalItems ?? 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    return (
            <div>
                <h1 className="text-3xl font-bold mb-6">{t(I18N.Account.orders.list.title)}</h1>

                {orders?.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t(I18N.Account.orders.list.empty)}</p>
                    </div>
                ) : (
                    <Suspense fallback={
                        <p>{t(I18N.Account.orders.list.loading)}</p>
                    }>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader className="bg-muted">
                                    <TableRow>
                                        <TableHead>{t(I18N.Account.orders.list.table.orderNumber)}</TableHead>
                                        <TableHead>{t(I18N.Account.orders.list.table.date)}</TableHead>
                                        <TableHead>{t(I18N.Account.orders.list.table.status)}</TableHead>
                                        <TableHead>{t(I18N.Account.orders.list.table.items)}</TableHead>
                                        <TableHead className="text-right">{t(I18N.Account.orders.list.table.total)}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders?.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <Button variant="ghost"
                                                className="rounded-md">
                                                    <Link
                                                        className='flex justify-between gap-1'
                                                        href={`/account/orders/${order.code}`}
                                                    >
                                                        {order.code} <ArrowRightIcon/>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(order.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <OrderStatusBadge state={order.state}/>
                                            </TableCell>
                                            <TableCell>
                                                {order.lines.length}{' '}
                                                {order.lines.length === 1 ? t(I18N.Account.orders.list.itemSingular) : t(I18N.Account.orders.list.itemPlural)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Price value={order.totalWithTax} currencyCode={order.currencyCode}/>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={
                                                    currentPage > 1
                                                        ? `/account/orders?page=${currentPage - 1}`
                                                        : '#'
                                                }
                                                className={
                                                    currentPage === 1
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }
                                            />
                                        </PaginationItem>

                                        {Array.from({length: totalPages}, (_, i) => i + 1).map(
                                            (page) => {
                                                if (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 &&
                                                        page <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <PaginationItem key={page}>
                                                            <PaginationLink
                                                                href={`/src/app/%5Blocale%5D/account/orders?page=${page}`}
                                                                isActive={page === currentPage}
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                } else if (
                                                    page === currentPage - 2 ||
                                                    page === currentPage + 2
                                                ) {
                                                    return (
                                                        <PaginationItem key={page}>
                                                            <PaginationEllipsis/>
                                                        </PaginationItem>
                                                    );
                                                }
                                                return null;
                                            }
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                href={
                                                    currentPage < totalPages
                                                        ? `/account/orders?page=${currentPage + 1}`
                                                        : '#'
                                                }
                                                className={
                                                    currentPage === totalPages
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </Suspense>
                )}
            </div>
    );
}