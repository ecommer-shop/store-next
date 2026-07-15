"use client";

import { MapPin } from "lucide-react";
import { UseAboutText } from "./UseAboutText";

export function LocationSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <MapPin className="size-10 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-4">
          <UseAboutText path={["location", "title"]} />
        </h2>
        <p className="text-muted-foreground text-lg">
          <UseAboutText path={["location", "text"]} />
        </p>
      </div>

      <div className="max-w-3xl mx-auto rounded-xl overflow-hidden border shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.189556446958!2d-76.60487745967019!3d2.4438432570915687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3003521ed20da5%3A0x2fbc3a807e59afa5!2sEmprendelab%20Aut%C3%B3noma!5e0!3m2!1ses!2sco!4v1781467550944!5m2!1ses!2sco"
          width="100%"
          height="350"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ecommer — Ubicación en Popayán, Cauca"
          style={{ border: 0 }}
          allowFullScreen
        />
      </div>
    </section>
  );
}
