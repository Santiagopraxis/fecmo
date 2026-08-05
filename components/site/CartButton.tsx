"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";

export function CartButton() {
  const totalItems = useCartStore((s) => s.totalItems());
  const mounted = useMounted();

  return (
    <Link
      href="/carrito"
      aria-label="Ver carrito"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-navy transition-colors hover:bg-brand-navy/5"
    >
      <ShoppingCart className="h-5 w-5" />
      {mounted && totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-teal px-1 text-[10px] font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
