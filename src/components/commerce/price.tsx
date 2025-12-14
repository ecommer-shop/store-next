'use client';

interface PriceProps {
    value: number;
    currencyCode?: string;
}

export function Price({value, currencyCode = 'COP'}: PriceProps) {
    return (
        <>
            {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: currencyCode,
            }).format(value / 100)}
        </>
    );
}
