import type { Metadata } from "next";
import ConfirmacionClient from "./ConfirmacionClient";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

export default function ConfirmacionPage() {
  return <ConfirmacionClient />;
}
