export type PromoBanner = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
  /** Ruta a una imagen (ej. generada en Flow) para reemplazar el fondo
   * degradado por defecto. Deja en null mientras no haya imagen real. */
  image: string | null;
};

// Edita/agrega banners aqui. Para agregar una imagen nueva, guardala en
// public/flow/ y pon la ruta en `image` (ej. "/flow/mi-imagen.jpeg").
export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: "producto-semana",
    eyebrow: "Producto de la semana",
    title: "Hornos panaderos de alto rendimiento",
    subtitle: "Acero inoxidable industrial, garantía en soldaduras y despacho a toda Colombia.",
    ctaLabel: "Ver hornos panaderos",
    href: "/productos/hornos-panaderos",
    image: "/flow/horno-humo-detalle.jpeg",
  },
  {
    id: "molinos",
    eyebrow: "Destacado",
    title: "Molinos industriales para tu negocio",
    subtitle: "Alta capacidad de molienda, construidos para uso intensivo todos los días.",
    ctaLabel: "Ver molinos",
    href: "/productos/molinos",
    image: "/flow/molino-industrial.jpeg",
  },
  {
    id: "laminadoras",
    eyebrow: "Especializados",
    title: "Laminadoras de arepas",
    subtitle: "Equipos especializados para producción de arepas a escala. Consúltanos.",
    ctaLabel: "Consultar disponibilidad",
    href: "/contacto",
    image: "/flow/laminadora-arepas.jpeg",
  },
];
