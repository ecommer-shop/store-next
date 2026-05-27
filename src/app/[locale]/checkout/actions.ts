'use server';

import { mutate, query } from '@/lib/vendure/server/api';
import { getAuthTokenFromCookies } from '@/lib/vendure/server/auth';
import {
    SetOrderShippingAddressMutation,
    SetOrderBillingAddressMutation,
    SetOrderShippingMethodMutation,
    AddPaymentToOrderMutation,
    RemoveFromCartMutation,
    CreateCustomerAddressMutation,
    TransitionOrderToStateMutation,
    SetOrderDynamicShippingMethod,
    CreateDeliveryOrderMutation
} from '@/lib/vendure/shared/mutations';
import {
    CalculateDeliveryCostQuery,
    GetCustomerAddressesQuery,
    GetActiveOrderQuery,
    GetWompiSignatureQuery
} from '@/lib/vendure/shared/queries';
import { revalidatePath, updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { parse } from 'graphql';

const GetActiveOrderDeliveryContextDocument = parse(`
    query GetActiveOrderDeliveryContext {
        activeOrder {
            id
            code
            subTotalWithTax
            shippingWithTax
            customer {
                id
                firstName
                lastName
                emailAddress
            }
            shippingAddress {
                fullName
                company
                streetLine1
                streetLine2
                city
                province
                postalCode
                country
                phoneNumber
                customFields {
                    latitude
                    longitude
                    neighborhood
                    googlePlaceId
                }
            }
            lines {
                id
                quantity
                linePriceWithTax
                productVariant {
                    product {
                        id
                        name
                        sellerShop {
                            channelCode
                            sellerName
                            pickupAddress
                            pickupLatLng
                            pickupNeighborhood
                        }
                    }
                }
            }
        }
    }
`);

interface AddressInput {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
    phoneNumber: string;
    company?: string;
    customFields?: AddressGeoCustomFields;
}

interface AddressGeoCustomFields {
    [key: string]: unknown;
    latitude?: number | string | null;
    longitude?: number | string | null;
    neighborhood?: string | null;
    googlePlaceId?: string | null;
}

interface DeliveryCostQuote {
    success: boolean;
    price?: {
        value: number;
        currency: string;
    } | null;
    distance?: {
        value: number;
        unit: string;
        text?: string | null;
    } | null;
    duration?: {
        value: number;
        unit: string;
        text?: string | null;
    } | null;
    error?: string | null;
}

interface CreateDeliveryOrderResponse {
    success: boolean;
    message?: string | null;
    id_documento?: string | null;
    fecha_creacion?: number | null;
    error?: string | null;
    missing_fields?: string[] | null;
    required_fields?: string[] | null;
}

interface SellerShopOrigin {
    channelCode: string;
    sellerName: string;
    pickupAddress?: string | null;
    pickupLatLng?: string | null;
    pickupNeighborhood?: string | null;
}

interface DeliveryContextLine {
    id: string;
    quantity: number;
    linePriceWithTax: number;
    productVariant: {
        product: {
            id: string;
            name: string;
            sellerShop?: SellerShopOrigin | null;
        };
    };
}

interface DeliveryContextOrder {
    id: string;
    code: string;
    subTotalWithTax: number;
    shippingWithTax: number;
    customer?: {
        id?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        emailAddress?: string | null;
    } | null;
    shippingAddress?: any;
    lines: DeliveryContextLine[];
}

interface DeliveryOriginGroup {
    key: string;
    sellerName: string;
    originLatLng: string;
    originNeighborhood: string;
    pickupAddress?: string | null;
    lines: DeliveryContextLine[];
    subtotalWithTax: number;
}

interface CustomerAddressWithGeo {
    streetLine1: string;
    streetLine2?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    phoneNumber?: string | null;
    customFields?: AddressGeoCustomFields | null;
}

const POST_PAYMENT_DELIVERY_TIMEOUT_MS = 15000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
        return await Promise.race([
            promise,
            new Promise<T>((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
            }),
        ]);
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}

function toFiniteNumber(value: unknown) {
    const numberValue = typeof value === 'string' ? Number(value) : value;
    return typeof numberValue === 'number' && Number.isFinite(numberValue) ? numberValue : null;
}

function getAddressLatLng(customFields?: AddressGeoCustomFields | Record<string, unknown> | null) {
    const latitude = toFiniteNumber(customFields?.latitude);
    const longitude = toFiniteNumber(customFields?.longitude);

    if (latitude == null || longitude == null) {
        return null;
    }

    return `${latitude},${longitude}`;
}

function normalizeAddressValue(value: unknown) {
    return String(value ?? '').trim().toLowerCase();
}

function addressMatchesOrderAddress(
    customerAddress: CustomerAddressWithGeo,
    orderAddress: any,
) {
    return (
        normalizeAddressValue(customerAddress.streetLine1) === normalizeAddressValue(orderAddress?.streetLine1) &&
        normalizeAddressValue(customerAddress.postalCode) === normalizeAddressValue(orderAddress?.postalCode) &&
        normalizeAddressValue(customerAddress.phoneNumber) === normalizeAddressValue(orderAddress?.phoneNumber)
    );
}

async function findSavedAddressCustomFieldsForOrderAddress(orderAddress: any, token: string) {
    if (!orderAddress) return null;

    const result = await query(
        GetCustomerAddressesQuery as any,
        {},
        { token, useAuthToken: true },
    ) as { data: { activeCustomer?: { addresses?: CustomerAddressWithGeo[] | null } | null } };

    const addresses = result.data.activeCustomer?.addresses ?? [];
    const matchingAddress = addresses.find(address => addressMatchesOrderAddress(address, orderAddress));

    return matchingAddress?.customFields ?? null;
}

async function resolveShippingAddressGeo(order: DeliveryContextOrder | null, token: string) {
    const shippingAddress = order?.shippingAddress;
    const orderAddressCustomFields = shippingAddress?.customFields as AddressGeoCustomFields | undefined;
    const orderAddressLatLng = getAddressLatLng(orderAddressCustomFields);

    if (orderAddressLatLng) {
        return {
            customFields: orderAddressCustomFields,
            latLng: orderAddressLatLng,
        };
    }

    const savedAddressCustomFields = await findSavedAddressCustomFieldsForOrderAddress(shippingAddress, token);
    const savedAddressLatLng = getAddressLatLng(savedAddressCustomFields);

    if (savedAddressLatLng) {
        return {
            customFields: savedAddressCustomFields,
            latLng: savedAddressLatLng,
        };
    }

    return {
        customFields: orderAddressCustomFields ?? savedAddressCustomFields ?? null,
        latLng: null,
    };
}

function toVendureMoneyFromPesos(value: number) {
    return Math.round(value * 100);
}

function toPesosString(valueInVendureMoney: number) {
    return String(Math.round(valueInVendureMoney / 100));
}

function buildAddressText(address: any) {
    return [
        address?.streetLine1,
        address?.streetLine2,
        address?.city,
        address?.province,
        address?.postalCode,
        address?.country,
    ].filter(Boolean).join(', ');
}

async function getActiveOrderDeliveryContext(token: string) {
    const result = await query(
        GetActiveOrderDeliveryContextDocument as any,
        {},
        { token, useAuthToken: true }
    ) as { data: { activeOrder: DeliveryContextOrder | null } };

    return result.data.activeOrder;
}

function groupOrderLinesBySellerOrigin(order: DeliveryContextOrder): DeliveryOriginGroup[] {
    const groups = new Map<string, DeliveryOriginGroup>();

    for (const line of order.lines) {
        const product = line.productVariant.product;
        const sellerShop = product.sellerShop;

        if (!sellerShop) {
            throw new Error(`El producto "${product.name}" no tiene una tienda asociada para calcular el domicilio`);
        }

        if (!sellerShop.pickupLatLng) {
            throw new Error(`La tienda "${sellerShop.sellerName}" no tiene direccion de recogida configurada`);
        }

        const key = `${sellerShop.channelCode}:${sellerShop.pickupLatLng}`;
        const existing = groups.get(key);
        if (existing) {
            existing.lines.push(line);
            existing.subtotalWithTax += line.linePriceWithTax;
            continue;
        }

        groups.set(key, {
            key,
            sellerName: sellerShop.sellerName,
            originLatLng: sellerShop.pickupLatLng,
            originNeighborhood: sellerShop.pickupNeighborhood || sellerShop.sellerName,
            pickupAddress: sellerShop.pickupAddress,
            lines: [line],
            subtotalWithTax: line.linePriceWithTax,
        });
    }

    return [...groups.values()];
}

async function calculateDeliveryQuotesForGroups(
    groups: DeliveryOriginGroup[],
    destination: string,
    token: string,
) {
    return Promise.all(groups.map(async (group) => {
        const result = await query(
            CalculateDeliveryCostQuery as any,
            {
                input: {
                    origin: group.originLatLng,
                    destination,
                },
            },
            { token, useAuthToken: true }
        ) as { data: { calculateDeliveryCost: DeliveryCostQuote } };

        const quote = result.data.calculateDeliveryCost;
        if (!quote.success || !quote.price) {
            throw new Error(quote.error || `No se pudo calcular el costo de envio para ${group.sellerName}`);
        }

        return { group, quote };
    }));
}

export async function setShippingAddress(
    shippingAddress: AddressInput,
    useSameForBilling: boolean
) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const shippingResult = await mutate(
        SetOrderShippingAddressMutation,
        { input: shippingAddress },
        { token, useAuthToken: true }
    );

    if (shippingResult.data.setOrderShippingAddress.__typename !== 'Order') {
        throw new Error('Failed to set shipping address');
    }

    if (useSameForBilling) {
        await mutate(
            SetOrderBillingAddressMutation,
            { input: shippingAddress },
            { token, useAuthToken: true }
        );
    }

    revalidatePath('/checkout');
}

export async function setShippingMethod(shippingMethodId: string) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const result = await mutate(
        SetOrderShippingMethodMutation,
        { shippingMethodId: [shippingMethodId] },
        { token, useAuthToken: true }
    );
    
    if (result.data.setOrderShippingMethod.__typename !== 'Order') {
        throw new Error('Failed to set shipping method');
    }

    revalidatePath('/checkout');
}

export async function setDynamicShippingPrice(price: number) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    await mutate(
        SetOrderDynamicShippingMethod,
        { price },

        { token, useAuthToken: true }
    );
    revalidatePath('/checkout');
}

async function reapplyShippingSelection(
    token: string,
    shippingMethodIds?: string[],
    shippingPriceWithTax?: number,
) {
    const uniqueShippingMethodIds = [...new Set((shippingMethodIds ?? []).filter(Boolean))];

    if (uniqueShippingMethodIds.length === 0) {
        return;
    }

    const result = await mutate(
        SetOrderShippingMethodMutation,
        { shippingMethodId: uniqueShippingMethodIds },
        { token, useAuthToken: true }
    );

    if (result.data.setOrderShippingMethod.__typename !== 'Order') {
        throw new Error('No se pudo reasignar el metodo de envio antes de finalizar el pedido');
    }

    if (typeof shippingPriceWithTax === 'number' && Number.isFinite(shippingPriceWithTax)) {
        await mutate(
            SetOrderDynamicShippingMethod,
            { price: Math.round(shippingPriceWithTax) },
            { token, useAuthToken: true }
        );
    }
}

export async function calculateDeliveryCostQuote() {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;

    const activeOrder = await getActiveOrderDeliveryContext(token);

    if (!activeOrder?.shippingAddress) {
        throw new Error('Primero selecciona una direccion de envio');
    }

    const destinationGeo = await resolveShippingAddressGeo(activeOrder, token);
    const destination = destinationGeo.latLng;

    if (!destination) {
        throw new Error('La direccion seleccionada no tiene coordenadas de Google Maps');
    }

    const groups = groupOrderLinesBySellerOrigin(activeOrder);
    const quotes = await calculateDeliveryQuotesForGroups(groups, destination, token);
    const totalDeliveryCost = quotes.reduce((sum, item) => sum + (item.quote.price?.value ?? 0), 0);

    return {
        success: true,
        price: {
            value: totalDeliveryCost,
            currency: quotes[0]?.quote.price?.currency || 'COP',
        },
        distance: quotes[0]?.quote.distance,
        duration: quotes[0]?.quote.duration,
        error: null,
    } satisfies DeliveryCostQuote;
}

export async function calculateAndSetDeliveryCost() {
    const quote = await calculateDeliveryCostQuote();
    const totalDeliveryCost = quote.price?.value ?? 0;

    await setDynamicShippingPrice(toVendureMoneyFromPesos(totalDeliveryCost));
    revalidatePath('/checkout');

    return quote;
}

async function createExternalDeliveryOrders(order: DeliveryContextOrder | null, paymentMethodCode: string, token: string) {
    const shippingAddress = order?.shippingAddress;
    const destinationGeo = await resolveShippingAddressGeo(order, token);
    const destination = destinationGeo.latLng;

    if (!shippingAddress || !destination) {
        throw new Error('La orden no tiene direccion de envio con coordenadas');
    }

    const groups = groupOrderLinesBySellerOrigin(order);
    const quotes = await calculateDeliveryQuotesForGroups(groups, destination, token);
    const customFields = destinationGeo.customFields as AddressGeoCustomFields | undefined;
    const customerName = [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' ');

    const deliveryOrderResults = await Promise.allSettled(quotes.map(async ({ group, quote }) => {
        const serviceValue = quote.price?.value ?? 0;
        const deliveryOrderResult = await mutate(
            CreateDeliveryOrderMutation as any,
            {
                input: {
                    barrio_origen: group.originNeighborhood,
                    barrio_destino: customFields?.neighborhood || shippingAddress.city || 'Destino',
                    origen_lat_lng: group.originLatLng,
                    destino_lat_lng: destination,
                    valor_producto: toPesosString(group.subtotalWithTax),
                    valor_servicio: String(Math.round(serviceValue)),
                    metodo_pago: paymentMethodCode === 'wompi' ? 'Transferencia' : 'Efectivo',
                    id_cliente: order.customer?.id || order.customer?.emailAddress || order.code,
                    creado_por: shippingAddress.fullName || customerName || order.code,
                    telefono_cliente: shippingAddress.phoneNumber || '',
                    observacion: [
                        buildAddressText(shippingAddress),
                        `Tienda: ${group.sellerName}`,
                        group.pickupAddress ? `Origen: ${group.pickupAddress}` : null,
                    ].filter(Boolean).join(' | '),
                    imagen: '',
                    tiempo_aproximado: quote.duration?.text || undefined,
                },
            },
            { token, useAuthToken: true }
        ) as { data: { createDeliveryOrder: CreateDeliveryOrderResponse } };

        if (!deliveryOrderResult.data.createDeliveryOrder.success) {
            throw new Error(
                deliveryOrderResult.data.createDeliveryOrder.error ||
                deliveryOrderResult.data.createDeliveryOrder.message ||
                `No se pudo crear el domicilio externo para ${group.sellerName}`
            );
        }
    }));

    const failedResult = deliveryOrderResults.find(result => result.status === 'rejected');
    if (failedResult?.status === 'rejected') {
        throw failedResult.reason instanceof Error
            ? failedResult.reason
            : new Error('No se pudo crear uno de los domicilios externos');
    }
}

export async function createCustomerAddress(address: AddressInput) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const result = await mutate(
        CreateCustomerAddressMutation,
        { input: address },
        { token, useAuthToken: true }
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create customer address');
    }

    revalidatePath('/checkout');
    return result.data.createCustomerAddress;
}

export async function transitionToArrangingPayment() {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;
    const result = await mutate(
        TransitionOrderToStateMutation,
        { state: 'ArrangingPayment' },
        { token, useAuthToken: true }
    );

    if (result.data.transitionOrderToState?.__typename === 'OrderStateTransitionError') {
        const errorResult = result.data.transitionOrderToState;
        const reason = errorResult.transitionError || errorResult.message;
        throw new Error(
            `No se pudo preparar la orden para pago: ${errorResult.errorCode} - ${reason}`
        );
    }

    revalidatePath('/checkout');
}

export async function placeOrder(
    paymentMethodCode: string,
    selectedLineIds?: string[],
    shippingMethodIds?: string[],
    shippingPriceWithTax?: number,
) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;

    // If selectedLineIds provided, remove unselected lines from the active order
    if (Array.isArray(selectedLineIds)) {
        if (selectedLineIds.length === 0) {
            throw new Error('No items selected for the order');
        }

        // Fetch active order to know current lines
        const activeOrderRes = await query(GetActiveOrderQuery, {}, { token, useAuthToken: true });
        const activeOrder = activeOrderRes.data.activeOrder;
        if (activeOrder && Array.isArray(activeOrder.lines)) {
            const linesToRemove = activeOrder.lines.filter((l: any) => !selectedLineIds.includes(l.id));
            for (const line of linesToRemove) {
                try {
                    await mutate(RemoveFromCartMutation, { lineId: line.id }, { token, useAuthToken: true });
                } catch (err) {
                    console.error('Failed to remove unselected line before placing order', line.id, err);
                }
            }
        }
    }

    await reapplyShippingSelection(token, shippingMethodIds, shippingPriceWithTax);

    const orderForDelivery = await getActiveOrderDeliveryContext(token);

    // First, transition the order to ArrangingPayment state
    await transitionToArrangingPayment();

    // Prepare metadata based on payment method
    const metadata: Record<string, unknown> = {};

    // For standard payment, include the required fields
    if (paymentMethodCode === 'standard-payment') {
        metadata.shouldDecline = false;
        metadata.shouldError = false;
        metadata.shouldErrorOnSettle = false;
    }

    // Add payment to the order
    const result = await mutate(
        AddPaymentToOrderMutation,
        {
            input: {
                method: paymentMethodCode,
                metadata,
            },
        },
        { token, useAuthToken: true }
    );

    if (result.data.addPaymentToOrder.__typename !== 'Order') {
        const errorResult = result.data.addPaymentToOrder;
        throw new Error(
            `Failed to place order: ${errorResult.errorCode} - ${errorResult.message}`
        );
    }

    const orderCode = result.data.addPaymentToOrder.code;

    try {
        await withTimeout(
            createExternalDeliveryOrders(orderForDelivery, paymentMethodCode, token),
            POST_PAYMENT_DELIVERY_TIMEOUT_MS,
            'La creacion de domicilios externos tardo demasiado y continuara fuera del flujo de pago',
        );
    } catch (err) {
        console.error('Failed to create external delivery order', err);
    }

    // Update the cart tag to immediately invalidate cached cart data
    // After placing the order, remove items from the active cart
    try {
        const activeOrderRes = await query(GetActiveOrderQuery, {}, { token, useAuthToken: true });
        const activeOrder = activeOrderRes.data.activeOrder;
        if (activeOrder && activeOrder.lines && activeOrder.lines.length > 0) {
            for (const line of activeOrder.lines) {
                try {
                    await mutate(RemoveFromCartMutation, { lineId: line.id }, { token, useAuthToken: true });
                } catch (err) {
                    // ignore individual removal errors
                    console.error('Failed to remove cart line', line.id, err);
                }
            }
        }
    } catch (err) {
        console.error('Failed to clear cart after order placement', err);
    }

    updateTag('cart');
    updateTag('active-order');

    redirect(`/order-confirmation/${orderCode}`);
}

export async function getPaymentSignature(amountInCents: number, paymentReference: string) {
    const cookiesStore = await cookies()
    const token = getAuthTokenFromCookies(cookiesStore)!;

    const signature = await query(GetWompiSignatureQuery, {
        amountInCents: amountInCents!,
        paymentReference: paymentReference
    }, {
        token
    })

    return signature.data.GetPaymentSignature;
}
