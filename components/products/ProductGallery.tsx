"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza el estado inicial con embla al montar
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-secondary text-sm text-muted-foreground">
        Sin imagen disponible
      </div>
    );
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-white">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, i) => (
              <div key={src} className="relative aspect-square min-w-0 flex-[0_0_100%]">
                <Image
                  src={src}
                  alt={`${title} - imagen ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6"
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              aria-label="Imagen anterior"
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md transition-transform hover:scale-105"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Imagen siguiente"
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md transition-transform hover:scale-105"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                selected === i ? "border-brand-teal" : "border-border"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
