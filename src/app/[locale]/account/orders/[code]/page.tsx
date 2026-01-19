import { Suspense } from 'react';
import OrderDetailContent from './order-content';


export interface PageProps {
  params: {
    code: string;
    locale: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function OrderDetailPage(props: PageProps) {
    return(
        <Suspense>
            <OrderDetailContent params={props.params} searchParams={props.searchParams}/>
        </Suspense>
    )
}
