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
  ask: number;
  avg: number;
  bid: number;
  currency: string;
};

export type BankRatesResponse = {
  date: string;
  exchange_rates: ExchangeRate[];
  source: string;
  status: string;
  timestamp: string;
};
  