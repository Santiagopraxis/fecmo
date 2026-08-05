import { createHash } from "crypto";

export function isWompiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_SECRET);
}

export function buildWompiReference(): string {
  return `FECMO-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Firma de integridad requerida por el Web Checkout de Wompi:
 * SHA256(referencia + montoEnCentavos + moneda + secretoDeIntegridad) */
export function buildWompiSignature(reference: string, amountInCents: number, currency = "COP"): string {
  const secret = process.env.WOMPI_INTEGRITY_SECRET ?? "";
  return createHash("sha256")
    .update(`${reference}${amountInCents}${currency}${secret}`)
    .digest("hex");
}

export function buildWompiCheckoutUrl(params: {
  reference: string;
  amountInCents: number;
  signature: string;
  redirectUrl: string;
  currency?: string;
}): string {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "";
  const search = new URLSearchParams({
    "public-key": publicKey,
    currency: params.currency ?? "COP",
    "amount-in-cents": String(params.amountInCents),
    reference: params.reference,
    "redirect-url": params.redirectUrl,
    "signature:integrity": params.signature,
  });
  return `https://checkout.wompi.co/p/?${search.toString()}`;
}
