'use client';

import { useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CheckCircle2, ShoppingBag, Globe } from 'lucide-react';
import { getBillingAdminUrl } from '@/lib/sellers-landing-url';
import { CardFooter } from '@heroui/react';

interface PlanFeatureEntry {
    id: number;
    feature: { code: string; name: string; type: string };
    value: string;
}

interface Plan {
    id: number;
    name: string;
    price: number;
    billingInterval: string;
    description?: string;
    planFeatures: PlanFeatureEntry[];
}

interface BillingCardProps {
    plans?: Plan[];
    currentPlanName?: string;
}

const PLAN_META: Record<string, { icon: React.ReactNode; gradient: string; shadow: string }> = {
    Free: {
        icon: <CheckCircle2 className="h-10 w-10 text-green-400" />,
        gradient: 'from-green-500/20 to-emerald-500/10',
        shadow: 'shadow-green-500/10',
    },
    Tienda: {
        icon: <ShoppingBag className="h-10 w-10 text-purple-400" />,
        gradient: 'from-purple-500/20 to-blue-500/10',
        shadow: 'shadow-purple-500/10',
    },
    Omnichannel: {
        icon: <Globe className="h-10 w-10 text-blue-400" />,
        gradient: 'from-blue-500/20 to-cyan-500/10',
        shadow: 'shadow-blue-500/10',
    },
};

const DEFAULT_PLANS: Plan[] = [
    {
        id: 1, name: 'Free', price: 0, billingInterval: 'monthly', description: 'Perfecto para empezar',
        planFeatures: [
            { id: 1, feature: { code: 'max_products', name: 'Productos', type: 'numeric' }, value: '15' },
            { id: 2, feature: { code: 'max_variations', name: 'Variaciones', type: 'numeric' }, value: '250' },
        ],
    },
    {
        id: 2, name: 'Tienda', price: 29900, billingInterval: 'monthly', description: 'Para negocios en crecimiento',
        planFeatures: [
            { id: 3, feature: { code: 'max_products', name: 'Productos', type: 'numeric' }, value: '500' },
            { id: 4, feature: { code: 'max_variations', name: 'Variaciones', type: 'numeric' }, value: '5000' },
            { id: 5, feature: { code: 'ai_access', name: 'Acceso a IA', type: 'boolean' }, value: 'true' },
            
        ],
    },
    {
        id: 3, name: 'Omnichannel', price: 99900, billingInterval: 'monthly', description: 'Operación completa multicanal',
        planFeatures: [
            { id: 7, feature: { code: 'max_products', name: 'Productos', type: 'numeric' }, value: '1500' },
            { id: 8, feature: { code: 'max_variations', name: 'Variaciones', type: 'numeric' }, value: '15000' },
            { id: 9, feature: { code: 'ai_access', name: 'Acceso a IA', type: 'boolean' }, value: 'true' },
           
        ],
    },
];

function TiltCard({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateY = useSpring(x, { stiffness: 300, damping: 30 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / 10;
        const deltaY = (e.clientY - centerY) / 10;
        x.set(deltaX);
        y.set(-deltaY);
    }, []);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, []);

    return (
        <motion.div
            ref={ref}
            onMouseMove={onClick ? handleMouseMove : undefined}
            onMouseLeave={onClick ? handleMouseLeave : undefined}
            onClick={onClick}
            style={{
                transformStyle: 'preserve-3d',
                rotateX,
                rotateY,
            }}
            className={onClick ? 'cursor-pointer' : 'cursor-default'}
        >
            {children}
        </motion.div>
    );
}

export default function BillingCard({ plans, currentPlanName }: BillingCardProps) {
    const t = useTranslations();
    const displayPlans = plans && plans.length > 0 ? plans : DEFAULT_PLANS;
    const billingUrl = getBillingAdminUrl();

    const handleRedirect = useCallback(() => {
        window.open(billingUrl, '_blank');
    }, [billingUrl]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" style={{ perspective: '1000px' }}>
            {displayPlans.map((plan: any) => {
                const meta = PLAN_META[plan.name] || PLAN_META.Free;
                const current = currentPlanName?.toLowerCase() === plan.name.toLowerCase();

                return (
                    <TiltCard key={plan.id} onClick={current ? undefined : handleRedirect}>
                        <Card
                            className={`h-100 relative border border-[#F1F1F1]/10 overflow-hidden bg-[#12123F]/60 backdrop-blur-md ${meta.shadow} 
                                ${current ? 'ring-2 ring-[#9969F8]' : 'hover:border-[#9969F8]/40 hover:shadow-[0_0_20px_rgba(153,105,248,0.15)]'}
                                transition-all duration-200`}
                        >
                            {current && (
                                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full z-10">
                                    {t('Planes.currentPlan')}
                                </div>
                            )}

                            <CardHeader className="text-center pb-2">
                                <div className="flex justify-center mb-2">
                                    {meta.icon}
                                </div>
                                <CardTitle className="text-xl text-[#F1F1F1]">{plan.name}</CardTitle>
                                {plan.description && (
                                    <p className="text-sm text-[#F1F1F1]/70">{plan.description}</p>
                                )}
                            </CardHeader>

                            <CardContent className="text-center space-y-6 h-10">
                                <p className="text-3xl font-bold text-[#F1F1F1]">
                                    {plan.price === 0 ? 'Gratis' : (
                                        <>
                                            ${plan.price.toLocaleString('es-CO')}
                                            <span className="text-sm font-normal text-[#F1F1F1]/50">{t('Planes.perMonth')}</span>
                                        </>
                                    )}
                                </p>

                                <ul className="text-left space-y-3 text-sm">
                                    {plan.planFeatures.map((pf: any) => (
                                        <li key={pf.id} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-[#6BB8FF] shrink-0" />
                                            <span className="text-[#F1F1F1]/70">
                                                {pf.feature.type === 'numeric'
                                                    ? `${pf.value} ${pf.feature.name.toLowerCase()}`
                                                    : pf.feature.name
                                                }
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                            </CardContent>
                            <CardFooter className="text-center space-y-6 h-10 self-center">
                                <div className="font-semibold text-[#9969F8] text-sm">
                                    {t('Planes.subscribe')} →
                                </div>
                            </CardFooter>
                        </Card>
                    </TiltCard>
                );
            })}
        </div>
    );
}
