import { sendGTMEvent } from '@next/third-parties/google';

type GtagItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  seller_name?: string;
};

function pushEcommerceEvent(eventName: string, ecommerce: Record<string, unknown>) {
  sendGTMEvent({ event: eventName, ecommerce });
}

function pushEvent(eventName: string, params: Record<string, unknown> = {}) {
  sendGTMEvent({ event: eventName, ...params });
}

export function trackViewItem(item: GtagItem) {
  pushEcommerceEvent('view_item', { currency: 'COP', value: item.price, items: [item] });
}

export function trackAddToCart(item: GtagItem) {
  pushEcommerceEvent('add_to_cart', {
    currency: 'COP',
    value: item.price,
    items: [{ ...item, quantity: item.quantity ?? 1 }],
  });
}

export function trackSearchResults(params: { search_term: string; results_count: number }) {
  pushEvent('view_search_results', params);
}

export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  currency: string;
  items: GtagItem[];
}) {
  pushEcommerceEvent('purchase', params);
}

export function trackSearch(params: { search_term: string }) {
  pushEvent('search', params);
}

export function trackClickExplore() {
  pushEvent('click_explore');
}

export function trackClickCategory(params: { category_name: string }) {
  pushEvent('click_category', params);
}

export function trackClickSellerProfile(params: { seller_name: string }) {
  pushEvent('click_seller_profile', params);
}

export function trackShareProduct(params: { item_id: string; share_method: string }) {
  pushEvent('share_product', params);
}

export function trackLogin(params: { method: 'Google' | 'email' | string }) {
  pushEvent('login', params);
}

export function trackSignup(params: { method: 'Google' | 'email' | string }) {
  pushEvent('signup', params);
}

export function trackViewItemList(params: { items: GtagItem[]; list_name: string }) {
  pushEcommerceEvent('view_item_list', { item_list_name: params.list_name, items: params.items });
}

export function trackSelectItem(item: GtagItem & { list_name?: string }) {
  pushEcommerceEvent('select_item', { items: [item] });
}

export function trackBeginCheckout(params: { items: GtagItem[]; value: number; currency?: string }) {
  pushEcommerceEvent('begin_checkout', {
    currency: params.currency ?? 'COP',
    value: params.value,
    items: params.items,
  });
}

export function trackAddShippingInfo(params: { shipping_tier: string }) {
  pushEvent('add_shipping_info', params);
}

export function trackAddPaymentInfo(params: { payment_type: string }) {
  pushEvent('add_payment_info', params);
}
