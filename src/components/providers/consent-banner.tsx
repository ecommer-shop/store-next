'use client';

import { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';

const CONSENT_STORAGE_KEY = 'ecommer_cookie_consent';

function updateConsent(granted: boolean) {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: Object[]) {
        window.dataLayer!.push(args);
    }
    gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
    });
}

export function ConsentBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!stored) {
            setVisible(true);
        }
    }, []);

    const handleChoice = (granted: boolean) => {
        localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
        updateConsent(granted);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#12123F] text-white p-4 md:p-6 shadow-2xl">
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
                <p className="text-sm md:text-base">
                    Usamos cookies para mejorar tu experiencia y analizar el uso del sitio, de acuerdo con la Ley 1581
                    de Protección de Datos. Más info en nuestra{' '}
                    <Link href="/legal/privacy" className="underline">
                        Política de Privacidad
                    </Link>.
                </p>
                <div className="flex gap-3 flex-shrink-0">
                    <Button size="md" variant="outline" className="text-white border-white" onPress={() => handleChoice(false)}>
                        Rechazar
                    </Button>
                    <Button size="md" variant="primary" onPress={() => handleChoice(true)}>
                        Aceptar
                    </Button>
                </div>
            </div>
        </div>
    );
}