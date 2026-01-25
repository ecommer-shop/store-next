import type {Metadata} from 'next';
import {ChevronLeft} from 'lucide-react';
import {query} from '@/lib/vendure/server/api';
import {GetOrderDetailQuery} from '@/lib/vendure/shared/queries';
import {Badge} from '@/components/ui/badge';
import {Button} from '@heroui/react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import Image from 'next/image';
import {getActiveCustomer} from '@/lib/vendure/server/actions/actions';
import {notFound, redirect} from 'next/navigation';
import {Price} from '@/components/commerce/price';
import {OrderStatusBadge} from '@/components/commerce/order-status-badge';
import {formatDate} from '@/lib/vendure/shared/format';
import Link from 'next/link';

import {I18N} from '../../../../../i18n/keys';
import {getTranslations} from 'next-intl/server';
import { getAuthToken } from '@/lib/vendure/server/auth';

export interface PageProps {
  params: Promise<{
    code: string;
    locale: string;
  }>;
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  return {
    title: `Order ${(await params).code}`,
  };
}

export default async function OrderDetailContent({params}: PageProps) {
  const token = await getAuthToken()
  const t = await getTranslations('Account.orders');
  const {code} = await params;

  const activeCustomer = await getActiveCustomer();

  const {data} = await query(
    GetOrderDetailQuery,
    {code},
    {useAuthToken: true, token: token, fetch: {}}
  );

  if (!data.orderByCode) {
    return redirect('/account/orders');
  }

  const order = data.orderByCode;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4">
          <Link 
          className='flex'
          href="/account/orders">
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t(I18N.Account.orders.detail.back)}
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {t(I18N.Account.orders.detail.title, {code: order.code})}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t(I18N.Account.orders.detail.placedOn, {
                date:formatDate(order.createdAt, 'long')
              })}
            </p>
          </div>
          <OrderStatusBadge state={order.state} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>{t(I18N.Account.orders.detail.sections.items)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.lines.map(line => (
                  <div key={line.id} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {line.productVariant.product.featuredAsset && (
                        <Image
                          src={line.productVariant.product.featuredAsset.preview}
                          alt={line.productVariant.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/product/${line.productVariant.product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {line.productVariant.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {line.productVariant.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {line.productVariant.sku}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        <Price
                          value={line.linePriceWithTax}
                          currencyCode={order.currencyCode}
                        />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(I18N.Account.orders.detail.labels.qty)}: {line.quantity} ×{' '}
                        <Price
                          value={line.unitPriceWithTax}
                          currencyCode={order.currencyCode}
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t(I18N.Account.orders.detail.sections.summary)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t(I18N.Account.orders.detail.labels.subtotal)}
                  </span>
                  <Price
                    value={order.subTotalWithTax}
                    currencyCode={order.currencyCode}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t(I18N.Account.orders.detail.labels.shipping)}
                  </span>
                  <Price
                    value={order.shippingWithTax}
                    currencyCode={order.currencyCode}
                  />
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-bold text-lg">
                  <span>{t(I18N.Account.orders.detail.labels.total)}</span>
                  <Price
                    value={order.totalWithTax}
                    currencyCode={order.currencyCode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>{t(I18N.Account.orders.detail.sections.shippingAddress)}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.streetLine1}</p>
                <p>{order.shippingAddress.city}</p>
              </CardContent>
            </Card>
          )}

          {order.billingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>{t(I18N.Account.orders.detail.sections.billingAddress)}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">{order.billingAddress.fullName}</p>
                <p>{order.billingAddress.streetLine1}</p>
              </CardContent>
            </Card>
          )}

          {order.payments!.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t(I18N.Account.orders.detail.sections.payment)}</CardTitle>
              </CardHeader>
              <CardContent>
                {order.payments?.map(payment => (
                  <div key={payment.id} className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{t(I18N.Account.orders.detail.labels.method)}</span>
                      <span>{payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t(I18N.Account.orders.detail.labels.amount)}</span>
                      <Price value={payment.amount} currencyCode={order.currencyCode} />
                    </div>
                    <div className="flex justify-between">
                      <span>{t(I18N.Account.orders.detail.labels.status)}</span>
                      <Badge variant="secondary">{payment.state}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
