export interface Author {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  
  export interface NewsletterItem {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    authorId: string;
    author: Author;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface NewsletterData {
    success: boolean;
    data: NewsletterItem[];
  }
  
  export interface NewsletterProps {
    newsletters: NewsletterData;
  }

  export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    authorId: string;
    author: Author;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  export interface EventsData {
    success: boolean;
    data: Event[];
  }

  export interface Reply {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    author: Author;
    parentReplyId: string | null;
    parentReply: string | null;
    replies: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    author: Author;
    expiresAt: string;
    isNotified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    replies: Reply[];
  }

  export interface PostsData {
    success: boolean;
    data: Post[];
  }

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

export interface ForexData {
  pair: string;
  rate: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}


export type ExchangeRate = {
  currency: string;     // e.g. "Zimbabwe Gold"
  mid_rate: number;     // e.g. 26.7605
  pair: string;         // e.g. "1USD-ZiG"
  we_buy: number;       // e.g. 25.9577
  we_sell: number;      // e.g. 28.6337
};

export type BankRatesResponse = {
 date: string;              // formatted date, e.g. "08 Aug 2025"
  date_iso: string;          // ISO date, e.g. "2025-08-08"
  exchange_rates: ExchangeRate[];
};
  