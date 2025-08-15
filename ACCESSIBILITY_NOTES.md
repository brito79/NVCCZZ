# Accessibility Notes

- Global skip link in `components/layout/Layout.tsx`
- Header search has role="search", inputs with labels/aria-labels
- FeedCard links have aria-labels with titles
- Carousel uses aria-roledescription="carousel" and slide group labels
- Focus outlines enabled on actionable elements; use keyboard to verify
- Color contrast: tokens use OKLCH with strong contrast in dark mode