"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category } from "@/lib/types";

export function CategoryCard({
  category,
  image,
  index = 0,
}: {
  category: Category;
  image: string | null;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }}
    >
      <Link
        href={`/productos/${category.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-brand-teal/40 hover:shadow-lg hover:shadow-brand-navy/10"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          {image ? (
            <Image
              src={image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="font-heading text-sm font-semibold text-brand-navy">{category.name}</p>
          <p className="text-xs text-muted-foreground">
            {category.count} producto{category.count !== 1 ? "s" : ""}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
