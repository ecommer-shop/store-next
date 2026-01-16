import { Card } from "@heroui/react";

export default function QuienesSomosPage() {
  return (
    <main className="flex flex-col">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        
        <div className="relative container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quiénes somos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Información del proveedor conforme a la Ley 1480 de 2011,
            garantizando una experiencia de compra clara y transparente.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container mx-auto px-4 py-16 grid gap-6 md:grid-cols-3">

        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Información legal</h2>
          <p><strong>Razón social:</strong> Ecommer SAS</p>
          <p><strong>NIT:</strong> UnN1tCh1ng0n</p>
          <p><strong>Dirección:</strong> Donde vive el compa</p>
        </Card>

        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Contacto</h2>
          <p><strong>Teléfono:</strong> Teléfono del compa</p>
          <p><strong>WhatsApp:</strong> Wasa del compa</p>
          <p><strong>Email:</strong> correo@ecommer.com</p>
        </Card>

        <Card className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Horarios de atención</h2>
          <p>Lunes a viernes</p>
          <p>8:00 – 12:00</p>
          <p>14:00 – 17:00</p>
        </Card>

      </section>
    </main>
  );
}