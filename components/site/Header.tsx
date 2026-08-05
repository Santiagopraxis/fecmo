"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ChevronDown, MessageCircle, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { CartButton } from "@/components/site/CartButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATEGORY_GROUPS } from "@/lib/category-groups";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Category, Product } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const DISCOVER_LINKS = [
  { href: "/productos", label: "Ver catálogo completo", icon: Sparkles },
  { href: "/nosotros", label: "Garantía y calidad FECMO", icon: ShieldCheck },
  { href: "/contacto", label: "Cotizar un proyecto", icon: Tag },
];

export function Header({
  categories,
  categoryImages,
  categoryProducts,
}: {
  categories: Category[];
  categoryImages: Record<string, string | null>;
  categoryProducts: Record<string, Product[]>;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const byslug = new Map(categories.map((c) => [c.slug, c]));

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Industrias FECMO">
          <Image
            src="/brand/fecmo-logo-full.png"
            alt="Industrias FECMO"
            width={180}
            height={48}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5"
          >
            Inicio
          </Link>

          <div
            className="relative"
            onMouseEnter={openMega}
            onMouseLeave={scheduleCloseMega}
          >
            <Link
              href="/productos"
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5"
            >
              Productos
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </Link>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-x-0 top-16 z-50"
                >
                  <div className="w-full border-b border-border bg-white shadow-2xl shadow-brand-navy/10">
                    <div className="mx-auto flex max-w-[1400px] gap-8 px-8 py-7">
                      {/* Paso 1: elegir el grupo (como las pestañas de Samsung) */}
                      <div className="w-56 shrink-0 border-r border-border pr-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Categorías
                        </p>
                        <div className="flex flex-col gap-0.5">
                          {CATEGORY_GROUPS.map((group, i) => (
                            <button
                              key={group.name}
                              type="button"
                              onMouseEnter={() => setActiveGroup(i)}
                              onFocus={() => setActiveGroup(i)}
                              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                                activeGroup === i
                                  ? "bg-brand-navy text-white"
                                  : "text-brand-navy/80 hover:bg-secondary"
                              }`}
                            >
                              {group.name}
                              <span
                                className={`text-xs ${activeGroup === i ? "text-white/70" : "text-muted-foreground"}`}
                              >
                                {group.slugs.length}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Paso 2: productos del grupo seleccionado */}
                      <div className="flex-1" onMouseLeave={() => setHoveredCategory(null)}>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {CATEGORY_GROUPS[activeGroup].name}
                        </p>
                        <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                          {CATEGORY_GROUPS[activeGroup].slugs.map((slug) => {
                            const cat = byslug.get(slug);
                            const image = categoryImages[slug];
                            if (!cat) return null;
                            return (
                              <Link
                                key={slug}
                                href={`/productos/${slug}`}
                                onClick={() => setMegaOpen(false)}
                                onMouseEnter={() => setHoveredCategory(slug)}
                                className="group flex flex-col items-center gap-1.5 rounded-xl p-2 text-center transition-colors hover:bg-secondary"
                              >
                                <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-white">
                                  {image ? (
                                    <Image
                                      src={image}
                                      alt=""
                                      fill
                                      sizes="56px"
                                      className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                                    />
                                  ) : null}
                                </span>
                                <span className="text-xs font-medium leading-tight text-brand-navy">
                                  {cat.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Panel "Descubre" estilo Samsung */}
                      <div className="flex w-72 shrink-0 flex-col border-l border-border pl-8">
                        {hoveredCategory ? (
                          <>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {byslug.get(hoveredCategory)?.name}
                            </p>
                            <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
                              {categoryProducts[hoveredCategory]?.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/productos/${hoveredCategory}/${product.slug}`}
                                  onClick={() => setMegaOpen(false)}
                                  className="group flex flex-col overflow-hidden rounded-xl bg-secondary/30 transition-colors hover:bg-secondary"
                                >
                                  <div className="relative aspect-square w-full">
                                    {product.images?.[0] ? (
                                      <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        fill
                                        sizes="120px"
                                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                                      />
                                    ) : null}
                                  </div>
                                  <div className="p-2 text-center">
                                    <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-brand-navy">
                                      {product.title}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <Link
                              href={`/productos/${hoveredCategory}`}
                              onClick={() => setMegaOpen(false)}
                              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-navy/5 py-2 text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-navy/10"
                            >
                              Ver todos →
                            </Link>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              Descubre
                            </p>
                            <ul className="mt-4 flex flex-col gap-1">
                              {DISCOVER_LINKS.map(({ href, label, icon: Icon }) => (
                                <li key={label}>
                                  <Link
                                    href={href}
                                    onClick={() => setMegaOpen(false)}
                                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-brand-navy/85 transition-colors hover:bg-secondary hover:text-brand-teal-dark"
                                  >
                                    <Icon className="h-4 w-4 text-brand-teal" />
                                    {label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-6 rounded-xl bg-brand-gradient p-4 text-white">
                              <p className="text-xs font-semibold">¿Necesitas asesoría?</p>
                              <p className="mt-1 text-xs text-white/85">
                                Te ayudamos a elegir el equipo ideal para tu negocio.
                              </p>
                              <a
                                href={buildWhatsAppLink(
                                  "Hola, quiero más información sobre los equipos de Industrias FECMO."
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-brand-navy transition-transform hover:scale-105"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                WhatsApp
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/nosotros"
            className="rounded-full px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5"
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            className="rounded-full px-4 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy/5"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <CartButton />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button
                  aria-label="Abrir menú"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-navy hover:bg-brand-navy/5 md:hidden"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetHeader>
                <SheetTitle>
                  <Image
                    src="/brand/fecmo-logo-full.png"
                    alt="Industrias FECMO"
                    width={150}
                    height={40}
                    className="h-8 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 overflow-y-auto px-4 pb-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-brand-navy hover:bg-brand-navy/5"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border pt-2">
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Categorías
                  </p>
                  <Accordion>
                    {CATEGORY_GROUPS.map((group) => (
                      <AccordionItem key={group.name} value={group.name} className="px-3">
                        <AccordionTrigger className="text-brand-navy">
                          {group.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-3 gap-3">
                            {group.slugs.map((slug) => {
                              const cat = byslug.get(slug);
                              const image = categoryImages[slug];
                              if (!cat) return null;
                              return (
                                <Link
                                  key={slug}
                                  href={`/productos/${slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-secondary"
                                >
                                  <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-white">
                                    {image ? (
                                      <Image
                                        src={image}
                                        alt=""
                                        fill
                                        sizes="48px"
                                        className="object-contain p-1"
                                      />
                                    ) : null}
                                  </span>
                                  <span className="text-[11px] font-medium leading-tight text-brand-navy">
                                    {cat.name}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Link
                    href="/productos"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 block rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-teal-dark hover:bg-brand-navy/5"
                  >
                    Ver todas las categorías →
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
