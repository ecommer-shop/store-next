import { Suspense } from 'react';
import OrdersContent from './orders-content';

interface PageProps<T> {
    params: {
        locale: string;
        currantPage: string;
    };
    searchParams: Record<string, string | string[] | undefined>;
}
export default function OrdersPage(props: PageProps<'/account/orders'>) {
    return(
        <Suspense>
            <OrdersContent params={props.params} searchParams={props.searchParams}/>
        </Suspense>
    )
}
