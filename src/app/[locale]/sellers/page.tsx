import { Card } from '@heroui/react';
import { FaqItem } from '@/components/sellers/FaqItem';
import { UseVendedoresText } from '@/components/sellers/UseVendedoresText';
import { LoginCardPreview } from '@/components/sellers/LoginCardPreview';
import { AgendarDemoButton } from '@/components/sellers/AgendarDemoButton';
import { Coffee, Shirt, Gem } from 'lucide-react';

const ADMIN_URL = process.env.NEXT_PUBLIC_VENDEDORES_ADMIN_URL || '#';

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
        <div className="relative container mx-auto px-4 pt-32 pb-20 text-center max-w-2x1">
          {/* Logo visible */}
          <div className="mb-2">
            <img
              src="/logo-vendedores-light.png"
              alt="Ecommer Vendedores"
              className="mx-auto"
              style={{ width: '250px' }}
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            <UseVendedoresText path={['hero', 'title']} />
          </h1>

          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-8">
            <UseVendedoresText path={['hero', 'subtitle']} />
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AgendarDemoButton />
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
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
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
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
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
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
                  <path d="M1 3h15v13H1z" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
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
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <polyline points="7,10 10,13 13,9 17,12" />
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
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'sinCodigo']} />
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}>
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'posicionamiento']} />
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}>
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'panel']} />
                  </span>
                </li>
              </ul>

              <a
                href={ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all inline-block"
                style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
              >
                <UseVendedoresText path={['tienda', 'buttonText']} />
              </a>
            </div>

            <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-2xl p-8" style={{ background: 'linear-gradient(145deg, #080821, #111136)' }}>
              <LoginCardPreview />
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
            <div className="relative rounded-2xl overflow-hidden group flex flex-col" style={{ minHeight: '300px' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #12123F 0%, #9969F8 100%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 to-transparent"></div>
              <div className="relative z-10 p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  <UseVendedoresText path={['sectores', 'cafe', 'title']} />
                </h3>
                <p className="text-white/80 text-sm">
                  <UseVendedoresText path={['sectores', 'cafe', 'description']} />
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-8 pt-24">
                <Coffee color="white" size={120} className="opacity-45" />
              </div>
            </div>

            {/* Moda */}
            <div className="relative rounded-2xl overflow-hidden group flex flex-col" style={{ minHeight: '300px' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #12123F 0%, #6BB8FF 100%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 to-transparent"></div>
              <div className="relative z-10 p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  <UseVendedoresText path={['sectores', 'moda', 'title']} />
                </h3>
                <p className="text-white/80 text-sm">
                  <UseVendedoresText path={['sectores', 'moda', 'description']} />
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-8 pt-24">
                <Shirt color="white" size={120} className="opacity-45" />
              </div>
            </div>

            {/* Artesanías */}
            <div className="relative rounded-2xl overflow-hidden group flex flex-col" style={{ minHeight: '300px' }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #9969F8 0%, #6BB8FF 100%)' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 to-transparent"></div>
              <div className="relative z-10 p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  <UseVendedoresText path={['sectores', 'artesanias', 'title']} />
                </h3>
                <p className="text-white/80 text-sm">
                  <UseVendedoresText path={['sectores', 'artesanias', 'description']} />
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-8 pt-24">
                <Gem color="white" size={120} className="opacity-45" />
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
              question="¿Realmente es gratis al principio?"
              answer="Sí. Los primeros 3 meses no pagas mensualidad. El único costo son las comisiones de la pasarela de pagos (Wompi): 6.9% por transacción, que cubre tarjetas, PSE y corresponsales. Después, la suscripción es de solo $29.900/mes."
            />
            <FaqItem
              question="¿Necesito conocimientos técnicos para usar la plataforma?"
              answer="Para nada. Si sabés usar WhatsApp o Instagram, sabés usar Ecommer. Subir un producto es tan fácil como publicar una foto en redes sociales."
            />
            <FaqItem
              question="¿Cómo y cuándo recibo el dinero de mis ventas?"
              answer="Recibes el dinero cada 15 días. Si usas Nequi, Bancolombia o un banco con llave BRE-B registrada, no hay costos adicionales. Si eliges otro banco sin llave, los costos de la transacción los asume la tienda."
            />
            <FaqItem
              question="¿Cómo funcionan los envíos en Popayán?"
              answer="Tenemos alianza con MESSENGER. Cuando recibes un pedido, el sistema les notifica automáticamente para que recojan el paquete en tu local y lo entreguen al cliente. El costo del envío lo asume el comprador y se calcula según la distancia."
            />
            <FaqItem
              question="¿Es obligatorio facturar electrónicamente?"
              answer="No para comenzar. Si eres persona natural en régimen no responsable de IVA, puedes vender sin facturación electrónica. Las personas jurídicas sí están obligadas por ley. Para ellas, ofrecemos el servicio de facturación electrónica con Certificado Digital DIAN desde $199.900/año."
            />
            <FaqItem
              question="¿Ecommer me ayuda con la contabilidad?"
              answer="Sí. La plataforma registra todas tus ventas y genera reportes listos para descargar, para que tu contador no tenga que hacer trabajo extra. Cumplimos los estándares para que estés al día con la DIAN sin esfuerzo."
            />
            <FaqItem
              question="¿Cómo protegen mi dinero ante reclamos o contracargos?"
              answer="Wompi monitorea los pagos 24/7 y el dinero solo se retira con una segunda clave. Ante reclamos en ventas de productos físicos, te notifican y tienes 7 días para demostrar la entrega. Se recomienda guardar toda la documentación de ventas por al menos un año."
            />
            <FaqItem
              question="¿Existe un número de atención al cliente?"
              answer="Sí, contamos con un número de atención al cliente. Puedes comunicarte al 314 851 8961, donde con gusto te brindaremos asistencia, inicialmente el soporte  te conecta con un Bot de IA el cual te redirecciona a un asistente real si es necesario. "
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
              <AgendarDemoButton />
              <a
                href={ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
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