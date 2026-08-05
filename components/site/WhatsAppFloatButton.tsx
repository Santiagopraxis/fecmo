"use client";

import { motion } from "framer-motion";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const DEFAULT_MESSAGE =
  "Hola, quiero más información sobre los equipos de Industrias FECMO.";

export function WhatsAppFloatButton() {
  return (
    <motion.a
      href={buildWhatsAppLink(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 md:bottom-8 md:right-8"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current">
        <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.323.646 4.494 1.77 6.35L4 29l7.82-1.727a11.94 11.94 0 0 0 4.184.75h.005c6.627 0 12.004-5.377 12.004-12.004C28.013 8.377 22.636 3 16.004 3Zm7.03 17.03c-.297.836-1.474 1.53-2.4 1.72-.638.13-1.47.234-4.276-.918-3.586-1.47-5.894-5.11-6.074-5.35-.178-.238-1.455-1.937-1.455-3.696 0-1.76.93-2.62 1.26-2.98.297-.324.65-.405.867-.405.216 0 .433.002.624.012.2.01.468-.076.732.559.297.716.996 2.475 1.083 2.655.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.378.47-.54.63-.18.18-.367.376-.158.735.21.36.933 1.54 2.003 2.494 1.376 1.226 2.536 1.605 2.895 1.786.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.09.986 2.45 1.166.36.18.6.27.687.42.09.15.09.87-.207 1.706Z" />
      </svg>
    </motion.a>
  );
}
