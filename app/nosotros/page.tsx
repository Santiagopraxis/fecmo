import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Factory, Users, MapPin } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Industrias FECMO — Fabricantes de Equipos Industriales en Armenia, Quindío. Soluciones industriales para emprendedores del sector alimentario en Colombia.",
};

const VALUES = [
  {
    icon: Factory,
    title: "Fabricantes directos",
    text: "Diseñamos y fabricamos cada equipo en acero inoxidable industrial, sin intermediarios.",
  },
  {
    icon: ShieldCheck,
    title: "Garantía real",
    text: "Respaldamos nuestros equipos con garantía en materiales y soldaduras.",
  },
  {
    icon: Users,
    title: "Para emprendedores",
    text: "Acompañamos a negocios de alimentos colombianos, desde arepas hasta panadería industrial.",
  },
  {
    icon: MapPin,
    title: "Hechos en Colombia",
    text: "Fabricados en Armenia, Quindío, con envíos a todo el país.",
  },
];

export default function NosotrosPage() {
  return (
    <div>
      <section className="bg-brand-gradient">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90">
            Industrias FECMO
          </span>
          <h1 className="mt-6 font-heading text-3xl font-bold text-white sm:text-4xl">
            Fabricantes de Equipos Industriales
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85">
            Soluciones industriales para emprendedores — tecnología industrial de alto
            rendimiento para hacer crecer tu negocio con calidad.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-heading text-sm font-semibold text-brand-navy">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border mt-8 pt-16">
        <div className="mx-auto mb-12 max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">Conoce a nuestro equipo</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            El talento y la dedicación humana detrás de cada equipo fabricado por Industrias FECMO.
          </p>
        </div>
        
        {/* Galería de fotos del equipo (carrusel en movimiento) */}
        <div className="relative flex w-full overflow-hidden">
          <div className="animate-marquee flex w-max items-center hover:[animation-play-state:paused]">
            {[
              { id: "adrian", image: "/team/adrian.jpg" },
              { id: "karine", image: "/team/Karine.jpg" },
              { id: "madre", image: "/team/madre.jpg" },
              { id: "paola", image: "/team/paola.jpg" },
              { id: "yo", image: "/team/yo.jpg" },
              { id: "05", image: "/team/05.jpg" },
              { id: "08", image: "/team/08.jpg" },
              { id: "10", image: "/team/10.jpg" },
              { id: "paola2", image: "/team/paola2.jpg" },
              // duplicamos para efecto infinito
              { id: "adrian-2", image: "/team/adrian.jpg" },
              { id: "karine-2", image: "/team/Karine.jpg" },
              { id: "madre-2", image: "/team/madre.jpg" },
              { id: "paola-2", image: "/team/paola.jpg" },
              { id: "yo-2", image: "/team/yo.jpg" },
              { id: "05-2", image: "/team/05.jpg" },
              { id: "08-2", image: "/team/08.jpg" },
              { id: "10-2", image: "/team/10.jpg" },
              { id: "paola2-2", image: "/team/paola2.jpg" },
            ].map((member) => (
              <div key={member.id} className="relative aspect-square w-48 sm:w-64 md:w-80 shrink-0 overflow-hidden group">
                <Image 
                  src={member.image} 
                  alt="Equipo FECMO" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  sizes="(max-width: 768px) 12rem, (max-width: 1024px) 16rem, 20rem" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/50 py-16 mt-8">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-brand-navy">
            Emprendedores y empresas de alimentos en toda Colombia
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Trabajamos especialmente con productores de arepas, panadería y negocios de comida
            que necesitan maquinaria industrial confiable para crecer.
          </p>
          <a
            href={buildWhatsAppLink(
              "Hola, quiero conocer más sobre Industrias FECMO."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-teal hover:text-brand-navy-dark"
          >
            Hablemos por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
