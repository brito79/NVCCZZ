import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; // keep fetch for XML fetching

const sources = [
  'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
  // add more sources as needed, commented or uncommented
];

// FeedItem interface same as your example
export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  creator: string;
  categories: string[];
  guid: string;
  isoDate: string;
  imageUrl?: string | null;
  media?: any;
  enclosure?: {
    url?: string;
    length?: number | string;
    type?: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let allItemsRaw: string[] = [];

    // Fetch XML from each source
    for (const url of sources) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

        const xml = await response.text();

        // Extract all <item>...</item> blocks from the XML string
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null) {
          allItemsRaw.push(match[1]);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error fetching or parsing ${url}:`, error.message);
        } else {
          console.error(`Error fetching or parsing ${url}:`, error);
        }
        // Continue to next source even if one fails
      }
    }

    // Limit to 50 items max
    const slicedItemsRaw = allItemsRaw.slice(0, 50);

    // Map raw item XML strings to FeedItem objects
    const items: FeedItem[] = slicedItemsRaw.map((itemXml, index) => {
      // Helper function to extract single tag content (with CDATA support)
      function extractTag(tag: string): string {
        const regex = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
        const m = regex.exec(itemXml);
        return m ? m[1].trim() : '';
      }

      // Extract arrays for categories (multiple <category> tags)
      function extractCategories(): string[] {
        const regex = /<category>([\s\S]*?)<\/category>/gi;
        const cats: string[] = [];
        let m;
        while ((m = regex.exec(itemXml)) !== null) {
          cats.push(m[1].trim());
        }
        return cats;
      }

      // Extract enclosure info
      function extractEnclosure() {
        const regex = /<enclosure([^>]*)\/?>/i;
        const match = regex.exec(itemXml);
        if (!match) return undefined;
        const attrs = match[1];

        const urlMatch = /url=["']([^"']+)["']/.exec(attrs);
        const lengthMatch = /length=["']([^"']+)["']/.exec(attrs);
        const typeMatch = /type=["']([^"']+)["']/.exec(attrs);

        return {
          url: urlMatch ? urlMatch[1] : undefined,
          length: lengthMatch ? lengthMatch[1] : undefined,
          type: typeMatch ? typeMatch[1] : undefined,
        };
      }

      // Extract media content url (raw)
      function extractMediaContentUrl(): string | null {
        const regex = /<media:content[^>]*url=["']([^"']+)["'][^>]*>/i;
        const m = regex.exec(itemXml);
        return m ? m[1] : null;
      }

      // Extract media (raw tag, can be expanded if needed)
      function extractMedia() {
        // For now just return the whole <media:content> tag as string if present
        const regex = /(<media:content[\s\S]*?\/>)/i;
        const m = regex.exec(itemXml);
        return m ? m[1] : undefined;
      }

      // Extract content and contentSnippet (try content:encoded or description)
      function extractContent(): string {
        // content:encoded with CDATA
        let content = '';
        const contentEncodedRegex = /<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i;
        const mContent = contentEncodedRegex.exec(itemXml);
        if (mContent) {
          content = mContent[1].trim();
        } else {
          // fallback to <description>
          const descRegex = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i;
          const mDesc = descRegex.exec(itemXml);
          content = mDesc ? mDesc[1].trim() : '';
        }
        return content;
      }

      // contentSnippet: first 200 chars of content without tags
      function extractContentSnippet(content: string): string {
        const text = content.replace(/<[^>]*>/g, '').slice(0, 200);
        return text;
      }

      // Extract creator/author
      function extractCreator(): string {
        // Try <dc:creator> or <author>
        let creator = '';
        const dcCreatorRegex = /<dc:creator>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:creator>/i;
        const authorRegex = /<author>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/author>/i;

        const dcMatch = dcCreatorRegex.exec(itemXml);
        if (dcMatch) {
          creator = dcMatch[1].trim();
        } else {
          const authMatch = authorRegex.exec(itemXml);
          if (authMatch) creator = authMatch[1].trim();
        }
        return creator;
      }

      // Extract guid/id
      function extractGuid(): string {
        return extractTag('guid') || extractTag('id') || '';
      }

      // Extract isoDate (try <pubDate> as ISO string)
      function extractIsoDate(): string {
        const pubDate = extractTag('pubDate');
        return pubDate ? new Date(pubDate).toISOString() : '';
      }

      // Start extracting all needed fields
      const content = extractContent();
      const contentSnippet = extractContentSnippet(content);

      // Determine imageUrl: first media:content url, else enclosure if image type, else null
      let imageUrl: string | null = extractMediaContentUrl();

      if (!imageUrl) {
        const enclosure = extractEnclosure();
        if (enclosure && enclosure.type && enclosure.type.startsWith('image/')) {
          imageUrl = enclosure.url || null;
        }
      }

      return {
        title: extractTag('title'),
        link: extractTag('link'),
        pubDate: extractTag('pubDate'),
        content,
        contentSnippet,
        creator: extractCreator(),
        categories: extractCategories(),
        guid: extractGuid(),
        isoDate: extractIsoDate(),
        imageUrl,
        media: extractMedia(),
        enclosure: extractEnclosure(),
      };
    });
    //console.log(items);

    res.status(200).json({ items });
  } catch (error) {
    if (error instanceof Error) {
      console.error('RSS fetch error:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error('RSS fetch error:', error);
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
}
