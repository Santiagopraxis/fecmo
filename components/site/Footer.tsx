import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Category } from "@/lib/types";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.4 3 14.2 3c-2.5 0-4.3 1.5-4.3 4.4v2.4H7.2v3.2h2.7v8h3.6Z" />
    </svg>
  );
}

const FEATURED_CATEGORY_SLUGS = [
  "hornos-panaderos",
  "freidoras",
  "ollas",
  "estufas",
  "molinos",
  "utensilios",
];

export function Footer({ categories }: { categories: Category[] }) {
  const featured = FEATURED_CATEGORY_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug)
  ).filter((c): c is Category => Boolean(c));

  return (
    <footer className="bg-brand-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/brand/fecmo-logo-mono.png"
              alt="Industrias FECMO"
              width={220}
              height={143}
              className="h-auto w-44"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Soluciones industriales para emprendedores. Tecnología industrial de alto
              rendimiento para hacer crecer tu negocio con calidad.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com/industrias.fecmo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-teal hover:text-brand-navy-dark"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com/industrias.fecmo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-teal hover:text-brand-navy-dark"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Categorías</p>
            <ul className="mt-4 space-y-2.5">
              {featured.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/productos/${cat.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-brand-teal"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/productos"
                  className="text-sm font-medium text-brand-teal hover:underline"
                >
                  Ver todo el catálogo →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Empresa</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/nosotros" className="text-sm text-white/70 hover:text-brand-teal">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-white/70 hover:text-brand-teal">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-sm text-white/70 hover:text-brand-teal">
                  Mi carrito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contacto</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                Cra 19a #17-24, Armenia, Quindío, Colombia
              </li>
              <li>
                <a
                  href={buildWhatsAppLink("Hola, quiero más información sobre los equipos de Industrias FECMO.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-white/70 hover:text-brand-teal"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                  +57 317 588 2755
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                Lunes a sábado: 8am - 5pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Industrias FECMO Soluciones Industriales. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-white/50">Recibimos todos los medios de pago</p>
        </div>
      </div>
    </footer>
  );
}
