import type { Metadata } from "next";
import CarritoClient from "./CarritoClient";

export const metadata: Metadata = {
  title: "Carrito de compras",
};

export default function CarritoPage() {
  return <CarritoClient />;
}
