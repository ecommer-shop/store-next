'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
export function LoginCardPreview() {
  const { resolvedTheme } = useTheme();
  const gradient = resolvedTheme === 'light'
    ? 'linear-gradient(135deg, #6BB8FF, #9969F8)'
    : 'linear-gradient(135deg, #9969F8, #6BB8FF)';

  return (
    <div className="bg-white dark:bg-[#111136] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600" style={{ width: '260px', margin: '0 auto' }}>
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/logo-dark.webp"
          alt="Ecommer Vendedores"
          width={48}
          height={48}
          className="w-12 h-12 mx-auto inset-0 block dark:hidden"
          style={{ marginTop: '8px', marginBottom: '8px' }}
        />
        {/* Dark */}
        <Image
          className="w-12 h-12 mx-auto  inset-0 hidden dark:block"
          src="/logo-light.webp"
          alt="Ecommer Vendedores"
          width={48}
          height={48}
          style={{ marginTop: '8px', marginBottom: '8px' }}
        />
      </div>

      {/* Información de la tienda */}
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nombre del negocio</div>
          <div className="font-semibold text-[#12123F] dark:text-white border-b-2 border-purple-500 pb-1" style={{ borderColor: '#9969F8' }}>
            Tienda Don Julio
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</div>
          <div className="text-sm text-gray-700 dark:text-gray-200 border-b-2 border-blue-500 pb-1" style={{ borderColor: '#6BB8FF', fontSize: '12px' }}>
            donjulio@tutienda.com
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">Categoría: Alimentos</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Ciudad: Popayán, Cauca</div>

        <div className="text-white font-semibold px-3 py-2 rounded" style={{ background: gradient }}>
          ✦ Tienda activa
        </div>
      </div>
    </div>
  );
}
