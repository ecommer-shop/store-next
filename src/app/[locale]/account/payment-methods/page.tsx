import { Suspense } from 'react';
import { PaymentMethodsContent } from './payment-methods-content';
import PaymentMethodsLoading from './loading';

export default function PaymentMethodsPage() {
    return (
        <Suspense fallback={<PaymentMethodsLoading />}>
            <PaymentMethodsContent />
        </Suspense>
    );
}
