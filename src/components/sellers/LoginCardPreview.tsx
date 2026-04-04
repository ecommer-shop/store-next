'use client';

export function LoginCardPreview() {
  return (
    <div className="bg-[#111136] rounded-xl p-6 shadow-lg border border-gray-600" style={{ width: '260px', margin: '0 auto' }}>
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img 
          src="/logo-light.webp" 
          alt="Ecommer Vendedores"
          className="w-12 h-12 mx-auto"
          style={{ marginTop: '8px', marginBottom: '8px' }}
        />
      </div>

      {/* Información de la tienda */}
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-400 mb-1">Nombre del negocio</div>
          <div className="font-semibold text-white border-b-2 border-purple-500 pb-1" style={{ borderColor: '#9969F8' }}>
            Tienda Don Julio
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-400 mb-1">Email</div>
          <div className="text-sm text-gray-200 border-b-2 border-blue-500 pb-1" style={{ borderColor: '#6BB8FF', fontSize: '12px' }}>
            donjulio@tutienda.com
          </div>
        </div>
        
        <div className="text-sm text-gray-300">Categoría: Alimentos</div>
        <div className="text-sm text-gray-300">Ciudad: Popayán, Cauca</div>
        
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-3 py-2 rounded" style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}>
          ✦ Tienda activa
        </div>
      </div>
    </div>
  );
}
