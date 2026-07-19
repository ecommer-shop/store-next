'use client';

import { ExternalLink, Loader2, QrCode, Hash, Smartphone } from 'lucide-react';

interface ManualPaymentDisplayProps {
    asyncPaymentUrl?: string | null;
    qrImage?: string | null;
    url?: string | null;
    methodName: string;
    status?: string;
    extra?: Record<string, any> | null;
    isPolling?: boolean;
}

export function ManualPaymentDisplay({
    asyncPaymentUrl,
    qrImage,
    url,
    methodName,
    status,
    extra,
    isPolling,
}: ManualPaymentDisplayProps) {
    const payUrl = asyncPaymentUrl || url;

    const hasQr = !!qrImage;
    const hasPayUrl = !!payUrl;
    const hasCodes = extra?.business_agreement_code && extra?.payment_intention_identifier;

    // If we have no data yet and still polling
    if (isPolling && !hasQr && !hasPayUrl && !hasCodes) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <Loader2 className="w-8 h-8 text-[#9969F8] animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Procesando pago con {methodName}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Esperando confirmación. Esto puede tomar unos segundos.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                    {hasPayUrl
                        ? `Serás redirigido a ${methodName} para completar el pago.`
                        : hasQr
                        ? `Escanea el código QR con tu app bancaria para pagar con ${methodName}.`
                        : hasCodes
                        ? `Acércate a cualquier Corresponsal Bancario Bancolombia con los siguientes datos:`
                        : `Sigue las instrucciones para completar el pago con ${methodName}.`}
                </p>
            </div>

            {status === 'APPROVED' && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Pago aprobado exitosamente
                    </p>
                </div>
            )}

            {qrImage && (
                <div className="flex flex-col items-center gap-3 p-6">
                    {qrImage.startsWith('data:') ? (
                        <img src={qrImage} alt="QR de pago" className="w-48 h-48 rounded-xl shadow-lg" />
                    ) : (
                        <img src={`data:image/svg+xml;base64,${qrImage}`} alt="QR de pago" className="w-48 h-48 rounded-xl shadow-lg" />
                    )}
                    <p className="text-sm text-muted-foreground">
                        Escanea el código QR desde tu app bancaria
                    </p>
                </div>
            )}

            {payUrl && (
                <a
                    href={payUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#9969F8] text-white font-semibold hover:opacity-90 transition text-sm"
                >
                    <ExternalLink className="w-4 h-4" />
                    Ir a pagar
                </a>
            )}

            {hasCodes && (
                <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Convenio:</span>
                        <span className="text-sm font-mono font-bold">{extra?.business_agreement_code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Intención de pago:</span>
                        <span className="text-sm font-mono font-bold">{extra?.payment_intention_identifier}</span>
                    </div>
                </div>
            )}

            {status === 'PENDING' && hasPayUrl && (
                <p className="text-xs text-muted-foreground text-center">
                    Después de pagar, tu pedido se procesará automáticamente.
                </p>
            )}
        </div>
    );
}
