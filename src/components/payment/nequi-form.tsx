'use client';

import { useState, useRef, useCallback } from 'react';
import { Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NequiFormProps {
    publicKey: string;
    onTokenize: (data: { token: string; lastFour: string; brand: string; expiryMonth: string; expiryYear: string; cardHolder: string }) => void;
    isLoading: boolean;
}

export function NequiForm({ publicKey, onTokenize, isLoading }: NequiFormProps) {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'tokenizing' | 'waiting' | 'done' | 'error'>('idle');
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const apiBase = publicKey?.startsWith('pub_test_')
        ? 'https://sandbox.wompi.co'
        : 'https://production.wompi.co';

    const wompiFetch = useCallback(async (path: string, options?: RequestInit) => {
        const res = await fetch(`${apiBase}${path}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${publicKey}`,
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || json.error || 'Error en Wompi');
        return json;
    }, [apiBase, publicKey]);

    const handleStart = async () => {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 7) {
            setStatus('error');
            setStatusMsg('Ingresa un número de teléfono válido');
            return;
        }

        setStatus('tokenizing');
        setStatusMsg(null);

        try {
            const res = await wompiFetch('/v1/tokens/nequi', {
                method: 'POST',
                body: JSON.stringify({ phone_number: cleanPhone }),
            });

            const tokenId: string = res.data.id;
            setStatus('waiting');
            setStatusMsg('Revisa la app de Nequi en tu celular y acepta la solicitud');

            // Poll for token approval
            let attempts = 0;
            const maxAttempts = 30;
            const poll = setInterval(async () => {
                attempts++;
                try {
                    const statusRes = await wompiFetch(`/v1/tokens/nequi/${tokenId}`);
                    if (statusRes.data.status === 'APPROVED') {
                        clearInterval(poll);
                        onTokenize({
                            token: statusRes.data.id,
                            lastFour: cleanPhone.slice(-4),
                            brand: 'Nequi',
                            expiryMonth: '',
                            expiryYear: '',
                            cardHolder: cleanPhone,
                        });
                        setStatus('done');
                    } else if (statusRes.data.status === 'DECLINED' || statusRes.data.status === 'ERROR') {
                        clearInterval(poll);
                        setStatus('error');
                        setStatusMsg('La tokenización fue rechazada en Nequi');
                    }
                } catch { }
                if (attempts >= maxAttempts) {
                    clearInterval(poll);
                    setStatus('error');
                    setStatusMsg('Tiempo de espera agotado. Intenta de nuevo.');
                }
            }, 2000);

            pollRef.current = poll;
        } catch (err: any) {
            setStatus('error');
            setStatusMsg(err.message || 'Error al conectar con Nequi');
        }
    };

    if (status === 'done') {
        return (
            <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                <p className="font-semibold">Nequi vinculado exitosamente</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Recibirás una notificación en la app de Nequi para confirmar el pago.
                </p>
            </div>

            <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setStatus('idle'); setStatusMsg(null); }}
                placeholder="Número de celular (ej: 3991111111)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                disabled={status === 'tokenizing' || status === 'waiting' || isLoading}
                maxLength={10}
            />

            <button
                onClick={handleStart}
                disabled={status === 'tokenizing' || status === 'waiting' || isLoading || !phone.replace(/\D/g, '')}
                className="w-full py-3 px-6 rounded-xl bg-[#9969F8] text-white font-semibold hover:bg-[#8858e7] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
                {status === 'tokenizing' || status === 'waiting' ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                    </span>
                ) : (
                    'Pagar con Nequi'
                )}
            </button>

            {status === 'waiting' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
                    <Loader2 className="w-5 h-5 text-[#9969F8] animate-spin flex-shrink-0" />
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                        {statusMsg || 'Esperando confirmación en Nequi...'}
                    </p>
                </div>
            )}

            {status === 'error' && statusMsg && (
                <div className="p-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
                    {statusMsg}
                </div>
            )}
        </div>
    );
}
