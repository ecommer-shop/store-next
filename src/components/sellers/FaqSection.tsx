'use client';

import { Reveal } from './Reveal';
import { FaqItem } from './FaqItem';

export function FaqSection() {
  return (
    <section className="py-24">
      <Reveal direction="none">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-lg max-w-2xl mx-auto">
              Resolvemos tus dudas operativas para que escales con confianza.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <FaqItem
              question="¿Realmente es gratis usar la plataforma?"
              answer="Sí. El único costo son las comisiones de la pasarela de pagos (Wompi): 7.9% por transacción, que cubre tarjetas, PSE y corresponsales. Si deseas funcionalidades adicionales, puedes revisar nuestros paquetes."
              defaultOpen
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
              answer="Sí, contamos con un número de atención al cliente. Puedes comunicarte al 314 851 8961, donde con gusto te brindaremos asistencia, inicialmente el soporte te conecta con un Bot de IA el cual te redirecciona a un asistente real si es necesario."
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
