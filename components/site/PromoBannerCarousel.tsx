"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { PROMO_BANNERS } from "@/lib/promo-banners";

export function PromoBannerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const togglePlay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    if (isPlaying) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi, isPlaying]);

  const handleMouseEnter = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (autoplay && isPlaying) {
      autoplay.stop();
    }
  }, [emblaApi, isPlaying]);

  const handleMouseLeave = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (autoplay && isPlaying) {
      autoplay.play();
    }
  }, [emblaApi, isPlaying]);

  return (
    <section className="w-full py-8 sm:mx-auto sm:max-w-7xl sm:px-12 sm:py-12 lg:px-16">
      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="overflow-hidden sm:rounded-3xl" ref={emblaRef}>
          <div className="flex">
            {PROMO_BANNERS.map((banner) => (
              <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
                <div className="bg-brand-gradient relative flex min-h-[400px] items-center overflow-hidden px-6 py-12 sm:min-h-[440px] sm:px-14 lg:min-h-[520px]">
                  {banner.image && (
                    <Image
                      src={banner.image}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={banner.id === PROMO_BANNERS[0].id}
                    />
                  )}
                  {/* Gradiente más fuerte en móvil para asegurar legibilidad */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy-dark/95 via-brand-navy-dark/60 to-transparent sm:bg-gradient-to-r sm:from-brand-navy-dark/90 sm:from-10% sm:via-brand-navy-dark/45 sm:via-45% sm:to-transparent sm:to-80%" />
                  <div className="relative mt-auto w-full sm:mt-0 sm:max-w-md">
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {banner.eyebrow}
                    </span>
                    <h3 className="mt-3 font-heading text-2xl font-bold leading-tight text-white sm:mt-4 sm:text-3xl">
                      {banner.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base sm:text-white/85">
                      {banner.subtitle}
                    </p>
                    <Link
                      href={banner.href}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-brand-navy transition-transform hover:scale-105 sm:w-auto sm:py-2.5 sm:font-semibold"
                    >
                      {banner.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Banner anterior"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute -left-12 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center text-muted-foreground transition-all hover:scale-110 hover:text-brand-teal sm:flex"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
        </button>
        <button
          aria-label="Siguiente banner"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute -right-12 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center text-muted-foreground transition-all hover:scale-110 hover:text-brand-teal sm:flex"
        >
          <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={togglePlay}
          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-brand-navy"
          aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <div className="flex items-center gap-2">
          {PROMO_BANNERS.map((banner, i) => (
            <button
              key={banner.id}
              aria-label={`Ir al banner ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                selected === i ? "w-6 bg-brand-teal" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
