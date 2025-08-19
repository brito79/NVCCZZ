"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";

// Hero carousel with autoplay, pause on hover, keyboard navigation, and LQIP placeholders
// - Uses Next/Image with priority for first slide
// - Accessible roles/labels and focus management

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  image: string; // public path e.g. /hero/finance-1.jpg or URL
  alt: string; // accessible alt text
  lqip?: string; // base64 placeholder
  cta?: { label: string; href: string };
  pubDate?: string; // for feed articles
  source?: string; // source name
};

// Utility function to format date nicely
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// Utility to extract domain from URL
function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'Source';
  }
}

export default function HeroCarousel({ slides, interval = 5000 }: { slides: HeroSlide[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autoplay
  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || isHovering || paused || slides.length <= 1) {
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index, isHovering, paused, interval, slides.length]);

  const goto = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured stories"
      className="relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-sm"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slides */}
      <div className="relative h-[44vw] max-h-[520px] min-h-[240px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              priority={i < 2}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 100vw, 1200px"
              className="object-cover"
              placeholder={s.lqip ? "blur" : "empty"}
              blurDataURL={s.lqip}
              onError={(e) => {
                // Fallback to a default image if the feed image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80";
              }}
            />
            {/* Enhanced gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" aria-hidden="true" />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <div className="max-w-4xl bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-xl">
                {/* Publication Date only */}
                {s.pubDate && (
                  <div className="mb-2 text-xs text-white">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {formatDate(s.pubDate)}
                  </div>
                )}
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white mb-3 line-clamp-2 text-shadow-lg">{s.title}</h2>
                
                {/* Optional subtitle with improved visibility */}
                {s.subtitle && (
                  <p className="text-sm sm:text-base text-white mb-4 line-clamp-2 max-w-3xl">
                    {s.subtitle}
                  </p>
                )}
                
                {s.cta && (
                  <a
                    href={s.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                  >
                    {s.cta.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 sm:bottom-4">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            aria-pressed={i === index}
            className={`pointer-events-auto h-2.5 w-2.5 rounded-full ring-offset-2 focus:outline-none focus:ring-2 focus:ring-ring/50 ${
              i === index ? "bg-primary" : "bg-white/40 hover:bg-white/70"
            }`}
            onClick={() => goto(i)}
          />
        ))}
      </div>

      <div className="absolute right-2 top-2 hidden gap-2 sm:flex">
        <button
          type="button"
          aria-label="Previous slide"
          className="rounded-md border border-input bg-background/70 p-2 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/50"
          onClick={() => goto(index - 1)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={paused ? 'Play slides' : 'Pause slides'}
          className="rounded-md border border-input bg-background/70 p-2 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/50"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 14h1m4 0h1" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="rounded-md border border-input bg-background/70 p-2 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring/50"
          onClick={() => goto(index + 1)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}