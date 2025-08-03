'use client'

import { CalendarDays, Clock, MapPin, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect, useRef } from 'react';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Newsletter {
  id: string;
  title: string;
  description: string;
  authorId: string;
  author: Author;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewsletterData {
  success: boolean;
  data: Newsletter[];
}

const NewsletterCarousel = () => {
  const [newsletters, setNewsletters] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('https://nvccz-pi.vercel.app/api/newsletters', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch newsletters: ${response.status}`);
        }

        const data: NewsletterData = await response.json();
        setNewsletters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  // Safe date parsing utility
  const parseDateSafe = (dateString: string): Date => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const nextSlide = () => {
    if (!newsletters) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === newsletters.data.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (!newsletters) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsletters.data.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 text-red-300 rounded-lg max-w-2xl mx-auto">
        Error: {error}
      </div>
    );
  }

  if (!newsletters || !newsletters.success || newsletters.data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400 max-w-2xl mx-auto">
        No newsletters available
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      {/* Carousel container */}
      <div 
        ref={carouselRef}
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {newsletters.data.map((newsletter, index) => (
          <div 
            key={newsletter.id} 
            className="w-full flex-shrink-0 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden shadow-lg"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(55, 65, 81, 0.4)'
              }}
            >
              {/* Header with title and author */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{newsletter.title}</h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-900/50 text-blue-300">
                    {newsletter.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-gray-300 text-sm">
                    <User className="w-4 h-4 mr-1" />
                    {newsletter.author.firstName} {newsletter.author.lastName}
                  </div>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-gray-400 text-sm">
                    {formatDistanceToNow(parseDateSafe(newsletter.createdAt))} ago
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-4">{newsletter.description}</p>
                
                {/* Event details */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="text-white">
                        {format(parseDateSafe(newsletter.startDate), 'MMMM do, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Time</p>
                      <p className="text-white">
                        {format(parseDateSafe(newsletter.startDate), 'h:mm a')} - {' '}
                        {format(parseDateSafe(newsletter.endDate), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-white">{newsletter.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with actions */}
              <div className="px-6 py-4 border-t border-gray-700 flex justify-between">
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Like
                </button>
                
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white p-2 rounded-full shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700/90 text-white p-2 rounded-full shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {newsletters.data.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-500'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default NewsletterCarousel;