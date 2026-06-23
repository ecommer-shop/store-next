import { sendGTMEvent } from '@next/third-parties/google';

type GtagItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
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