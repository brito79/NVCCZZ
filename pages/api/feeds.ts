import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';


const parser = new Parser();

const sources = [
    // 'https://www.cnbcafrica.com/section/economy/',

    'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
    // 'https://feeds.bloomberg.com/economics/news.rss',
    // 'https://www.marketwatch.com/rss/marketpulse',
    // 'https://feeds.bloomberg.com/business/news.rss',
    // 'https://feeds.bloomberg.com/markets/news.rss',
    // 'http://feeds.harvardbusiness.org/harvardbusiness?format=xml',

   
    // 'https://bizmag.co.za/feed/',
    // 'https://www.africanews.com/feed/rss?themes=business',
    // 'https://thebftonline.com/feed/',
    // 'https://thebftonline.com/feed/',


    // 'https://dailynews.co.zw/feed/',
    // 'https://www.herald.co.zw/feed/',
    // 'https://fingaz.co.zw/feed/',


  ];

// Define the FeedItem interface
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
    let allItems = [];
    for(const url of sources) {
      try {
        // console.log(`Fetching from: ${url}`);
        const feed = await parser.parseURL(url);
        // console.log(`Successfully fetched ${feed.items.length} items from ${url}`);
        allItems.push(...feed.items);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        // Continue with other sources if one fails
      }
    }

    // console.log(`Total items fetched: ${allItems.length}`);

    const items: FeedItem[] = allItems.slice(0, 50).map((item, index) => {
      // Enhanced image extraction from various RSS fields
      let imageUrl: string | null = null;
      
      try {
        // Try different ways RSS feeds might include images
        if (item.imageUrl) {
          imageUrl = item.imageUrl;
        } else if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
          imageUrl = item.enclosure.url;
        } else if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
          imageUrl = item['media:content']['$'].url;
        } else if (item['media:thumbnail'] && item['media:thumbnail']['$'] && item['media:thumbnail']['$'].url) {
          imageUrl = item['media:thumbnail']['$'].url;
        } else if (item.content && typeof item.content === 'string') {
          // Extract image from content using regex
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch) {
            imageUrl = imgMatch[1];
          }
        } else if (item.contentSnippet && typeof item.contentSnippet === 'string') {
          // Extract image from contentSnippet
          const imgMatch = item.contentSnippet.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch) {
            imageUrl = imgMatch[1];
          }
        }

        // Log first few items for debugging
        // if (index < 3) {
        //   console.log(`Item ${index}:`, {
        //     title: item.title,
        //     hasImage: !!imageUrl,
        //     imageUrl: imageUrl,
        //     hasEnclosure: !!item.enclosure,
        //     hasMedia: !!item.media
        //   });
        // }
      } catch (error) {
        console.error(`Error processing item ${index}:`, error);
      }

      return {
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        content: item.content || '',
        contentSnippet: item.contentSnippet || '',
        creator: item.creator || item.author || '',
        categories: item.categories || [],
        guid: item.guid || item.id || '',
        isoDate: item.isoDate || '',
        imageUrl: imageUrl,
        media: item.media,
        enclosure: item.enclosure ? {
          url: item.enclosure.url,
          length: item.enclosure.length,
          type: item.enclosure.type
        } : undefined,
      };
    });
    //console.log(items);

    res.status(200).json({ items });
  } catch (error) {
    console.error('RSS fetch error:', error);
    res.status(500).json({ error: 'Failed to load feed' });
  }
}

  

    