'use client';

import { useState } from 'react';
import { Button, Card } from '@heroui/react';
import { CreditCard, Smartphone, Building2, QrCode, Landmark, Wallet, ChevronRight } from 'lucide-react';
import { createSubscription, createPendingPayment, getPaymentSignature } from '@/app/[locale]/account/billing/actions';

interface Plan {
    id: number;
    name: string;
    price: number;
    billingInterval: string;
    description?: string;
}

interface WompiSubscriptionWidgetProps {
    plan: Plan;
    customerEmail?: string;
    customerName?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

const RECURRENT_METHODS = [
    { code: 'CARD', label: 'Tarjeta débito/crédito', icon: CreditCard },
    { code: 'NEQUI', label: 'Nequi', icon: Smartphone },
    { code: 'DAVIPLATA', label: 'DaviPlata', icon: Building2 },
    { code: 'BANCOLOMBIA_TRANSFER', label: 'Transferencia Bancolombia', icon: Landmark },
];

const MANUAL_METHODS = [
    { code: 'PSE', label: 'PSE', icon: Building2 },
    { code: 'BANCOLOMBIA_QR', label: 'Bancolombia QR', icon: QrCode },
    { code: 'BANCOLOMBIA_COLLECT', label: 'Bancolombia Collect', icon: Landmark },
    { code: 'BANCOLOMBIA_BNPL', label: 'Bancolombia Cuotas', icon: Wallet },
    { code: 'PCOL', label: 'Pago contra entrega', icon: CreditCard },
    { code: 'SU_PLUS', label: 'SuPLUS', icon: Smartphone },
];

declare global {
    interface Window {
        WidgetCheckout: new (config: any) => { open: (cb: (result: any) => void) => void };
    }
}

export default function WompiSubscriptionWidget({
    plan,
    customerEmail,
    onSuccess,
    onError,
}: WompiSubscriptionWidgetProps) {
    const [step, setStep] = useState<'method' | 'processing' | 'redirect' | 'done'>('method');
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [asyncPaymentUrl, setAsyncPaymentUrl] = useState<string | null>(null);
    const [qrImage, setQrImage] = useState<string | null>(null);

    const handleRecurrentPayment = async (methodCode: string) => {
        setStep('processing');
        setSelectedMethod(methodCode);

        try {
            const amountInCents = Math.round(plan.price);
            const uniqueReference = `SUB-${plan.id}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

            const signature = await getPaymentSignature(amountInCents, uniqueReference);

            const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || '';

            const checkout = new window.WidgetCheckout({
                currency: 'COP',
                amountInCents,
                reference: uniqueReference,
                publicKey,
                signature: { integrity: signature },
                customerData: {
                    email: customerEmail || '',
                    fullName: '',
                },
            });

            checkout.open(async ({ transaction }: any) => {
                if (transaction.status === 'APPROVED') {
                    try {
                        await createSubscription(transaction.id, plan.id, methodCode);
                        setStep('done');
                        onSuccess?.();
                    } catch (err: any) {
                        onError?.(err.message || 'Error al crear la suscripción');
                        setStep('method');
                    }
                } else if (transaction.status === 'DECLINED') {
                    onError?.('El pago fue declinado. Intenta con otro método.');
                    setStep('method');
                } else {
                    setStep('method');
                }
            });
        } catch (err: any) {
            onError?.(err.message || 'Error al procesar el pago');
            setStep('method');
        }
    };

    const handleManualPayment = async (methodCode: string) => {
        setStep('processing');
        setSelectedMethod(methodCode);

        try {
            const result: any = await createPendingPayment(plan.id, methodCode);

            setAsyncPaymentUrl(result.asyncPaymentUrl || null);
            setQrImage(result.qrImage || null);
            setStep('redirect');
        } catch (err: any) {
            onError?.(err.message || 'Error al crear el pago pendiente');
            setStep('method');
        }
    };

    const handleMethodClick = (methodCode: string, isRecurrent: boolean) => {
        if (isRecurrent) {
            handleRecurrentPayment(methodCode);
        } else {
            handleManualPayment(methodCode);
        }
    };

    if (step === 'done') {
        return (
            <Card className="text-center py-10">
                <div className="space-y-4 px-6">
                    <div className="text-4xl">✅</div>
                    <h3 className="text-xl font-semibold">Suscripción activada</h3>
                    <p className="text-muted-foreground">
                        Tu plan <strong>{plan.name}</strong> ha sido activado exitosamente.
                    </p>
                    <Button variant="primary" onPress={onSuccess}>
                        Continuar
                    </Button>
                </div>
            </Card>
        );
    }

    if (step === 'redirect') {
        return (
            <Card className="text-center py-10">
                <div className="space-y-4 px-6">
                    <div className="text-4xl">🔄</div>
                    <h3 className="text-xl font-semibold">Pago pendiente</h3>
                    <p className="text-muted-foreground">
                        Tu solicitud para el plan <strong>{plan.name}</strong> está siendo procesada.
                    </p>

                    {asyncPaymentUrl && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">
                                Completa el pago en la siguiente página:
                            </p>
                            <a
                                href={asyncPaymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="primary" className="w-full">
                                    Ir a pagar <ChevronRight className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    )}

                    {qrImage && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">
                                Escanea el código QR para pagar:
                            </p>
                            <img src={qrImage} alt="QR de pago" className="mx-auto w-48 h-48 object-contain" />
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        La suscripción se activará automáticamente cuando el pago sea confirmado.
                    </p>
                </div>
            </Card>
        );
    }

    if (step === 'processing') {
        return (
            <Card className="text-center py-10">
                <div className="space-y-4 px-6">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <h3 className="text-xl font-semibold">Procesando pago...</h3>
                    <p className="text-muted-foreground">
                        Plan: {plan.name} — ${plan.price.toLocaleString('es-CO')}/mes
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold">
                    Plan: {plan.name} — ${plan.price.toLocaleString('es-CO')}/mes
                </h3>
                <p className="text-sm text-muted-foreground">Selecciona un método de pago</p>
            </div>

            <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Pago recurrente
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {RECURRENT_METHODS.map((method) => {
                        const Icon = method.icon;
                        return (
                            <Button
                                key={method.code}
                                variant="ghost"
                                className="justify-start h-auto py-3"
                                onPress={() => handleMethodClick(method.code, true)}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="text-sm">{method.label}</span>
                            </Button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Pago manual
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MANUAL_METHODS.map((method) => {
                        const Icon = method.icon;
                        return (
                            <Button
                                key={method.code}
                                variant="ghost"
                                className="justify-start h-auto py-3"
                                onPress={() => handleMethodClick(method.code, false)}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="text-sm">{method.label}</span>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
