import { Card } from '@heroui/react';
import { FaqItem } from '@/components/vendedores/FaqItem';
import { UseVendedoresText } from '@/components/vendedores/UseVendedoresText';

export default function VendedoresPage() {
  return (
    <main className="flex flex-col">
      {/* HERO SECTION */}
      <section 
        className="relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(135deg, #3b1fa8 0%, #1a1060 35%, #12123F 65%, #0d1f4a 100%),
            url('/patron-hero.png')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative container mx-auto px-4 pt-32 pb-20 text-center">
          {/* Logo visible */}
          <div className="mb-2">
            <img 
              src="/logo-vendedores.png" 
              alt="Ecommer Vendedores" 
              className="mx-auto"
              style={{ width: '500px' }}
            />
          </div>
          
          <span className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ borderColor: 'rgba(107,184,255,0.45)' }}>
            <UseVendedoresText path={['hero', 'badge']} />
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            <UseVendedoresText path={['hero', 'title']} />
          </h1>
          
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
            <UseVendedoresText path={['hero', 'subtitle']} />
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#cta"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
            >
              <UseVendedoresText path={['hero', 'demoButton']} />
            </a>
            <a 
              href="#cta"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
            >
              <UseVendedoresText path={['hero', 'storeButton']} />
            </a>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="bg-gray-100 py-16" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-purple-600 text-sm font-semibold uppercase tracking-wider" style={{ color: '#9969F8' }}>
              Lo que incluye
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Excelencia Operativa
            </h2>
            <p className="text-gray-600 text-lg">
              Todo lo que necesitas para operar sin fricciones.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(153,105,248,0.12), rgba(107,184,255,0.12))' }}>
                <svg className="w-6 h-6 text-purple-600" style={{ color: '#9969F8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <UseVendedoresText path={['beneficios', 'cards', 'cumplimiento', 'title']} />
              </h3>
              <p className="text-gray-600 text-sm">
                <UseVendedoresText path={['beneficios', 'cards', 'cumplimiento', 'description']} />
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(107,184,255,0.12), rgba(153,105,248,0.12))' }}>
                <svg className="w-6 h-6 text-blue-600" style={{ color: '#6BB8FF' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <UseVendedoresText path={['beneficios', 'cards', 'confianza', 'title']} />
              </h3>
              <p className="text-gray-600 text-sm">
                <UseVendedoresText path={['beneficios', 'cards', 'confianza', 'description']} />
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(153,105,248,0.12), rgba(107,184,255,0.12))' }}>
                <svg className="w-6 h-6 text-purple-600" style={{ color: '#9969F8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 3h15v13H1z"/>
                  <path d="M16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <UseVendedoresText path={['beneficios', 'cards', 'presencia', 'title']} />
              </h3>
              <p className="text-gray-600 text-sm">
                <UseVendedoresText path={['beneficios', 'cards', 'presencia', 'description']} />
              </p>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(107,184,255,0.12), rgba(153,105,248,0.12))' }}>
                <svg className="w-6 h-6 text-blue-600" style={{ color: '#6BB8FF' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                  <polyline points="7,10 10,13 13,9 17,12"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <UseVendedoresText path={['beneficios', 'cards', 'control', 'title']} />
              </h3>
              <p className="text-gray-600 text-sm">
                <UseVendedoresText path={['beneficios', 'cards', 'control', 'description']} />
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* TIENDA LISTA */}
      <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-purple-600 text-sm font-semibold uppercase tracking-wider" style={{ color: '#9969F8' }}>
                Simplicidad
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Tu tienda lista en minutos
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Hemos simplificado la complejidad técnica para que te enfoques en lo que mejor sabes hacer: crear productos increíbles. Nuestra interfaz intuitiva te permite gestionar todo desde tu dispositivo móvil.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}>
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'sinCodigo']} />
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}>
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'posicionamiento']} />
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}>
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'panel']} />
                  </span>
                </li>
              </ul>
              
              <a 
                href="#cta"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all inline-block"
                style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
              >
                <UseVendedoresText path={['tienda', 'buttonText']} />
              </a>
            </div>
            
            <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-2xl p-8" style={{ background: 'linear-gradient(145deg, #f5e8e8, #f0d8d8)' }}>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-white/50" style={{ width: '260px', margin: '0 auto' }}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <span className="text-purple-600 font-medium" style={{ color: '#9969F8' }}>← Tienda</span>
                  <span className="text-lg font-bold">Mi Tienda</span>
                  <svg className="w-4 h-4 text-purple-600" style={{ color: '#9969F8' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                  </svg>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Nombre del negocio</div>
                    <div className="font-semibold border-b-2 border-purple-500 pb-1" style={{ borderColor: '#9969F8' }}>Don Mercam</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Email</div>
                    <div className="text-sm border-b-2 border-blue-500 pb-1" style={{ borderColor: '#6BB8FF', fontSize: '12px' }}>donmercam@gmail.com</div>
                  </div>
                  
                  <div className="text-sm">Categoría: Alimentos</div>
                  <div className="text-sm">Ciudad: Popayán, Cauca</div>
                  
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-800 font-semibold px-3 py-2 rounded" style={{ background: 'linear-gradient(135deg, rgba(153,105,248,0.15), rgba(107,184,255,0.15))', color: '#0D0D2B' }}>
                    ✦ Tienda activa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALIADOS */}
      <section className="bg-gray-100 py-12" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="container mx-auto px-4 text-center">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
            Nuestros aliados estratégicos
          </span>
          <div className="flex flex-wrap justify-center gap-14 mt-8">
            <span className="text-xl font-bold text-gray-600" style={{ opacity: 0.65 }}>
              <UseVendedoresText path={['aliados', 'dian']} />
            </span>
            <span className="text-xl font-bold text-gray-600" style={{ opacity: 0.65 }}>
              <UseVendedoresText path={['aliados', 'wompi']} />
            </span>
            <span className="text-xl font-bold text-gray-600" style={{ opacity: 0.65 }}>
              <UseVendedoresText path={['aliados', 'servientrega']} />
            </span>
          </div>
        </div>
      </section>

      {/* SECTORES */}
      <section className="py-16" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-purple-600 text-sm font-semibold uppercase tracking-wider" style={{ color: '#9969F8' }}>
              Sectores
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Lo mejor de Colombia para el mundo
            </h2>
            <p className="text-gray-600 text-lg">
              Diseñado para los sectores que mueven nuestra economía.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Café */}
            <div className="relative rounded-2xl overflow-hidden group" style={{ minHeight: '300px' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-red-600 to-red-400" style={{ background: 'linear-gradient(160deg, #8B4513 0%, #D2691E 40%, #A0522D 100%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg className="w-24 h-24 opacity-45" viewBox="0 0 90 90" fill="none">
                  <ellipse cx="45" cy="62" rx="28" ry="6" fill="rgba(255,255,255,0.3)"/>
                  <path d="M20 40 Q20 72 45 72 Q70 72 70 40 Z" fill="rgba(255,255,255,0.25)"/>
                  <ellipse cx="45" cy="40" rx="25" ry="10" fill="rgba(255,255,255,0.3)"/>
                  <path d="M65 42 Q80 42 80 55 Q80 65 70 65" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <path d="M38 30 Q35 22 40 18" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M45 28 Q42 18 47 14" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <path d="M52 30 Q49 20 54 16" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="relative z-10 p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  <UseVendedoresText path={['sectores', 'cafe', 'title']} />
                </h3>
                <p className="text-white/80 text-sm">
                  <UseVendedoresText path={['sectores', 'cafe', 'description']} />
                </p>
              </div>
            </div>

            {/* Moda */}
            <div className="relative rounded-2xl overflow-hidden group" style={{ minHeight: '300px' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-200" style={{ background: 'linear-gradient(160deg, #C4A882 0%, #E8D5B7 40%, #B8956A 100%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg className="w-20 h-24 opacity-40" viewBox="0 0 80 100" fill="none">
                  <path d="M20 20 L10 40 L25 38 L25 85 L55 85 L55 38 L70 40 L60 20 Q50 30 40 28 Q30 30 20 20Z" fill="rgba(255,255,255,0.4)"/>
                  <ellipse cx="40" cy="18" rx="10" ry="10" fill="rgba(255,255,255,0.3)"/>
                </svg>
              </div>
              <div className="relative z-10 p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  <UseVendedoresText path={['sectores', 'moda', 'title']} />
                </h3>
                <p className="text-white/80 text-sm">
                  <UseVendedoresText path={['sectores', 'moda', 'description']} />
                </p>
              </div>
            </div>

            {/* Artesanías */}
            <div className="relative rounded-2xl overflow-hidden group" style={{ minHeight: '300px' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-800 via-yellow-600 to-yellow-400" style={{ background: 'linear-gradient(160deg, #7B6B4A 0%, #B8A07A 40%, #8B7355 100%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg className="w-24 h-24 opacity-40" viewBox="0 0 90 90" fill="none">
                  <rect x="15" y="30" width="20" height="45" rx="3" fill="rgba(255,255,255,0.4)"/>
                  <rect x="40" y="20" width="16" height="55" rx="3" fill="rgba(255,255,255,0.3)"/>
                  <rect x="62" y="35" width="14" height="40" rx="3" fill="rgba(255,255,255,0.35)"/>
                  <ellipse cx="25" cy="22" rx="9" ry="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                  <path d="M35 15 Q48 8 55 15" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="relative z-10 p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  <UseVendedoresText path={['sectores', 'artesanias', 'title']} />
                </h3>
                <p className="text-white/80 text-sm">
                  <UseVendedoresText path={['sectores', 'artesanias', 'description']} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-100 py-16" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-purple-600 text-sm font-semibold uppercase tracking-wider" style={{ color: '#9969F8' }}>
              Preguntas Frecuentes
            </span>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <FaqItem 
              question="¿Necesito conocimientos técnicos?"
              answer="No. Ecommer está diseñada para que cualquier emprendedor pueda configurar su tienda en minutos, sin necesidad de saber programar. Nuestro equipo de soporte te acompaña en cada paso del proceso."
            />
            <FaqItem 
              question="¿Cómo funcionan los envíos con Servientrega?"
              answer="Tu tienda está integrada directamente con Servientrega. Cuando un cliente hace un pedido, el sistema genera automáticamente la guía de envío y puedes rastrear el estado en tiempo real desde tu panel de administración."
            />
            <FaqItem 
              question="¿Qué comisiones cobran por venta?"
              answer="Ecommer cobra una comisión competitiva solo cuando vendes — no pagas nada si no hay ventas. Agenda una demo y te explicamos el detalle del modelo de precios adaptado a tu volumen de negocio."
            />
            <FaqItem 
              question="¿Puedo manejar mi tienda desde el celular?"
              answer="Sí. El panel de administración está optimizado para móvil. Podés gestionar productos, ver pedidos, responder clientes y revisar métricas de ventas desde cualquier lugar."
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden py-20" style={{ backgroundColor: '#12123F' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white/6 backdrop-blur-sm border border-white/20 rounded-3xl p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              <UseVendedoresText path={['cta', 'title']} />
            </h2>
            <p className="text-white/70 text-lg mb-8">
              <UseVendedoresText path={['cta', 'subtitle']} />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
              >
                <UseVendedoresText path={['cta', 'demoButton']} />
              </a>
              <a 
                href="#"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
              >
                <UseVendedoresText path={['cta', 'storeButton']} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}