export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import AddressesContent from './addresses-content';

export default function AddressesPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading addresses…</p>}>
      <AddressesContent />
    </Suspense>
  );
}
