import {connection} from 'next/server';
import {query} from '@/lib/vendure/server/api';
import {graphql} from '@/graphql';
import {Button} from '@heroui/react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CheckCircle2} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {Separator} from '@/components/ui/separator';
import {Price} from '@/components/commerce/price';
import {notFound} from "next/navigation";
import { I18N } from '@/i18n/keys';

const GetOrderByCodeQuery = graphql(`
    query GetOrderByCode($code: String!) {
        orderByCode(code: $code) {
            id
            code
            state
            totalWithTax
            currencyCode
            lines {
                id
                productVariant {
                    id
                    name
                    product {
                        id
                        name
                        slug
                        featuredAsset {
                            id
                            preview
                        }
                    }
                }
                quantity
                linePriceWithTax
            }
            shippingAddress {
                fullName
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
            }
        }
    }
`);

interface OrderConfirmationProps {
  params: {
    code: string;
    locale?: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
  t: (key: string) => string;
}

export async function OrderConfirmation({params, t}: OrderConfirmationProps) {
    const {code} = params;
    let order;

    try {
        const {data} = await query(GetOrderByCodeQuery, {code}, {useAuthToken: true});
        order = data.orderByCode;
    }
    catch (error) {
        notFound();
    }

    if (!order) {
       notFound();
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4"/>
                    <h1 className="text-3xl font-bold mb-2">{t(I18N.OrderConfirmation.title)}</h1>
                    <p className="text-muted-foreground">
                        {t(I18N.OrderConfirmation.thankYou)}
                        <span className="font-semibold">{order.code}</span>
                    </p>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{t(I18N.OrderConfirmation.summary)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.lines.map((line) => (
                            <div key={line.id} className="flex gap-4 items-center">
                                {line.productVariant.product.featuredAsset && (
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={line.productVariant.product.featuredAsset.preview}
                                            alt={line.productVariant.name}
                                            width={80}
                                            height={80}
                                            className="rounded object-cover h-20 w-20 object-center"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{line.productVariant.product.name}</p>
                                    {line.productVariant.name !== line.productVariant.product.name && (
                                        <p className="text-sm text-muted-foreground">
                                            {line.productVariant.name}
                                        </p>
                                    )}
                                </div>
                                <div className="text-center w-16">
                                    <p className="text-sm text-muted-foreground">{t(I18N.OrderConfirmation.quantity)}</p>
                                    <p className="font-medium">{line.quantity}</p>
                                </div>
                                <div className="text-right w-24">
                                    <p className="font-semibold">
                                        <Price value={line.linePriceWithTax} currencyCode={order.currencyCode}/>
                                    </p>
                                </div>
                            </div>
                        ))}

                        <Separator/>

                        <div className="flex justify-between font-bold text-lg">
                            <span>{t(I18N.OrderConfirmation.total)}</span>
                            <span>
                <Price value={order.totalWithTax} currencyCode={order.currencyCode}/>
              </span>
                        </div>
                    </CardContent>
                </Card>

                {order.shippingAddress && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>{t(I18N.OrderConfirmation.shippingAddress)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {order.shippingAddress.streetLine1}
                                {order.shippingAddress.streetLine2 && `, ${order.shippingAddress.streetLine2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                                {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{order.shippingAddress.country}</p>
                        </CardContent>
                    </Card>
                )}

                <div className="flex gap-4">
                    <Button asChild className="flex-1">
                        <Link href="/">{t(I18N.OrderConfirmation.continueShopping)}</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
