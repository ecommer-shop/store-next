
'use client';

import { useEffect } from 'react';
import { trackPurchase } from '@/lib/analytics/events';

interface PurchaseTrackerProps {
    orderCode: string;
    value: number;
    currency: string;
    items: Array<{ item_id: string; item_name: string; price: number; quantity: number }>;
}

export function PurchaseTracker({ orderCode, value, currency, items }: PurchaseTrackerProps) {
    useEffect(() => {
        const storageKey = `ga_purchase_tracked_${orderCode}`;
        if (sessionStorage.getItem(storageKey)) return;

        trackPurchase({ transaction_id: orderCode, value, currency, items });
        sessionStorage.setItem(storageKey, '1');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderCode]);

    return null;
}
