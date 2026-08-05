import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Wrench, Star } from "lucide-react";
import {
  getAllCategories,
  getCategoryImage,
  getFeaturedProducts,
} from "@/lib/products";
import { CategoryCard } from "@/components/products/CategoryCard";
import { ProductCard } from "@/components/products/ProductCard";
import { Hero } from "@/components/site/Hero";
import { PromoBannerCarousel } from "@/components/site/PromoBannerCarousel";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const FEATURED_CATEGORY_SLUGS = [
  "hornos-panaderos",
  "freidoras",
  "ollas",
  "estufas",
  "molinos",
  "asadores-y-parrillas",
  "hornos-para-pollos",
  "utensilios",
];

export default function Home() {
  const categories = getAllCategories();
  const featuredCategories = FEATURED_CATEGORY_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug)
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const featuredProducts = getFeaturedProducts(8);
  const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <Hero totalProducts={totalProducts} totalCategories={categories.length} />

      <PromoBannerCarousel />

      {/* Confianza */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: ShieldCheck, label: "Garantía en materiales y soldaduras" },
            { icon: Wrench, label: "Acero inoxidable industrial" },
            { icon: Truck, label: "Envíos a toda Colombia" },
            { icon: Star, label: "+88 equipos en catálogo" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-brand-navy">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              Explora por categoría
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {categories.length} categorías de maquinaria industrial para el sector alimentario
            </p>
          </div>
          <Link
            href="/productos"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-teal-dark hover:underline sm:inline-flex"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredCategories.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} image={getCategoryImage(cat.slug)} index={i} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-teal-dark hover:underline"
          >
            Ver todas las categorías <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              Equipos destacados
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Los más pedidos por emprendedores y negocios de alimentos
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Equipo & CTA unificados */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-border sm:flex">
            <div className="relative h-72 sm:h-auto sm:w-1/2 lg:w-3/5">
              <Image
                src="/team.jpg"
                alt="Equipo FECMO"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/80 via-transparent to-transparent sm:hidden" />
              <div className="absolute bottom-6 left-6 sm:hidden">
                <h2 className="font-heading text-2xl font-bold text-white">
                  El equipo detrás de FECMO
                </h2>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:w-1/2 lg:w-2/5 sm:p-10 lg:p-14">
              <h2 className="hidden font-heading text-2xl font-bold text-brand-navy sm:block sm:text-3xl">
                El equipo detrás de FECMO
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Nuestra mayor fortaleza es nuestra gente. Un equipo humano comprometido con brindarte 
                la mejor asesoría, calidad en fabricación y respaldo constante.
              </p>
              
              <hr className="my-8 border-border" />

              <h3 className="font-heading text-xl font-bold text-brand-navy">
                ¿No encuentras el equipo que necesitas?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cuéntanos qué buscas para tu negocio y te ayudamos a encontrar la maquinaria industrial ideal.
              </p>
              
              <div className="mt-8 flex flex-col gap-3 lg:flex-row">
                <a
                  href={buildWhatsAppLink("Hola, quiero asesoría para encontrar el equipo ideal para mi negocio.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-teal px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-dark text-center"
                >
                  Asesoría por WhatsApp
                </a>
                <Link
                  href="/productos"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-secondary text-center"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
