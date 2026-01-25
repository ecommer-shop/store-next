import { Suspense } from 'react';
import OrdersContent from './orders-content';
import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

interface PageProps<T> {
    params: {
        locale: string;
        currantPage: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
}
export default function OrdersPage(props: PageProps<'/account/orders'>) {
    const t = useTranslations('Account.orders')
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center gap-2">
                <Spinner color="current" />
                <p className="text-muted-foreground">{t(I18N.Account.orders.list.loading)}</p>
            </div>
        }>
            <OrdersContent params={props.params} searchParams={props.searchParams} />
        </Suspense>
    )
}
