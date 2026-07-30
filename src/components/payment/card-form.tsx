'use client';

import { useState, useCallback } from 'react';

interface CardFormData {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardHolder: string;
}

interface CardFormProps {
    onTokenize: (data: {
        token: string;
        lastFour: string;
        brand: string;
        expiryMonth: string;
        expiryYear: string;
        cardHolder: string;
    }) => void;
    isLoading: boolean;
    publicKey: string;
}

function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.slice(0, 4).join(' ') : '';
}

function detectBrand(number: string): string {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'American Express';
    if (/^6(?:011|5)/.test(n)) return 'Discover';
    if (/^3(?:0[0-5]|[68])/.test(n)) return 'Diners Club';
    return '';
}

function luhnCheck(value: string): boolean {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 13) return false;
    let sum = 0;
    let alternate = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let n = parseInt(digits[i], 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }
    return sum % 10 === 0;
}

export function CardForm({ onTokenize, isLoading, publicKey }: CardFormProps) {
    const [number, setNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isTokenizing, setIsTokenizing] = useState(false);

    const validate = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};
        const digits = number.replace(/\D/g, '');

        if (digits.length < 13) newErrors.number = 'Número inválido';
        else if (!luhnCheck(digits)) newErrors.number = 'Número inválido';

        if (!expiryMonth || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12)
            newErrors.expiry = 'Mes inválido';
        if (!expiryYear || parseInt(expiryYear) < 25)
            newErrors.expiry = 'Año inválido';

        const brand = detectBrand(number);
        const expectedCvcLength = brand === 'American Express' ? 4 : 3;
        if (cvc.length < expectedCvcLength) newErrors.cvc = 'CVC inválido';

        if (!cardHolder.trim()) newErrors.cardHolder = 'Requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [number, expiryMonth, expiryYear, cvc, cardHolder]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsTokenizing(true);
        try {
            const apiBase = publicKey?.startsWith('pub_test_')
                ? 'https://sandbox.wompi.co'
                : 'https://production.wompi.co';

            const res = await fetch(`${apiBase}/v1/tokens/cards`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${publicKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: number.replace(/\s/g, ''),
                    cvc,
                    exp_month: expiryMonth,
                    exp_year: expiryYear,
                    card_holder: cardHolder,
                }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || json.error || 'Error al tokenizar');

            const digits = number.replace(/\D/g, '');
            onTokenize({
                token: json.data.id,
                lastFour: digits.slice(-4),
                brand: detectBrand(number) || 'Card',
                expiryMonth,
                expiryYear,
                cardHolder,
            });
        } catch (err: any) {
            setErrors({ form: err.message || 'Error al procesar la tarjeta' });
        } finally {
            setIsTokenizing(false);
        }
    };

    const brand = detectBrand(number);
    const isAmex = brand === 'American Express';
    const cvcLength = isAmex ? 4 : 3;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
                <div className="p-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400">
                    {errors.form}
                </div>
            )}

            <div>
                <div className="relative">
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => { setNumber(formatCardNumber(e.target.value)); setErrors({}); }}
                        placeholder="Número de tarjeta"
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8] transition-colors ${errors.number ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'}`}
                        maxLength={19}
                        disabled={isTokenizing || isLoading}
                        autoComplete="cc-number"
                    />
                    {brand && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">
                            {brand}
                        </span>
                    )}
                </div>
                {errors.number && <p className="mt-1 text-xs text-red-500">{errors.number}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div>
                    <input
                        type="text"
                        value={expiryMonth}
                        onChange={(e) => { setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2)); setErrors({}); }}
                        placeholder="MM"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8] text-center"
                        disabled={isTokenizing || isLoading}
                        maxLength={2}
                        autoComplete="cc-exp-month"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={expiryYear}
                        onChange={(e) => { setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2)); setErrors({}); }}
                        placeholder="AA"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8] text-center"
                        disabled={isTokenizing || isLoading}
                        maxLength={2}
                        autoComplete="cc-exp-year"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={cvc}
                        onChange={(e) => { setCvc(e.target.value.replace(/\D/g, '').slice(0, cvcLength)); setErrors({}); }}
                        placeholder={isAmex ? 'CVC' : 'CVC'}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8] text-center"
                        disabled={isTokenizing || isLoading}
                        maxLength={cvcLength}
                        autoComplete="cc-csc"
                    />
                </div>
            </div>
            {(errors.expiry || errors.cvc) && (
                <p className="text-xs text-red-500">{errors.expiry || errors.cvc}</p>
            )}

            <div>
                <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => { setCardHolder(e.target.value.toUpperCase()); setErrors({}); }}
                    placeholder="Nombre del titular"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8] uppercase"
                    disabled={isTokenizing || isLoading}
                    autoComplete="cc-name"
                />
                {errors.cardHolder && <p className="mt-1 text-xs text-red-500">{errors.cardHolder}</p>}
            </div>

            <button
                type="submit"
                disabled={isTokenizing || isLoading}
                className="w-full py-3 px-6 rounded-xl bg-[#9969F8] text-white font-semibold hover:bg-[#8858e7] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
                {isTokenizing ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                    </span>
                ) : (
                    'Pagar con tarjeta'
                )}
            </button>
        </form>
    );
}
