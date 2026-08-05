import { NextRequest, NextResponse } from "next/server";
import {
  buildWompiCheckoutUrl,
  buildWompiReference,
  buildWompiSignature,
  isWompiConfigured,
} from "@/lib/wompi";

type CheckoutBody = {
  totalPrice: number;
};

export async function POST(req: NextRequest) {
  if (!isWompiConfigured()) {
    return NextResponse.json(
      { error: "Wompi no está configurado todavía." },
      { status: 503 }
    );
  }

  const body = (await req.json()) as CheckoutBody;
  const amountInCents = Math.round(body.totalPrice * 100);
  if (!amountInCents || amountInCents <= 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const reference = buildWompiReference();
  const signature = buildWompiSignature(reference, amountInCents);
  const origin = req.nextUrl.origin;

  const checkoutUrl = buildWompiCheckoutUrl({
    reference,
    amountInCents,
    signature,
    redirectUrl: `${origin}/checkout/confirmacion?reference=${reference}`,
  });

  return NextResponse.json({ checkoutUrl, reference });
}
