'use client';

import { useEffect } from 'react';
import { syncCustomerWithVendure } from '@/lib/vendure/server/actions/sync-customer';

export function SyncCustomer() {
    useEffect(() => {
        syncCustomerWithVendure();
    }, []);

    return null;
}
