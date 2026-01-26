import { Card } from "@heroui/react";
import { UseAboutText } from './UseAboutText';

export default function QuienesSomosPage() {
  return (
    <main className="flex flex-col">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        
        <div className="relative container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <UseAboutText path={['title']} />
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <UseAboutText path={['description']} />
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto px-4 py-16 grid gap-6 md:grid-cols-3">

        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold"><UseAboutText path={['legal','label']} /></h2>
          <p><strong><UseAboutText path={['legal','rs']} /></strong> Ecommer SAS</p>
          <p><strong>NIT:</strong> 902008723</p>
          <p><strong><UseAboutText path={['legal','address']} /></strong> Carrera 2a 3N 23, Antiguo Liceo Popayán Cauca, CO</p>
        </Card>

        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold"><UseAboutText path={['contact','label']} /></h2>
          <p><strong><UseAboutText path={['contact','phone']} /></strong> 3223647362</p>
          <p><strong>WhatsApp:</strong> 3223647362</p>
          <p><strong>Email:</strong>  legal@ecommer.shop</p>
        </Card>

        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold"><UseAboutText path={['hours','label']} /></h2>
          <p><UseAboutText path={['hours','days']} /></p>
          <p>8:00 – 12:00</p>
          <p>14:00 – 17:00</p>
        </Card>

        
        <Card className="p-6 space-y-3">
          <h2 className="text-lg font-semibold">Documentos legales</h2>

          <a
            href="/legal/Ley1480_de_2011/terminos_condiciones.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary underline"
          >
            Terminos y Condiciones
          </a>
          <a
            href="/legal/Ley1480_de_2011/garantia.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary underline"
          >
            Garantía
          </a>
           <a
            href="/legal/Ley1480_de_2011/retracto.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary underline"
          >
            Retracto
          </a>
           <a
            href="/legal/Ley1480_de_2011/reversion_pago.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary underline"
          >
            Reversión del pago
          </a>
        </Card>

      </section>
    </main>
  );
}