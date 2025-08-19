"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  source?: string;
  pubDate?: string;
  cta?: {
    label: string;
    href: string;
  };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplayInterval?: number;
}

export function HeroCarousel({ 
  slides, 
  autoplayInterval = 6000 
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const slideCount = slides.length;
  
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
  }, [slideCount]);
  
  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
  }, [slideCount]);
  
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    // Pause autoplay briefly when manually changing slides
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      goToNext();
    } else if (touchStart - touchEnd < -100) {
      // Swipe right
      goToPrev();
    }
  };
  
  // Autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      interval = setInterval(goToNext, autoplayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, goToNext, autoplayInterval]);
  
  // Pause autoplay when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsAutoPlaying(!document.hidden);
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return "";
    }
  };
  
  if (slides.length === 0) {
    return null;
  }
  
  const currentSlide = slides[currentIndex];
  
  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-primary-950 shadow-xl"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image Layer */}
      <div className="relative h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentSlide.image}
              alt={currentSlide.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-900/50 to-primary-900/30" />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Content Layer */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* Source & Date */}
            {(currentSlide.source || currentSlide.pubDate) && (
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/80">
                {currentSlide.source && (
                  <span className="rounded-full bg-primary-700/50 px-2.5 py-1 backdrop-blur-sm">
                    {currentSlide.source}
                  </span>
                )}
                {currentSlide.pubDate && (
                  <span className="text-white/70">{formatDate(currentSlide.pubDate)}</span>
                )}
              </div>
            )}
            
            {/* Title */}
            <h2 className="text-hero-h font-bold leading-tight text-white">
              {currentSlide.title}
            </h2>
            
            {/* Subtitle */}
            <p className="mt-2 max-w-2xl text-hero-sub text-white/80">
              {currentSlide.subtitle}
            </p>
            
            {/* CTA */}
            {currentSlide.cta && (
              <a
                href={currentSlide.cta.href}
                className="mt-4 inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2"
              >
                {currentSlide.cta.label}
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2">
        {/* Dots */}
        <div className="hidden sm:flex items-center gap-1.5 mr-2">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Arrows */}
        <button
          onClick={goToPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={goToNext}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}