"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { buildWhatsAppLink, productQuoteMessage } from "@/lib/whatsapp";

export function AddToCartPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border">
          <button
            aria-label="Disminuir cantidad"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-brand-navy hover:bg-secondary rounded-l-full"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium text-brand-navy">{qty}</span>
          <button
            aria-label="Aumentar cantidad"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center text-brand-navy hover:bg-secondary rounded-r-full"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => {
            addItem(product, qty);
            toast.success("Agregado al carrito", { description: `${product.title} x${qty}` });
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal hover:text-brand-navy-dark"
        >
          <ShoppingCart className="h-4 w-4" />
          Agregar al carrito
        </button>
      </div>

      <a
        href={buildWhatsAppLink(productQuoteMessage(product.title))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 px-6 py-3.5 text-sm font-semibold text-[#128C4A] transition-colors hover:bg-[#25D366]/10"
      >
        <MessageCircle className="h-4 w-4" />
        Cotizar por WhatsApp
      </a>
    </div>
  );
}
