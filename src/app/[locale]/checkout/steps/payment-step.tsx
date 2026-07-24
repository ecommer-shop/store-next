'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Shield } from 'lucide-react';
import Script from 'next/script';
import { useCheckout } from '../checkout-provider';
import { trackAddPaymentInfo } from '@/lib/analytics/events';
import { getPaymentSignature, placeOrder as placeOrderAction, initWompiTransaction, initWompiSavedCardTransaction, confirmWompiPayment, getWompiTransactionStatus, getSavedPaymentMethodsForCheckout, createWompiPaymentSource, saveWompiPaymentMethod } from '../actions';
import { useSelectedItems } from '@/app/[locale]/cart/selected-items-context';
import { CurrencyCode } from '@/models/payment';
import { Price } from '@/components/commerce/price';
import { MethodSelector } from '@/components/payment/method-selector';
import { SavedMethodSelector } from '@/components/payment/saved-method-selector';
import { CardForm } from '@/components/payment/card-form';
import { CardPreview } from '@/components/payment/card-preview';
import { NequiForm } from '@/components/payment/nequi-form';
import { DaviplataForm } from '@/components/payment/daviplata-form';
import { PseForm, type PseData } from '@/components/payment/pse-form';
import { ManualPaymentDisplay } from '@/components/payment/manual-payment-display';
import { PaymentProcessing } from '@/components/payment/payment-processing';

interface PaymentStepProps {
    onComplete: () => void;
    pb: string;
    uri: string;
}

type PaymentFlowStep = 'select' | 'form' | 'processing' | 'async_payment' | 'complete';

export default function PaymentStep({ pb, uri, onComplete }: PaymentStepProps) {
    const { order, setSelectedPaymentMethodCode } = useCheckout();
    const { selectedLineIds } = useSelectedItems();
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [flowStep, setFlowStep] = useState<PaymentFlowStep>('select');
    const [loading, setLoading] = useState(false);
    const [saveCard, setSaveCard] = useState(false);
    const [installments, setInstallments] = useState(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Saved cards state
    const [savedMethods, setSavedMethods] = useState<any[]>([]);
    const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

    // Processing state
    const [asyncPaymentUrl, setAsyncPaymentUrl] = useState<string | null>(null);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [isThreeDs, setIsThreeDs] = useState(false);
    const [threeDsData, setThreeDsData] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    // Card form state
    const [cardToken, setCardToken] = useState<string | null>(null);
    const [cardData, setCardData] = useState<{
        lastFour: string;
        brand: string;
        expiryMonth: string;
        expiryYear: string;
        cardHolder: string;
    } | null>(null);
    const [nequiPhone, setNequiPhone] = useState<string | null>(null);
    const [daviplataPhone, setDaviplataPhone] = useState<string | null>(null);

    useEffect(() => {
        loadSavedMethods();
    }, []);

    const openWompi = async () => {
        if (!pb) return;
        setLoading(true);
        setErrorMessage(null);
        try {
            const amountInCents = Math.round(getSelectedOrderTotal());
            const uniqueReference = `${order.code}-${crypto.randomUUID().replace(/-/g, '')}`;
            const signature = await getPaymentSignature(amountInCents, uniqueReference);

            // @ts-ignore
            const checkout = new window.WidgetCheckout({
                currency: CurrencyCode.COP,
                amountInCents,
                reference: uniqueReference,
                publicKey: pb,
                redirectUrl: `https://ecommer.shop/order-confirmation/${order.code}`,
                signature: { integrity: signature },
                customerData: {
                    email: order.customer?.emailAddress,
                    fullName: order.customer?.firstName,
                },
            });

            checkout.open(async ({ transaction }: any) => {
                const status = transaction.status?.toUpperCase();
                if (status === 'APPROVED') {
                    setSelectedPaymentMethodCode('wompi');
                    setPaymentSuccess(true);
                    await finalizeOrder();
                } else if (status === 'DECLINED') {
                    setErrorMessage('El pago fue rechazado. Intenta con otro método de pago.');
                    setLoading(false);
                } else if (status === 'PENDING') {
                    setErrorMessage('El pago quedó pendiente. Revisa el estado antes de intentar nuevamente.');
                    setLoading(false);
                }
            });
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'No se pudo abrir Wompi.');
            setLoading(false);
        }
    };

    async function loadSavedMethods() {
        try {
            const methods = await getSavedPaymentMethodsForCheckout();
            if (Array.isArray(methods)) {
                setSavedMethods(methods);
            }
        } catch {
        }
    }

    const getSelectedOrderTotal = () => {
        const selectedLines = order.lines.filter((line) => selectedLineIds.includes(line.id));
        const subtotal = selectedLines.reduce((sum, line) => sum + line.linePriceWithTax, 0);
        const discountTotal = order.discounts?.reduce((sum, d) => sum + d.amountWithTax, 0) ?? 0;
        return subtotal + order.shippingWithTax - discountTotal;
    };

    const selectedShippingMethodIds = () =>
        order.shippingLines
            ?.map((line) => line.shippingMethod?.id)
            .filter((id): id is string => Boolean(id)) ?? [];

    const handleTestPayment = () => {
        setSelectedPaymentMethodCode('wompi');
        setPaymentSuccess(true);
        void finalizeOrder();
    };

    const finalizeOrder = async () => {
        trackAddPaymentInfo({ payment_type: selectedMethod || '' });
        setLoading(true);
        setErrorMessage(null);
        try {
            await placeOrderAction(
                'wompi',
                selectedLineIds,
                selectedShippingMethodIds(),
                order.shippingWithTax,
            );
            onComplete();
        } catch (error) {
            if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) throw error;
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'El pago fue aprobado, pero no se pudo finalizar el pedido.',
            );
            setLoading(false);
        }
    };

    const pollTransactionStatus = useCallback(async (txId: string) => {
        return new Promise<void>((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 30;
            const poll = setInterval(async () => {
                attempts++;
                try {
                    const status = await getWompiTransactionStatus(txId);
                    if (status?.status === 'APPROVED') {
                        clearInterval(poll);
                        resolve();
                    } else if (status?.status === 'DECLINED' || status?.status === 'ERROR') {
                        clearInterval(poll);
                        reject(new Error(status?.statusMessage || 'El pago fue rechazado'));
                    }
                } catch { }
                if (attempts >= maxAttempts) {
                    clearInterval(poll);
                    reject(new Error('Tiempo de espera agotado'));
                }
            }, 2000);
        });
    }, []);

    const handleMethodSelect = async (code: string) => {
        setSelectedMethod(code);
        setErrorMessage(null);
        setFlowStep('form');
        setSelectedSavedId(null);
    };

    const handleSavedMethodSelect = async (method: any) => {
        setSelectedSavedId(method.id);
        setSelectedMethod(method.type);
        setErrorMessage(null);

        if (method.type === 'CARD') {
            setFlowStep('form');
            return;
        }

        await proceedWithSavedMethod(method, 1);
    };

    const proceedWithSavedMethod = async (method: any, installmentsCount: number) => {
        const total = getSelectedOrderTotal();
        const amountInCents = Math.round(total);
        const uniqueReference = `${order.code}-${Date.now()}`;
        const acceptanceToken = await getAcceptanceToken(pb);

        setFlowStep('processing');

        try {
            const result = await initWompiSavedCardTransaction({
                paymentSourceId: method.wompiPaymentSourceId,
                acceptanceToken,
                customerEmail: order.customer?.emailAddress || '',
                amountInCents,
                reference: uniqueReference,
                currency: CurrencyCode.COP,
                type: method.type,
                installments: installmentsCount,
            });

            if (result?.transactionId) {
                setTransactionId(result.transactionId);

                if (result.paymentMethodExtra?.isThreeDs) {
                    setIsThreeDs(true);
                    setThreeDsData(result.paymentMethodExtra.threeDsAuth?.threeDsMethodData || null);
                    await pollTransactionStatus(result.transactionId);
                    setIsThreeDs(false);
                } else if (result.status === 'APPROVED') {
                    const confirmResult = await confirmWompiPayment(result.transactionId, false);
                    if (confirmResult?.success) {
                        setFlowStep('complete');
                        await finalizeOrder();
                    } else {
                        throw new Error(confirmResult?.errorMessage || 'Error al confirmar el pago');
                    }
                } else {
                    await pollTransactionStatus(result.transactionId);
                    const confirmResult = await confirmWompiPayment(result.transactionId, false);
                    if (confirmResult?.success) {
                        setFlowStep('complete');
                        await finalizeOrder();
                    } else {
                        throw new Error(confirmResult?.errorMessage || 'Error al confirmar el pago');
                    }
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Error al procesar el pago');
            setFlowStep('form');
        }
    };

    const handleCardTokenized = async (data: { token: string; lastFour: string; brand: string; expiryMonth: string; expiryYear: string; cardHolder: string }) => {
        setCardToken(data.token);
        setCardData(data);
        setFlowStep('processing');

        try {
            const paymentSource = await createWompiPaymentSource({
                token: data.token,
                type: 'CARD',
                customerEmail: order.customer?.emailAddress || '',
            });

            const total = getSelectedOrderTotal();
            const amountInCents = Math.round(total);
            const uniqueReference = `${order.code}-${Date.now()}`;

            const result = await initWompiSavedCardTransaction({
                paymentSourceId: String(paymentSource.id),
                acceptanceToken: '',
                customerEmail: order.customer?.emailAddress || '',
                amountInCents,
                reference: uniqueReference,
                currency: CurrencyCode.COP,
                type: 'CARD',
                installments,
            });

            if (result?.transactionId) {
                setTransactionId(result.transactionId);

                if (result.paymentMethodExtra?.isThreeDs) {
                    setIsThreeDs(true);
                    setThreeDsData(result.paymentMethodExtra.threeDsAuth?.threeDsMethodData || null);
                    await pollTransactionStatus(result.transactionId);
                    setIsThreeDs(false);
                }

                const confirmResult = await confirmWompiPayment(result.transactionId, saveCard);
                if (confirmResult?.success) {
                    if (saveCard && paymentSource?.id) {
                        try {
                            await saveWompiPaymentMethod({
                                wompiPaymentSourceId: String(paymentSource.id),
                                type: 'CARD',
                                lastFour: data.lastFour,
                                brand: data.brand,
                                expiryMonth: data.expiryMonth,
                                expiryYear: data.expiryYear,
                                cardHolderName: data.cardHolder,
                            });
                        } catch { }
                    }
                    setFlowStep('complete');
                    await finalizeOrder();
                } else {
                    throw new Error(confirmResult?.errorMessage || 'Error al confirmar el pago');
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Error al procesar el pago');
            setFlowStep('form');
        }
    };

    const handleNequiTokenized = async (data: { token: string; lastFour: string; brand: string; expiryMonth: string; expiryYear: string; cardHolder: string }) => {
        setNequiPhone(data.cardHolder);
        setFlowStep('processing');

        try {
            const paymentSource = await createWompiPaymentSource({
                token: data.token,
                type: 'NEQUI',
                customerEmail: order.customer?.emailAddress || '',
            });

            const total = getSelectedOrderTotal();
            const amountInCents = Math.round(total);
            const uniqueReference = `${order.code}-${Date.now()}`;

            const result = await initWompiSavedCardTransaction({
                paymentSourceId: String(paymentSource.id),
                acceptanceToken: '',
                customerEmail: order.customer?.emailAddress || '',
                amountInCents,
                reference: uniqueReference,
                currency: CurrencyCode.COP,
                type: 'NEQUI',
                installments: 1,
            });

            if (result?.transactionId) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await pollTransactionStatus(result.transactionId);
                const confirmResult = await confirmWompiPayment(result.transactionId, false);
                if (confirmResult?.success) {
                    try {
                        await saveWompiPaymentMethod({
                            wompiPaymentSourceId: String(paymentSource.id),
                            type: 'NEQUI',
                            lastFour: data.lastFour,
                            brand: data.brand,
                            cardHolderName: data.cardHolder,
                        });
                    } catch { }
                    setFlowStep('complete');
                    await finalizeOrder();
                } else {
                    throw new Error(confirmResult?.errorMessage || 'Error al confirmar el pago');
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Error al procesar el pago');
            setFlowStep('form');
        }
    };

    const handleDaviplataTokenized = async (data: { token: string; lastFour: string; brand: string; expiryMonth: string; expiryYear: string; cardHolder: string }) => {
        setDaviplataPhone(data.cardHolder);
        setFlowStep('processing');

        try {
            const paymentSource = await createWompiPaymentSource({
                token: data.token,
                type: 'DAVIPLATA',
                customerEmail: order.customer?.emailAddress || '',
            });

            const total = getSelectedOrderTotal();
            const amountInCents = Math.round(total);
            const uniqueReference = `${order.code}-${Date.now()}`;

            const result = await initWompiSavedCardTransaction({
                paymentSourceId: String(paymentSource.id),
                acceptanceToken: '',
                customerEmail: order.customer?.emailAddress || '',
                amountInCents,
                reference: uniqueReference,
                currency: CurrencyCode.COP,
                type: 'DAVIPLATA',
                installments: 1,
            });

            if (result?.transactionId) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                await pollTransactionStatus(result.transactionId);
                const confirmResult = await confirmWompiPayment(result.transactionId, false);
                if (confirmResult?.success) {
                    try {
                        await saveWompiPaymentMethod({
                            wompiPaymentSourceId: String(paymentSource.id),
                            type: 'DAVIPLATA',
                            lastFour: data.lastFour,
                            brand: data.brand,
                            cardHolderName: data.cardHolder,
                        });
                    } catch { }
                    setFlowStep('complete');
                    await finalizeOrder();
                } else {
                    throw new Error(confirmResult?.errorMessage || 'Error al confirmar el pago');
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Error al procesar el pago');
            setFlowStep('form');
        }
    };

    const [manualPolling, setManualPolling] = useState(false);
    const [paymentExtra, setPaymentExtra] = useState<Record<string, any> | null>(null);

    const handleManualPayment = async (method: string, pseData?: PseData) => {
        setFlowStep('processing');

        const total = getSelectedOrderTotal();
        const amountInCents = Math.round(total);
        const uniqueReference = `${order.code}-${Date.now()}`;

        try {
            const result = await initWompiTransaction({
                customerEmail: order.customer?.emailAddress || '',
                amountInCents,
                reference: uniqueReference,
                currency: CurrencyCode.COP,
                saveCard: false,
                paymentMethodCode: method,
                financialInstitutionCode: pseData?.financialInstitutionCode,
                userType: pseData?.userType,
                userLegalIdType: pseData?.userLegalIdType,
                userLegalId: pseData?.userLegalId,
                paymentDescription: pseData?.paymentDescription,
            });

            if (result?.transactionId) {
                setTransactionId(result.transactionId);
                setAsyncPaymentUrl(result.asyncPaymentUrl || null);
                setQrImage(result.qrImage || null);
                setPaymentExtra(null);
                setManualPolling(true);
                setFlowStep('async_payment');
                pollManualTransaction(result.transactionId);
            } else if (result?.status === 'APPROVED') {
                const confirmResult = await confirmWompiPayment(result.transactionId, false);
                if (confirmResult?.success) {
                    setFlowStep('complete');
                    await finalizeOrder();
                }
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Error al iniciar el pago');
            setFlowStep('form');
        }
    };

    const pollManualTransaction = async (txId: string) => {
        let attempts = 0;
        const maxAttempts = 60;
        const poll = setInterval(async () => {
            attempts++;
            try {
                const status = await getWompiTransactionStatus(txId);
                if (!status) return;

                if (status.url) setAsyncPaymentUrl(status.url);
                if (status.asyncPaymentUrl) setAsyncPaymentUrl(status.asyncPaymentUrl);
                if (status.qrImage) setQrImage(status.qrImage);
                if (status.paymentMethodExtra) setPaymentExtra(status.paymentMethodExtra as any);

                if (status.status === 'APPROVED') {
                    clearInterval(poll);
                    setManualPolling(false);
                    const confirmResult = await confirmWompiPayment(txId, false);
                    if (confirmResult?.success) {
                        setFlowStep('complete');
                        await finalizeOrder();
                    }
                } else if (status.status === 'DECLINED' || status.status === 'ERROR') {
                    clearInterval(poll);
                    setManualPolling(false);
                    setErrorMessage(status.statusMessage || 'El pago fue rechazado');
                    setFlowStep('async_payment');
                }
            } catch { }
            if (attempts >= maxAttempts) {
                clearInterval(poll);
                setManualPolling(false);
                setErrorMessage('Tiempo de espera agotado. Contacta a soporte.');
            }
        }, 2000);
    };

    const handlePseConfirm = async (pseData: PseData) => {
        if (selectedMethod === 'PSE') {
            await handleManualPayment('PSE', pseData);
        }
    };

    const totalAmount = getSelectedOrderTotal();

    const methodNames: Record<string, string> = {
        'CARD': 'tarjeta',
        'NEQUI': 'Nequi',
        'DAVIPLATA': 'Daviplata',
        'PSE': 'PSE',
        'BANCOLOMBIA_QR': 'Bancolombia QR',
        'BANCOLOMBIA_COLLECT': 'Bancolombia Recaudo',
        'BANCOLOMBIA_BNPL': 'Bancolombia Cuotas',
        'SU_PLUS': 'Su Plus',
    };

    return (
        <>
        <div className="space-y-5 pt-2">
            {/* Total display */}
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total a pagar</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                    <Price value={totalAmount} currencyCode={order.currencyCode} />
                </span>
            </div>

            {/* Step: Method Selection */}
            {flowStep === 'select' && (
                <div className="space-y-4">
                    {savedMethods.length > 0 && (
                        <SavedMethodSelector
                            methods={savedMethods}
                            selectedId={selectedSavedId}
                            onSelect={handleSavedMethodSelect}
                            onUseNewCard={() => setFlowStep('select')}
                        />
                    )}

                    <div>
                        {savedMethods.length > 0 && (
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Otros métodos de pago
                            </p>
                        )}
                        <MethodSelector
                            selectedCode={selectedMethod}
                            onSelect={handleMethodSelect}
                        />
                    </div>
                </div>
            )}

            {/* Step: Form */}
            {flowStep === 'form' && selectedMethod && (
                <div className="space-y-4">
                    {!selectedSavedId && (
                        <button
                            onClick={() => { setFlowStep('select'); setSelectedMethod(null); setErrorMessage(null); }}
                            className="text-sm text-[#9969F8] hover:underline"
                        >
                            ← Cambiar método de pago
                        </button>
                    )}

                    {selectedMethod === 'CARD' && selectedSavedId && (
                        <div className="space-y-4">
                            <button
                                onClick={() => { setFlowStep('select'); setSelectedSavedId(null); setSelectedMethod(null); setErrorMessage(null); }}
                                className="text-sm text-[#9969F8] hover:underline"
                            >
                                ← Cambiar método de pago
                            </button>

                            {savedMethods.find(m => m.id === selectedSavedId) && (
                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        {savedMethods.find(m => m.id === selectedSavedId)?.brand} •••• {savedMethods.find(m => m.id === selectedSavedId)?.lastFour}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Tarjeta guardada
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Número de cuotas
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 6, 12, 24, 36].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => {
                                                setInstallments(n);
                                                const method = savedMethods.find(m => m.id === selectedSavedId);
                                                if (method) proceedWithSavedMethod(method, n);
                                            }}
                                            className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                                                installments === n
                                                    ? 'border-[#9969F8] bg-[#9969F8]/10 text-[#9969F8]'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#9969F8]/40'
                                            }`}
                                        >
                                            {n === 1 ? 'Contado' : `${n} cuotas`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedMethod === 'CARD' && !selectedSavedId && (
                        <div className="space-y-4">
                            {cardData && (
                                <CardPreview
                                    number={cardData.lastFour.padStart(16, '•')}
                                    cardHolder={cardData.cardHolder}
                                    expiryMonth={cardData.expiryMonth}
                                    expiryYear={cardData.expiryYear}
                                    brand={cardData.brand}
                                />
                            )}
                            <CardForm
                                publicKey={pb}
                                onTokenize={handleCardTokenized}
                                isLoading={loading}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Número de cuotas
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 6, 12, 24, 36].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setInstallments(n)}
                                            className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                                                installments === n
                                                    ? 'border-[#9969F8] bg-[#9969F8]/10 text-[#9969F8]'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#9969F8]/40'
                                            }`}
                                        >
                                            {n === 1 ? 'Contado' : `${n} cuotas`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={saveCard}
                                    onChange={(e) => setSaveCard(e.target.checked)}
                                    className="accent-[#9969F8]"
                                />
                                Guardar esta tarjeta para futuras compras
                            </label>

                            
                        </div>
                    )}

                    {selectedMethod === 'NEQUI' && (
                        <NequiForm
                            publicKey={pb}
                            onTokenize={handleNequiTokenized}
                            isLoading={loading}
                        />
                    )}

                    {selectedMethod === 'DAVIPLATA' && (
                        <DaviplataForm
                            publicKey={pb}
                            onTokenize={handleDaviplataTokenized}
                            isLoading={loading}
                        />
                    )}

                    {selectedMethod === 'PSE' && (
                        <PseForm
                            onConfirm={handlePseConfirm}
                            isLoading={loading}
                        />
                    )}

                    {selectedMethod && ['BANCOLOMBIA_QR', 'BANCOLOMBIA_COLLECT', 'BANCOLOMBIA_BNPL', 'SU_PLUS'].includes(selectedMethod) && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    Serás redirigido a {methodNames[selectedMethod] || selectedMethod} para completar el pago.
                                </p>
                            </div>

                            {errorMessage && (
                                <div className="flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                onClick={() => handleManualPayment(selectedMethod)}
                                disabled={loading}
                                className="w-full py-3 px-6 rounded-xl bg-[#9969F8] text-white font-semibold hover:bg-[#8858e7] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Procesando...
                                    </span>
                                ) : (
                                    'Pagar con ' + (methodNames[selectedMethod] || selectedMethod)
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Step: Processing */}
            {flowStep === 'processing' && (
                <PaymentProcessing
                    isThreeDs={isThreeDs}
                    threeDsMethodData={threeDsData}
                    onThreeDsComplete={() => {
                        if (transactionId) {
                            pollTransactionStatus(transactionId).then(async () => {
                                const confirmResult = await confirmWompiPayment(transactionId, saveCard);
                                if (confirmResult?.success) {
                                    setFlowStep('complete');
                                    await finalizeOrder();
                                }
                            }).catch((err) => {
                                setErrorMessage(err.message);
                                setFlowStep('form');
                            });
                        }
                    }}
                />
            )}

            {/* Step: Async Payment (PSE, QR, etc.) */}
            {flowStep === 'async_payment' && selectedMethod && (
                <ManualPaymentDisplay
                    asyncPaymentUrl={asyncPaymentUrl}
                    qrImage={qrImage}
                    url={asyncPaymentUrl}
                    methodName={methodNames[selectedMethod] || selectedMethod}
                    isPolling={manualPolling}
                    extra={paymentExtra}
                />
            )}

            {/* Error */}
            {errorMessage && flowStep !== 'processing' && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    {errorMessage}
                </div>
            )}

            {/* Security note */}
            {flowStep === 'select' && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Pago 100% seguro procesado por Wompi. Tus datos están protegidos con encriptación SSL.</span>
                </div>
            )}
        </div>

        {/* Wompi Widget Script (for openWompi alternative) */}
        <Script
            src="https://checkout.wompi.co/widget.js"
            strategy="afterInteractive"
        />
    </>
    );
}

// Helper to get acceptance token from Wompi
async function getAcceptanceToken(publicKey: string): Promise<string> {
    const apiBase = publicKey?.startsWith('pub_test_')
        ? 'https://sandbox.wompi.co'
        : 'https://production.wompi.co';

    try {
        const res = await fetch(`${apiBase}/merchants/${publicKey}`);
        const json = await res.json();
        return json.data?.presigned_acceptance?.acceptance_token || '';
    } catch {
        return '';
    }
}
