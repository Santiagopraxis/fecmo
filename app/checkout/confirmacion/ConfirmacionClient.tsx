"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("id");
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <CheckCircle2 className="h-14 w-14 text-brand-teal" />
      <h1 className="mt-4 font-heading text-2xl font-bold text-brand-navy">
        ¡Gracias por tu pedido!
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Estamos confirmando tu pago con Wompi. Te contactaremos por WhatsApp para coordinar la
        entrega.
      </p>
      {reference && (
        <p className="mt-3 rounded-full bg-secondary px-4 py-1.5 text-xs text-muted-foreground">
          Referencia: {reference}
        </p>
      )}
      <Link
        href="/productos"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand-teal hover:text-brand-navy-dark"
      >
        Seguir explorando el catálogo
      </Link>
    </div>
  );
}

export default function ConfirmacionClient() {
  return (
    <Suspense fallback={null}>
      <ConfirmacionContent />
    </Suspense>
  );
}
