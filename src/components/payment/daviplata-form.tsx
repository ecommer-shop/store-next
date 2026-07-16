'use client';

import { useState, useRef } from 'react';
import { CheckCircle2, Loader2, Smartphone, Shield } from 'lucide-react';

interface DaviplataFormProps {
    publicKey: string;
    onTokenize: (data: { token: string; lastFour: string; brand: string; expiryMonth: string; expiryYear: string; cardHolder: string }) => void;
    isLoading: boolean;
}

export function DaviplataForm({ publicKey, onTokenize, isLoading }: DaviplataFormProps) {
    const [step, setStep] = useState<'form' | 'otp' | 'waiting' | 'done' | 'error'>('form');
    const [tokenLoading, setTokenLoading] = useState(false);
    const [docType, setDocType] = useState('CC');
    const [docNumber, setDocNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [statusMsg, setStatusMsg] = useState<string | null>(null);
    const tokenIdRef = useRef<string | null>(null);
    const otpValidateUrlRef = useRef<string | null>(null);
    const authTokenRef = useRef<string | null>(null);

    const apiBase = publicKey?.startsWith('pub_test_')
        ? 'https://sandbox.wompi.co'
        : 'https://production.wompi.co';

    const wompiFetch = async (path: string, options?: RequestInit) => {
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
    };

    const handleTokenize = async () => {
        if (phone.replace(/\D/g, '').length < 7) {
            setStatusMsg('Ingresa un número de teléfono válido');
            setStep('error');
            return;
        }

        setTokenLoading(true);
        setStatusMsg(null);

        try {
            const res = await wompiFetch('/v1/tokens/daviplata', {
                method: 'POST',
                body: JSON.stringify({
                    type_document: docType,
                    number_document: docNumber,
                    product_number: phone.replace(/\D/g, ''),
                }),
            });

            const d = res.data;
            tokenIdRef.current = d.id;
            authTokenRef.current = d.url_services.token;
            otpValidateUrlRef.current = d.url_services.code_otp_validate;

            await fetch(d.url_services.code_otp_send, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${d.url_services.token}` },
            });

            setStep('otp');
        } catch (err: any) {
            setStep('error');
            setStatusMsg(err.message || 'Error al conectar con Daviplata');
        } finally {
            setTokenLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 4) {
            setStatusMsg('Ingresa el código OTP');
            setStep('error');
            return;
        }

        setStep('waiting');
        setStatusMsg(null);

        try {
            await fetch(otpValidateUrlRef.current!, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokenRef.current}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: otp }),
            });

            let attempts = 0;
            const maxAttempts = 30;
            const poll = setInterval(async () => {
                attempts++;
                try {
                    const statusRes = await wompiFetch(`/v1/tokens/daviplata/${tokenIdRef.current}`);
                    if (statusRes.data.status === 'APPROVED') {
                        clearInterval(poll);
                        const cleanPhone = phone.replace(/\D/g, '');
                        onTokenize({
                            token: statusRes.data.id,
                            lastFour: cleanPhone.slice(-4),
                            brand: 'Daviplata',
                            expiryMonth: '',
                            expiryYear: '',
                            cardHolder: cleanPhone,
                        });
                        setStep('done');
                    } else if (statusRes.data.status === 'DECLINED' || statusRes.data.status === 'ERROR') {
                        clearInterval(poll);
                        setStep('error');
                        setStatusMsg('La verificación fue rechazada');
                    }
                } catch { }
                if (attempts >= maxAttempts) {
                    clearInterval(poll);
                    setStep('error');
                    setStatusMsg('Tiempo de espera agotado');
                }
            }, 2000);
        } catch (err: any) {
            setStep('error');
            setStatusMsg(err.message || 'Error al verificar OTP');
        }
    };

    if (step === 'done') {
        return (
            <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                <p className="font-semibold">Daviplata vinculado exitosamente</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {step === 'form' && (
                <>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30">
                        <Smartphone className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-300">
                            Recibirás un código OTP por SMS para confirmar tu cuenta Daviplata.
                        </p>
                    </div>

                    <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                    >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="NIT">NIT</option>
                        <option value="PP">Pasaporte</option>
                    </select>

                    <input
                        type="text"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Número de documento"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                        maxLength={12}
                    />

                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Teléfono Daviplata"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                        maxLength={10}
                    />

                    <button
                        onClick={handleTokenize}
                        disabled={tokenLoading || isLoading}
                        className="w-full py-3 px-6 rounded-xl bg-[#9969F8] text-white font-semibold hover:bg-[#8858e7] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                        {tokenLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Procesando...
                            </span>
                        ) : (
                            'Pagar con Daviplata'
                        )}
                    </button>
                </>
            )}

            {step === 'otp' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                        <Shield className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Hemos enviado un código de verificación a tu celular.
                        </p>
                    </div>

                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Código OTP"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8] text-center text-lg tracking-widest"
                        maxLength={6}
                    />
                    <button
                        onClick={handleVerifyOtp}
                        disabled={otp.length < 4 || isLoading || step !== 'otp'}
                        className="w-full py-3 px-6 rounded-xl bg-[#9969F8] text-white font-semibold hover:bg-[#8858e7] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Verificando...
                            </span>
                        ) : (
                            'Verificar OTP'
                        )}
                    </button>
                </div>
            )}

            {step === 'waiting' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
                    <Loader2 className="w-5 h-5 text-[#9969F8] animate-spin flex-shrink-0" />
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                        Verificando código...
                    </p>
                </div>
            )}

            {step === 'error' && statusMsg && (
                <div className="p-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
                    {statusMsg}
                </div>
            )}
        </div>
    );
}
