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
import OrdersContent from './orders-content';

export default function OrdersPage(props: PageProps<'/account/orders'>) {
    return(
        <Suspense>
            <OrdersContent params={props.params} searchParams={props.searchParams}/>
        </Suspense>
    )
}
