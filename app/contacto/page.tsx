import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos: Cra 19a #17-24, Armenia, Quindío. WhatsApp +57 317 588 2755. Síguenos en @industrias.fecmo.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-brand-navy">Contáctanos</h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Cuéntanos qué necesitas para tu negocio, te respondemos rápido por WhatsApp.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <MapPin className="mx-auto h-6 w-6 text-brand-teal" />
          <p className="mt-3 text-sm font-semibold text-brand-navy">Ubicación</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cra 19a #17-24
            <br />
            Armenia, Quindío, Colombia
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <Phone className="mx-auto h-6 w-6 text-brand-teal" />
          <p className="mt-3 text-sm font-semibold text-brand-navy">WhatsApp</p>
          <a
            href={buildWhatsAppLink("Hola, quiero más información sobre los equipos de Industrias FECMO.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-brand-teal-dark hover:underline"
          >
            +57 317 588 2755
          </a>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <Clock className="mx-auto h-6 w-6 text-brand-teal" />
          <p className="mt-3 text-sm font-semibold text-brand-navy">Horario</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Lunes a sábado
            <br />
            8:00 a.m. a 5:00 p.m.
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <a
          href={buildWhatsAppLink("Hola, quiero más información sobre los equipos de Industrias FECMO.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
