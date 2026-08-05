"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/types";

type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("relevancia");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "precio-asc":
        return list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      case "precio-desc":
        return list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      case "nombre":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list;
    }
  }, [products, sort]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {products.length} producto{products.length !== 1 ? "s" : ""}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal"
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No hay productos en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
