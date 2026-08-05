import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type WompiEvent = {
  event: string;
  data: Record<string, unknown>;
  sent_at: string;
  signature: { checksum: string; properties: string[] };
};

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function isValidWompiEvent(event: WompiEvent): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) return false;
  const concatenated =
    event.signature.properties
      .map((path) => String(getByPath(event.data, path) ?? ""))
      .join("") +
    event.sent_at +
    secret;
  const checksum = createHash("sha256").update(concatenated).digest("hex");
  return checksum === event.signature.checksum;
}

export async function POST(req: NextRequest) {
  const event = (await req.json()) as WompiEvent;

  if (!isValidWompiEvent(event)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  // TODO: cuando exista persistencia de pedidos (Vercel Postgres/Turso),
  // buscar el pedido por `reference` y marcarlo como pagado/fallido aquí
  // según event.data.transaction.status.
  console.log("Evento Wompi recibido:", event.event, event.data);

  return NextResponse.json({ received: true });
}
