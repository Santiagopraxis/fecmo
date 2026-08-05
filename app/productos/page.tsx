import type { Metadata } from "next";
import { getAllCategories, getCategoryImage } from "@/lib/products";
import { CategoryCard } from "@/components/products/CategoryCard";
import { CATEGORY_GROUPS } from "@/lib/category-groups";

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Explora todo el catálogo de maquinaria industrial de Industrias FECMO por categoría: hornos, freidoras, ollas, molinos y más.",
};

export default function ProductosPage() {
  const categories = getAllCategories();
  const byslug = new Map(categories.map((c) => [c.slug, c]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
          Catálogo de productos
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {categories.length} categorías de maquinaria industrial para el sector alimentario,
          fabricadas con acero inoxidable de alta calidad.
        </p>
      </div>

      <div className="flex flex-col gap-14">
        {CATEGORY_GROUPS.map((group) => {
          const groupCategories = group.slugs
            .map((slug) => byslug.get(slug))
            .filter((c): c is NonNullable<typeof c> => Boolean(c));
          if (groupCategories.length === 0) return null;

          return (
            <section key={group.name}>
              <h2 className="font-heading text-xl font-bold text-brand-navy sm:text-2xl">
                {group.name}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {groupCategories.map((cat, i) => (
                  <CategoryCard
                    key={cat.slug}
                    category={cat}
                    image={getCategoryImage(cat.slug)}
                    index={i}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
