"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatCOP } from "@/lib/products";
import { useMounted } from "@/lib/use-mounted";

export default function CarritoClient() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const mounted = useMounted();

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-brand-navy">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explora el catálogo y agrega los equipos que necesitas para tu negocio.
        </p>
        <Link
          href="/productos"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-teal hover:text-brand-navy-dark"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
        Carrito de compras
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-border bg-white p-4"
            >
              <Link
                href={`/productos/${item.categorySlug}/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-white sm:h-24 sm:w-24"
              >
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="96px" className="object-contain p-2" />
                ) : null}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/productos/${item.categorySlug}/${item.slug}`}
                    className="line-clamp-2 font-heading text-sm font-semibold text-brand-navy"
                  >
                    {item.title}
                  </Link>
                  <button
                    aria-label="Eliminar"
                    onClick={() => removeItem(item.productId)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      aria-label="Disminuir"
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-brand-navy hover:bg-secondary rounded-l-full"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-brand-navy">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Aumentar"
                      onClick={() => setQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-brand-navy hover:bg-secondary rounded-r-full"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold text-brand-navy">
                    {formatCOP((item.price ?? 0) * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-base font-semibold text-brand-navy">Resumen</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCOP(totalPrice)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            El envío se calcula al confirmar el pedido.
          </p>
          <Link
            href="/checkout"
            className="mt-6 flex items-center justify-center rounded-full bg-brand-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal hover:text-brand-navy-dark"
          >
            Ir a pagar
          </Link>
        </div>
      </div>
    </div>
  );
}
