'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
export function LoginCardPreview() {
  const { resolvedTheme } = useTheme();
  const t = useTranslations('Vendedores');
  const gradient = resolvedTheme === 'light'
    ? 'linear-gradient(135deg, #6BB8FF, #9969F8)'
    : 'linear-gradient(135deg, #9969F8, #6BB8FF)';

  return (
    <div className="bg-white dark:bg-[#111136] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600" style={{ width: '260px', margin: '0 auto' }}>
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/logo-dark.webp"
          alt={t('loginPreview.logoAlt')}
          width={48}
          height={48}
          className="w-12 h-12 mx-auto inset-0 block dark:hidden"
          style={{ marginTop: '8px', marginBottom: '8px' }}
        />
        {/* Dark */}
        <Image
          className="w-12 h-12 mx-auto  inset-0 hidden dark:block"
          src="/logo-light.webp"
          alt={t('loginPreview.logoAlt')}
          width={48}
          height={48}
          style={{ marginTop: '8px', marginBottom: '8px' }}
        />
      </div>

      {/* Información de la tienda */}
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('loginPreview.businessNameLabel')}</div>
          <div className="font-semibold text-[#12123F] dark:text-white border-b-2 border-purple-500 pb-1" style={{ borderColor: '#9969F8' }}>
            {t('loginPreview.businessNameValue')}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('loginPreview.emailLabel')}</div>
          <div className="text-sm text-gray-700 dark:text-gray-200 border-b-2 border-blue-500 pb-1" style={{ borderColor: '#6BB8FF', fontSize: '12px' }}>
            {t('loginPreview.emailValue')}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">{t('loginPreview.category')}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{t('loginPreview.city')}</div>

        <div className="text-white font-semibold px-3 py-2 rounded" style={{ background: gradient }}>
          {t('loginPreview.activeStore')}
        </div>
      </div>
    </div>
  );
}
