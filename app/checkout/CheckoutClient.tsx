"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatCOP } from "@/lib/products";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useMounted } from "@/lib/use-mounted";

type FormState = {
  name: string;
  document: string;
  phone: string;
  address: string;
  city: string;
};

const EMPTY_FORM: FormState = { name: "", document: "", phone: "", address: "", city: "" };

export default function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const mounted = useMounted();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [wompiUnavailable, setWompiUnavailable] = useState(false);

  useEffect(() => {
    if (mounted && items.length === 0) router.replace("/carrito");
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return null;

  const formValid = Object.values(form).every((v) => v.trim().length > 1);

  const whatsappSummary = () => {
    const lines = items.map((i) => `- ${i.title} x${i.quantity}`).join("\n");
    return `Hola, quiero confirmar este pedido:\n${lines}\n\nTotal: ${formatCOP(totalPrice)}\n\nNombre: ${form.name}\nDirección: ${form.address}, ${form.city}\nTeléfono: ${form.phone}`;
  };

  async function handlePay() {
    setLoading(true);
    setWompiUnavailable(false);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalPrice }),
      });
      if (res.status === 503) {
        setWompiUnavailable(true);
        return;
      }
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">Checkout</h1>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-sm font-semibold text-brand-navy">Datos de envío</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            placeholder="Nombre completo"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal sm:col-span-2"
          />
          <input
            placeholder="Cédula o NIT"
            value={form.document}
            onChange={(e) => setForm((f) => ({ ...f, document: e.target.value }))}
            className="rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
          <input
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
          <input
            placeholder="Dirección"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal sm:col-span-2"
          />
          <input
            placeholder="Ciudad"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            className="rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal sm:col-span-2"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-heading text-sm font-semibold text-brand-navy">Resumen del pedido</h2>
        <ul className="mt-3 divide-y divide-border">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between py-2 text-sm text-brand-navy">
              <span>{item.title} × {item.quantity}</span>
              <span>{formatCOP((item.price ?? 0) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold text-brand-navy">
          <span>Total</span>
          <span>{formatCOP(totalPrice)}</span>
        </div>
      </div>

      {!wompiUnavailable ? (
        <button
          disabled={!formValid || loading}
          onClick={handlePay}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal hover:text-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Pagar con Wompi
        </button>
      ) : (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-center">
          <p className="text-sm text-amber-900">
            Los pagos en línea se están activando. Mientras tanto, confirma tu pedido directamente
            por WhatsApp y te ayudamos a completar la compra.
          </p>
          <a
            href={buildWhatsAppLink(whatsappSummary())}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Confirmar pedido por WhatsApp
          </a>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        ¿Prefieres cotizar antes de pagar?{" "}
        <Link href="/contacto" className="text-brand-teal-dark hover:underline">
          Contáctanos
        </Link>
      </p>
    </div>
  );
}
