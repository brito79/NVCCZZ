# NVCCZ UX Delivery Checklist

## Hero Frames (desktop/mobile)
- Desktop: 1200x600 hero, full-bleed image, gradient overlay, headline + subhead, CTA (see `components/hero/HeroCarousel.tsx`)
- Mobile: height clamps to 44vw (min 240px), headline 2xl, safe padding, dots controls reachable
- Use slides from `/api/hero` or `public/hero/slides.json`

## Feed Card Spec
- Container: rounded-lg/xl, border 1px, hover elevations
- Spacing: 16px inner (image card), 24px inner (text card)
- Type: title (lg–xl, semibold–bold), snippet (sm, relaxed), meta (xs)
- Actions: Read More link (accessible label), card focus ring on keyboard

## CSS Tokens
- Colors, radius, and charts defined in `app/globals.css` under `:root` and `.dark`
- Fonts: Poppins as `--font-sans` (see `app/layout.tsx`)
- Spacing scale: Tailwind defaults, plus radii tokens `--radius-*`

## Layout Component
- Implemented `components/layout/Layout.tsx`: Header/Main/Footer
- Header: global search, notifications icon, avatar
- Accessibility: skip link, roles, keyboard focus

## HeroCarousel
- Autoplay with hover pause, keyboard controls, Next/Image priority for first slides
- LQIP supported via optional `lqip` string (base64) in slide

## Mock APIs
- `/api/hero` returns 3 slides
- `/api/feeds` existing (RSS); feed grid displays with "Load more" fallback

## Responsive Layout
- Desktop verified (multi-column feed), tablet breakpoint via Tailwind, mobile single column

## Alt-text & LQIP
- Slide alt text in `public/hero/slides.json` and `/api/hero`
- Use `placeholder="blur"` if `lqip` provided

## References
- Bing News, Apple product pages, Microsoft Viva Connections, McKinsey, TradingView, Yahoo Finance
