import type {Metadata} from 'next';
import {ChevronLeft, Truck} from 'lucide-react';
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
import {parse} from 'graphql';

const GetDeliveryOrdersByOrderCodeDocument = parse(`
  query GetDeliveryOrdersByOrderCode($orderCode: String!) {
    deliveryOrdersByOrderCode(orderCode: $orderCode) {
      id
      orderCode
      sellerName
      provider
      providerDocumentId
      status
      statusLabel
      trackingUrl
      statusUpdatedAt
      createdAt
      updatedAt
    }
  }
`);

interface ExternalDeliveryOrderStatus {
  id: string;
  orderCode?: string | null;
  sellerName?: string | null;
  provider: string;
  providerDocumentId?: string | null;
  status: string;
  statusLabel?: string | null;
  trackingUrl?: string | null;
  statusUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  CREATED: 'Domicilio creado',
  REQUESTED: 'Domicilio solicitado',
  PENDING: 'Pendiente',
  ASSIGNED: 'Asignado',
  PICKED_UP: 'Recogido',
  EN_CAMINO: 'En camino',
  IN_TRANSIT: 'En camino',
  DELIVERED: 'Entregado',
  COMPLETED: 'Entregado',
  CANCELLED: 'Cancelado',
  CANCELED: 'Cancelado',
  FAILED: 'Con novedad',
};

function formatDeliveryStatus(status: string, statusLabel?: string | null) {
  if (statusLabel) return statusLabel;

  const normalizedStatus = status.trim().toUpperCase();
  return DELIVERY_STATUS_LABELS[normalizedStatus] ?? status.replace(/_/g, ' ');
}

function getDeliveryStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const normalizedStatus = status.trim().toUpperCase();

  if (['DELIVERED', 'COMPLETED'].includes(normalizedStatus)) return 'default';
  if (['CANCELLED', 'CANCELED', 'FAILED'].includes(normalizedStatus)) return 'destructive';
  if (['CREATED', 'REQUESTED', 'PENDING'].includes(normalizedStatus)) return 'secondary';

  return 'outline';
}

async function getDeliveryOrdersByOrderCode(orderCode: string, token?: string | null) {
  try {
    const {data} = await query(
      GetDeliveryOrdersByOrderCodeDocument as any,
      {orderCode},
      {useAuthToken: true, token: token ?? undefined, fetch: {}}
    ) as {data: {deliveryOrdersByOrderCode?: ExternalDeliveryOrderStatus[] | null}};

    return data.deliveryOrdersByOrderCode ?? [];
  } catch (error) {
    console.error('Failed to load external delivery orders', error);
    return [];
  }
}

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
  const deliveryOrders = await getDeliveryOrdersByOrderCode(order.code, token);

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
                  <div key={line.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

                    <div className="mt-2 sm:mt-0 sm:text-right">
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
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                  <span className="text-muted-foreground">{t(I18N.Account.orders.detail.labels.subtotal)}</span>
                  <span className="sm:text-right"><Price value={order.subTotalWithTax} currencyCode={order.currencyCode} /></span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                  <span className="text-muted-foreground">{t(I18N.Account.orders.detail.labels.shipping)}</span>
                  <span className="sm:text-right"><Price value={order.shippingWithTax} currencyCode={order.currencyCode} /></span>
                </div>

                <Separator className="my-2" />

                <div className="flex flex-col sm:flex-row sm:justify-between font-bold text-lg">
                  <span>{t(I18N.Account.orders.detail.labels.total)}</span>
                  <span className="sm:text-right"><Price value={order.totalWithTax} currencyCode={order.currencyCode} /></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {deliveryOrders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Estado del domicilio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {deliveryOrders.map(deliveryOrder => (
                  <div
                    key={deliveryOrder.id}
                    className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {deliveryOrder.sellerName || 'Domicilio Messenger Domis'}
                        </p>
                        <p className="text-muted-foreground">Messenger Domis</p>
                      </div>
                      <Badge variant={getDeliveryStatusBadgeVariant(deliveryOrder.status)}>
                        {formatDeliveryStatus(deliveryOrder.status, deliveryOrder.statusLabel)}
                      </Badge>
                    </div>

                    {deliveryOrder.statusUpdatedAt && (
                      <p className="text-muted-foreground">
                        Actualizado: {formatDate(deliveryOrder.statusUpdatedAt)}
                      </p>
                    )}

                    {deliveryOrder.providerDocumentId && (
                      <p className="text-muted-foreground">
                        Código domicilio: {deliveryOrder.providerDocumentId}
                      </p>
                    )}

                    {deliveryOrder.trackingUrl && (
                      <Link
                        href={deliveryOrder.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-primary hover:underline"
                      >
                        Ver seguimiento
                      </Link>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
