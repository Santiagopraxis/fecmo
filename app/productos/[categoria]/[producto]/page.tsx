import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  formatCOP,
} from "@/lib/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { AddToCartPanel } from "@/components/products/AddToCartPanel";
import { ProductCard } from "@/components/products/ProductCard";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ categoria: p.categorySlug, producto: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>;
}): Promise<Metadata> {
  const { categoria, producto } = await params;
  const product = getProduct(categoria, producto);
  if (!product) return {};
  return {
    title: product.title,
    description: `${product.title} — ${product.category}. ${Object.entries(product.specs)
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${v}`)
      .join(". ")}`,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>;
}) {
  const { categoria, producto } = await params;
  const product = getProduct(categoria, producto);
  if (!product) notFound();

  const related = getProductsByCategory(categoria)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const specEntries = Object.entries(product.specs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    category: product.category,
    image: product.images,
    brand: { "@type": "Brand", name: "Industrias FECMO" },
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "COP",
            price: product.price,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand-navy">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/productos" className="hover:text-brand-navy">Productos</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/productos/${product.categorySlug}`} className="hover:text-brand-navy">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 font-medium text-brand-navy">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <span className="inline-flex items-center rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal-dark">
            {product.category}
          </span>
          <h1 className="mt-3 font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
            {product.title}
          </h1>
          <p className="mt-3 text-3xl font-bold text-brand-navy">{formatCOP(product.price)}</p>

          {product.priceVariants && Object.keys(product.priceVariants).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(product.priceVariants).map(([tag, price]) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-brand-navy"
                >
                  {tag}: {formatCOP(price)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>

          {specEntries.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-base font-semibold text-brand-navy">
                Especificaciones técnicas
              </h2>
              <dl className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-0.5 bg-white px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                    <dt className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {key}
                    </dt>
                    <dd className="text-sm text-brand-navy">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-xl font-bold text-brand-navy">
            Más de {product.category}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
