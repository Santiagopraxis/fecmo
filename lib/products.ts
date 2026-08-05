import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import type { Product, Category } from "@/lib/types";

const products = productsData as unknown as Product[];
const categories = categoriesData as unknown as Category[];

export function getAllProducts(): Product[] {
  return products;
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProduct(categorySlug: string, slug: string): Product | undefined {
  return products.find((p) => p.categorySlug === categorySlug && p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategoryImage(categorySlug: string): string | null {
  const product = products.find((p) => p.categorySlug === categorySlug && p.images.length > 0);
  return product?.images[0] ?? null;
}

export function getFeaturedProducts(count = 8): Product[] {
  // Prioriza productos con precio y con mas de una foto (mejor presentacion).
  const scored = [...products].sort((a, b) => {
    const scoreA = (a.price ? 2 : 0) + (a.images.length > 1 ? 1 : 0);
    const scoreB = (b.price ? 2 : 0) + (b.images.length > 1 ? 1 : 0);
    return scoreB - scoreA;
  });
  return scored.slice(0, count);
}

export function formatCOP(value: number | null | undefined): string {
  if (value == null) return "Precio a cotizar";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
