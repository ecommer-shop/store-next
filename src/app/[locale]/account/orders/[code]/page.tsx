import { Suspense } from 'react';
import OrderDetailContent from './order-content';
import { Spinner } from '@heroui/react';


export interface PageProps {
  params: Promise<{
    code: string;
    locale: string;
  }>;
  searchParams: Record<string, string | string[] | undefined>;
}

export default function OrderDetailPage(props: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center gap-2">
        <Spinner color="current" />
      </div>
    }>
      <OrderDetailContent params={props.params} searchParams={props.searchParams} />
    </Suspense>
  )
}
