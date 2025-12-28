import { Suspense } from 'react';
import OrderDetailContent from './order-content';

export default function OrderDetailPage(props: PageProps<'/account/orders/[code]'>) {
    return(
        <Suspense>
            <OrderDetailContent params={props.params} searchParams={props.searchParams}/>
        </Suspense>
    )
}
