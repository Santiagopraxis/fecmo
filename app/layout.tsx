import type { Metadata } from "next";
import { League_Spartan, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloatButton } from "@/components/site/WhatsAppFloatButton";
import { Toaster } from "@/components/ui/sonner";
import { getAllCategories, getCategoryImage, getProductsByCategory } from "@/lib/products";

const leagueSpartan = League_Spartan({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3300"),
  title: {
    default: "Industrias FECMO | Maquinaria Industrial para Alimentos",
    template: "%s | Industrias FECMO",
  },
  description:
    "Soluciones industriales para emprendedores. Maquinaria industrial para el sector alimentario en Colombia: hornos, freidoras, ollas, molinos y más.",
  other: {
    "facebook-domain-verification": "nndm5vzgw1kukqaul3ufclkro8p44j",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();
  const categoryImages = Object.fromEntries(
    categories.map((c) => [c.slug, getCategoryImage(c.slug)])
  );
  const categoryProducts = Object.fromEntries(
    categories.map((c) => [c.slug, getProductsByCategory(c.slug).slice(0, 4)])
  );

  return (
    <html
      lang="es"
      className={`${leagueSpartan.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header categories={categories} categoryImages={categoryImages} categoryProducts={categoryProducts} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} />
        <WhatsAppFloatButton />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
