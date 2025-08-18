"use client";

import useSWR from "swr";
import { HeroCarousel, HeroSlide } from "@/components/hero";
import { FeedItem } from "@/types.db";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Transform feed items to hero slides
function transformFeedToSlides(feedItems: FeedItem[]): HeroSlide[] {
  return feedItems
    .filter(item => {
      // Filter for items that have images and are suitable for hero display
      return item.imageUrl || item.enclosure?.url || item.media;
    })
    .slice(0, 5) // Limit to 5 slides for performance
    .map((item, index) => {
      // Determine image URL priority: imageUrl > enclosure > fallback
      let imageUrl = item.imageUrl;
      if (!imageUrl && item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
        imageUrl = item.enclosure.url;
      }
      if (!imageUrl) {
        // Fallback images for different categories of news
        const fallbackImages = [
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80", // Financial charts
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1920&q=80", // Business meeting
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80", // City skyline
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=80", // Stock market
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80", // Analytics
        ];
        imageUrl = fallbackImages[index % fallbackImages.length];
      }

      // Extract domain from link for source
      const getDomain = (url: string): string => {
        try {
          return new URL(url).hostname.replace('www.', '').split('.')[0];
        } catch {
          return 'News';
        }
      };

      return {
        id: item.guid || `slide-${index}`,
        title: item.title || 'Financial News Update',
        subtitle: item.contentSnippet || item.content?.replace(/<[^>]*>/g, '').slice(0, 200) || 'Stay updated with the latest financial news and market insights.',
        image: imageUrl,
        alt: `${item.title} - Financial news article image`,
        pubDate: item.pubDate,
        source: item.creator || getDomain(item.link).toUpperCase(),
        cta: {
          label: 'Read Article',
          href: item.link
        }
      };
    });
}

export default function HeroClient() {
  // Fetch both feeds and fallback slides
  const { data: feedData } = useSWR<{ items: FeedItem[] }>("/api/feeds", fetcher, {
    refreshInterval: 300000, // Refresh every 5 minutes
    revalidateOnFocus: false
  });
  
  const { data: heroData } = useSWR<{ slides: HeroSlide[] }>("/api/hero", fetcher);

  // Transform feed data to slides, fallback to static slides
  let slides: HeroSlide[] = [];

  if (feedData?.items && feedData.items.length > 0) {
    slides = transformFeedToSlides(feedData.items);
  }

  // If no feed slides or insufficient feed slides, use fallback
  if (slides.length === 0) {
    slides = heroData?.slides || [
      {
        id: "hero-1",
        title: "Daily Markets. Clear Signals.",
        subtitle: "Big-visual hero with calm overlay. Inspired by modern financial platforms.",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80",
        alt: "Aerial city skyline at dusk with soft light and distant markets mood",
        source: "NVCCZ",
        cta: { label: "Explore Markets", href: "/feeds" }
      },
      {
        id: "hero-2", 
        title: "Zimbabwe Focus. Africa Context.",
        subtitle: "Editorial hierarchy and premium spacing for headline overlays.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1920&q=80",
        alt: "Hands using a tablet displaying financial charts and analytics",
        source: "NVCCZ",
        cta: { label: "View Analytics", href: "/feeds" }
      },
      {
        id: "hero-3",
        title: "Personalized Feeds. Enterprise Ready.", 
        subtitle: "Comprehensive financial data and insights for informed decision making.",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80",
        alt: "Abstract soft gradient and bokeh lights for brand-forward backdrop",
        source: "NVCCZ",
        cta: { label: "Get Started", href: "/feeds" }
      }
    ];
  }

  return <HeroCarousel slides={slides} />;
}