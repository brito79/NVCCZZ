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
  