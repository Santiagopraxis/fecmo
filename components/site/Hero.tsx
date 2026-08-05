"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const HERO_IMAGE = "/flow/laminadora-hero.jpeg";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero({
  totalProducts,
  totalCategories,
}: {
  totalProducts: number;
  totalCategories: number;
}) {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-brand-navy-dark">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay optimizado para móvil (oscuro abajo/texto) y escritorio (oscuro izquierda) */}
      <div className="absolute inset-0 bg-brand-navy-dark/40 sm:bg-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/95 via-brand-navy-dark/70 to-transparent sm:bg-gradient-to-r sm:from-brand-navy-dark/95 sm:via-brand-navy-dark/50 sm:to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 py-24 pb-32 sm:justify-center sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-xl text-left">
          <motion.span
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
            className="inline-flex flex-wrap items-center rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-medium leading-tight text-white/95 backdrop-blur-md sm:text-xs"
          >
            Fabricantes de Equipos Industriales · Armenia, Quindío
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={1}
            variants={fadeUp}
            className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:mt-6 sm:text-5xl lg:text-6xl"
          >
            Soluciones industriales para emprendedores
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={2}
            variants={fadeUp}
            className="mt-4 max-w-lg text-base leading-snug text-white/90 sm:mt-5 sm:text-lg sm:leading-relaxed"
          >
            Tecnología industrial de alto rendimiento para hacer crecer tu negocio con calidad.
            Hornos, freidoras, ollas y más de {totalProducts} equipos en {totalCategories}{" "}
            categorías.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={3}
            variants={fadeUp}
            className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row"
          >
            <Link
              href="/productos"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-teal px-6 py-4 text-sm font-bold text-white transition-all hover:bg-brand-teal-dark hover:shadow-lg hover:shadow-brand-teal/25 sm:w-auto sm:px-8"
            >
              Ver catálogo completo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={buildWhatsAppLink(
                "Hola, quiero más información sobre los equipos de Industrias FECMO."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full border border-white/40 bg-black/20 px-6 py-4 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/10 sm:w-auto sm:px-8"
            >
              Cotizar por WhatsApp
            </a>
          </motion.div>
        </div>
      </div>

      {/* Transicion suave hacia el contenido */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
