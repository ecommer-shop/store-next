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