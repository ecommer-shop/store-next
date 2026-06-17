type GtagItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
};

function sendEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

export function trackViewItem(item: GtagItem) {
  sendEvent('view_item', { currency: 'COP', value: item.price, items: [item] });
}

export function trackAddToCart(item: GtagItem) {
  sendEvent('add_to_cart', {
    currency: 'COP',
    value: item.price,
    items: [{ ...item, quantity: item.quantity ?? 1 }],
  });
}

export function trackSearchResults(params: { search_term: string; results_count: number }) {
  sendEvent('view_search_results', params);
}

export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  currency: string;
  items: GtagItem[];
}) {
  sendEvent('purchase', params);
}