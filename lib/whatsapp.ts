export const WHATSAPP_NUMBER = "573175882755";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productQuoteMessage(title: string): string {
  return `Hola, quiero cotizar el equipo: ${title}. ¿Me pueden dar más información?`;
}
