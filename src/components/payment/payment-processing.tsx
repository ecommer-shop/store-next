'use client';

import { Loader2, ShieldAlert } from 'lucide-react';

interface PaymentProcessingProps {
    isThreeDs: boolean;
    threeDsMethodData?: string | null;
    onThreeDsComplete?: () => void;
}

export function PaymentProcessing({ isThreeDs, threeDsMethodData, onThreeDsComplete }: PaymentProcessingProps) {
    if (isThreeDs && threeDsMethodData) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                    <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-medium">Autenticación 3D Secure requerida</p>
                        <p>Tu banco solicita verificación adicional. Completa la autenticación para continuar.</p>
                    </div>
                </div>
                <form
                    method="POST"
                    action="https://acs.wompi.co/3ds-method"
                    target="threeDsIframe"
                    className="hidden"
                >
                    <input name="threeDSMethodData" value={threeDsMethodData} readOnly />
                </form>
                <iframe
                    name="threeDsIframe"
                    className="w-full h-96 rounded-xl border-2 border-gray-200"
                    title="Autenticación 3D Secure"
                    onLoad={onThreeDsComplete}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-10 h-10 text-[#9969F8] animate-spin" />
            <p className="text-sm text-muted-foreground">Procesando tu pago...</p>
        </div>
    );
}
