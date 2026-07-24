'use client';

import { useState } from 'react';

export interface PseData {
    financialInstitutionCode: string;
    userType: string;
    userLegalIdType: string;
    userLegalId: string;
    paymentDescription: string;
}

interface PseFormProps {
    onConfirm: (data: PseData) => void;
    isLoading: boolean;
}

const BANKS = [
    { code: '1001', name: 'Bancolombia' },
    { code: '1002', name: 'Banco de Bogotá' },
    { code: '1003', name: 'Banco Popular' },
    { code: '1004', name: 'Davivienda' },
    { code: '1005', name: 'BBVA Colombia' },
    { code: '1006', name: 'Banco de Occidente' },
    { code: '1007', name: 'Colpatria' },
    { code: '1008', name: 'Banco Agrario' },
    { code: '1009', name: 'Banco Caja Social' },
    { code: '1010', name: 'Banco AV Villas' },
    { code: '1011', name: 'Banco Falabella' },
    { code: '1012', name: 'Banco Itaú' },
    { code: '1013', name: 'Banco GNB Sudameris' },
    { code: '1014', name: 'Banco W' },
    { code: '1015', name: 'Nequi' },
    { code: '1016', name: 'Scotiabank Colpatria' },
];

const DOC_TYPES = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'RC', label: 'Registro Civil' },
];

export function PseForm({ onConfirm, isLoading }: PseFormProps) {
    const [selectedBank, setSelectedBank] = useState('');
    const [personType, setPersonType] = useState('0');
    const [docType, setDocType] = useState('CC');
    const [docNumber, setDocNumber] = useState('');
    const [paymentDesc, setPaymentDesc] = useState('');

    const handleSubmit = () => {
        if (!selectedBank) return;
        onConfirm({
            financialInstitutionCode: selectedBank,
            userType: personType,
            userLegalIdType: docType,
            userLegalId: docNumber,
            paymentDescription: paymentDesc || 'Pago en Ecommer',
        });
    };

    return (
        <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    Serás redirigido a la página de tu banco para completar el pago de forma segura.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de persona</label>
                <div className="flex gap-3">
                    <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-[#9969F8] transition-colors flex-1">
                        <input
                            type="radio"
                            name="personType"
                            value="0"
                            checked={personType === '0'}
                            onChange={(e) => setPersonType(e.target.value)}
                            className="accent-[#9969F8]"
                        />
                        <span className="text-sm">Natural</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-[#9969F8] transition-colors flex-1">
                        <input
                            type="radio"
                            name="personType"
                            value="1"
                            checked={personType === '1'}
                            onChange={(e) => setPersonType(e.target.value)}
                            className="accent-[#9969F8]"
                        />
                        <span className="text-sm">Jurídica</span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Banco</label>
                <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                >
                    <option value="">-- Seleccionar banco --</option>
                    {BANKS.map((bank) => (
                        <option key={bank.code} value={bank.code}>{bank.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de documento</label>
                    <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                    >
                        {DOC_TYPES.map((dt) => (
                            <option key={dt.value} value={dt.value}>{dt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Número de documento</label>
                    <input
                        type="text"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="1234567890"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                        maxLength={15}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Descripción del pago</label>
                <input
                    type="text"
                    value={paymentDesc}
                    onChange={(e) => setPaymentDesc(e.target.value)}
                    placeholder="Pago en Ecommer"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#9969F8]"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading || !selectedBank}
                className="w-full py-3 px-6 rounded-xl bg-[#9969F8] text-white font-semibold hover:bg-[#8858e7] disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                    </span>
                ) : (
                    'Ir a pagar con PSE'
                )}
            </button>
        </div>
    );
}