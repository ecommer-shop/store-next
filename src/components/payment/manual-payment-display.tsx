'use client';

import { ExternalLink, QrCode } from 'lucide-react';

interface ManualPaymentDisplayProps {
    asyncPaymentUrl?: string | null;
    qrImage?: string | null;
    methodName: string;
}

export function ManualPaymentDisplay({ asyncPaymentUrl, qrImage, methodName }: ManualPaymentDisplayProps) {
    return (
        <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                    Sigue las instrucciones para completar el pago con {methodName}.
                    Una vez realizado, tu pedido se procesará automáticamente.
                </p>
            </div>

            {qrImage && (
                <div className="flex flex-col items-center gap-3 p-6">
                    <img src={qrImage} alt="QR de pago" className="w-48 h-48 rounded-xl shadow-lg" />
                    <p className="text-sm text-muted-foreground">
                        Escanea el código QR desde tu app bancaria
                    </p>
                </div>
            )}

            {asyncPaymentUrl && (
                <a
                    href={asyncPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#9969F8] text-white font-semibold hover:opacity-90 transition text-sm"
                >
                    <ExternalLink className="w-4 h-4" />
                    Ir a pagar
                </a>
            )}
        </div>
    );
}
