"use client";

import { useEffect, useState } from "react";

/** Evita mismatches de hidratación al leer estado que solo existe en el
 * cliente (ej. un store persistido en localStorage como el carrito). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón estándar de hidratación cliente-only
    setMounted(true);
  }, []);
  return mounted;
}
