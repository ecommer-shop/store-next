'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import { getMySubscription, getAllPlans, stopAutoRenew, cancelSubscription } from './actions';
import BillingCard from '@/components/sellers/billing/BillingCard';
import WompiSubscriptionWidget from '@/components/sellers/billing/WompiSubscriptionWidget';
import Script from 'next/script';

interface Plan {
    id: number;
    name: string;
    price: number;
    billingInterval: string;
    description?: string;
    planFeatures: Array<{
        id: number;
        feature: { code: string; name: string; type: string };
        value: string;
    }>;
}

interface CustomerSubscription {
    id: number;
    status: string;
    startsAt?: string;
    endsAt?: string;
    autoRenew: boolean;
    plan: Plan;
    paymentMethodType?: string;
    paymentFlowType?: string;
    productLimit?: number;
    variationLimit?: number;
}

export default function BillingContent() {
    const t = useTranslations();
    const [subscription, setSubscription] = useState<CustomerSubscription | null | undefined>(undefined);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<'view' | 'plans' | 'payment'>('view');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            const [sub, allPlans] = await Promise.all([
                getMySubscription(),
                getAllPlans(),
            ]);
            setSubscription((sub as CustomerSubscription | null) ?? null);
            setPlans((allPlans as Plan[]) ?? []);
        } catch (err) {
            console.error('Failed to load billing data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStopAutoRenew = async () => {
        if (!subscription) return;
        setActionLoading('stopAutoRenew');
        try {
            const updated = await stopAutoRenew(subscription.id) as any;
            setSubscription(prev => prev ? { ...prev, autoRenew: updated.autoRenew, status: updated.status } : prev);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async () => {
        if (!subscription) return;
        const confirmed = confirm('¿Cancelar suscripción? Se degradará al plan Free.');
        if (!confirmed) return;
        setActionLoading('cancel');
        try {
            const updated = await cancelSubscription(subscription.id) as any;
            setSubscription(prev => prev ? { ...prev, status: updated.status, plan: updated.plan } : prev);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleSelectPlan = (planId: number) => {
        const plan = plans.find(p => p.id === planId);
        if (plan) {
            setSelectedPlan(plan);
            setStep('payment');
            setError(null);
        }
    };

    const handlePaymentSuccess = () => {
        setSelectedPlan(null);
        setStep('view');
        setError(null);
        loadData();
    };

    const handlePaymentError = (errMsg: string) => {
        setError(errMsg);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-2 py-20">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-muted-foreground">{t(I18N.Account.billing.loading.loading)}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t(I18N.Account.billing.content.title)}</h1>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent>
                        <p className="text-sm text-red-800">{error}</p>
                        <Button size="sm" variant="ghost" className="mt-2" onPress={() => setError(null)}>Cerrar</Button>
                    </CardContent>
                </Card>
            )}

            {step === 'payment' && selectedPlan ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Pago: {selectedPlan.name} — ${selectedPlan.price.toLocaleString('es-CO')}/mes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <WompiSubscriptionWidget
                            plan={selectedPlan}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                        <Button variant="ghost" size="sm" className="mt-4" onPress={() => { setStep('view'); setSelectedPlan(null); }}>
                            Cancelar
                        </Button>
                    </CardContent>
                </Card>
            ) : step === 'plans' ? (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-muted-foreground">{subscription ? 'Elige un nuevo plan' : 'Elige tu primer plan'}</p>
                        <Button variant="ghost" size="sm" onPress={() => setStep('view')}>Volver</Button>
                    </div>
                    <BillingCard
                        plans={plans}
                        currentPlanName={subscription?.plan?.name}
                    />
                </div>
            ) : (
                <>
                    {subscription ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    {t(I18N.Account.billing.content.currentPlan)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">{subscription.plan.name}</span>
                                    <span className="text-sm text-muted-foreground capitalize">{subscription.status.toLowerCase()}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>${subscription.plan.price.toLocaleString('es-CO')}/mes</div>
                                    {subscription.endsAt && (
                                        <div>{t(I18N.Account.billing.content.endsAt)}: {new Date(subscription.endsAt).toLocaleDateString('es-CO')}</div>
                                    )}
                                    <div>{t(I18N.Account.billing.content.autoRenew)}: {subscription.autoRenew ? 'Sí' : 'No'}</div>
                                    {subscription.paymentMethodType && (
                                        <div>{t(I18N.Account.billing.content.paymentMethod)}: {subscription.paymentMethodType}</div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3 pt-3 border-t">
                                    <Button onPress={() => setStep('plans')} variant="primary" size="sm">
                                        {t(I18N.Account.billing.content.changePlan)}
                                    </Button>
                                    {subscription.autoRenew && subscription.status === 'ACTIVE' && (
                                        <Button onPress={handleStopAutoRenew} variant="ghost" size="sm" isDisabled={actionLoading === 'stopAutoRenew'}>
                                            {t(I18N.Account.billing.content.stopAutoRenew)}
                                        </Button>
                                    )}
                                    {(subscription.status === 'ACTIVE' || subscription.status === 'GRACE_PERIOD') && (
                                        <Button onPress={handleCancel} variant="danger-soft" size="sm" isDisabled={actionLoading === 'cancel'}>
                                            {t(I18N.Account.billing.content.cancelSubscription)}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader><CardTitle>Plan</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">Aún no tienes un plan activo. Elige uno para empezar.</p>
                                <Button onPress={() => setStep('plans')} variant="primary">{t(I18N.Account.billing.content.changePlan)}</Button>
                            </CardContent>
                        </Card>
                    )}

                    {subscription?.status === 'GRACE_PERIOD' && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardContent>
                                <p className="text-sm text-orange-800">Tu suscripción está en período de gracia. Realiza el pago para evitar la suspensión.</p>
                            </CardContent>
                        </Card>
                    )}

                    {subscription?.status === 'SUSPENDED' && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent>
                                <p className="text-sm text-red-800">Tu suscripción ha sido suspendida. Activa un nuevo plan para reactivar tus productos.</p>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            <Script src="https://checkout.wompi.co/widget.js" strategy="afterInteractive" />
        </div>
    );
}
