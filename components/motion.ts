// lib/animation.ts
import type { Variants, Transition } from "framer-motion";

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const underlineTransition: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.6
};