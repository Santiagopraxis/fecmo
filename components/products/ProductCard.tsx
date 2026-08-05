"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { formatCOP } from "@/lib/products";
import { useCartStore } from "@/lib/cart-store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-lg hover:shadow-brand-navy/10"
    >
      <Link
        href={`/productos/${product.categorySlug}/${product.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-white"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Sin imagen
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/productos/${product.categorySlug}/${product.slug}`}>
          <h3 className="line-clamp-2 font-heading text-sm font-semibold text-brand-navy">
            {product.title}
          </h3>
        </Link>
        <p className="text-base font-bold text-brand-navy">{formatCOP(product.price)}</p>

        <button
          onClick={() => {
            addItem(product);
            toast.success("Agregado al carrito", { description: product.title });
          }}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-teal hover:text-brand-navy-dark"
        >
          <ShoppingCart className="h-4 w-4" />
          Agregar
        </button>
      </div>
    </motion.div>
  );
}
