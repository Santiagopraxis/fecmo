export type Product = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  price: number | null;
  priceVariants: Record<string, number | null> | null;
  specs: Record<string, string>;
  images: string[];
  sourcePage: number;
  sourceFile: string;
};

export type Category = {
  slug: string;
  name: string;
  count: number;
};
