import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getAllCategories, getCategory, getProductsByCategory } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) return {};
  return {
    title: category.name,
    description: `Explora ${category.count} equipos de ${category.name} fabricados por Industrias FECMO en acero inoxidable industrial.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) notFound();

  const products = getProductsByCategory(categoria);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand-navy">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/productos" className="hover:text-brand-navy">Productos</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-brand-navy">{category.name}</span>
      </nav>

      <h1 className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
        {category.name}
      </h1>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
