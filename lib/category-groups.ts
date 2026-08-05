export type CategoryGroup = {
  name: string;
  slugs: string[];
};

/** Agrupa las 24 categorías del catálogo en familias más cortas para
 * que el menú de navegación no muestre una lista plana de 24 items. */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: "Hornos",
    slugs: [
      "hornos-panaderos",
      "hornos-para-pizza",
      "hornos-para-pollos",
      "hornos-lechoneros",
      "hornos-multiusos",
      "hornos-rotatorios-de-panaderia",
      "hornos-tipo-tunel",
    ],
  },
  {
    name: "Cocción y Fogones",
    slugs: ["ollas", "estufas", "fogones-de-lena", "planchas", "asadores-y-parrillas"],
  },
  {
    name: "Procesamiento de Alimentos",
    slugs: ["freidoras", "molinos", "procesadores-de-carnes", "licuadoras"],
  },
  {
    name: "Básculas y Utensilios",
    slugs: ["basculas", "utensilios", "bandejas", "tablas-de-acero"],
  },
  {
    name: "Panadería y Crecimiento",
    slugs: ["cuartos-de-crecimiento", "deshidratadores", "topineras"],
  },
  {
    name: "Importados",
    slugs: ["importados"],
  },
];
