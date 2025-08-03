import { CalendarDays, Clock, MapPin, User, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

// Add this utility function
const parseDateSafe = (dateString: string): Date => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
};

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

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newNewsletter, setNewNewsletter] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: ''
  });

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

  

  {formatDistanceToNow(parseDateSafe(newNewsletter.startDate))}

  // For startDate display:
  {format(parseDateSafe(newNewsletter.startDate), 'MMMM do, yyyy')}

  // For time range display:
  {format(parseDateSafe(newNewsletter.startDate), 'h:mm a')} 
  {format(parseDateSafe(newNewsletter.endDate), 'h:mm a')}

  const handleCreateNewsletter = async () => {
    if (!newNewsletter.title.trim() || !newNewsletter.description.trim() || 
        !newNewsletter.location.trim() || !newNewsletter.startDate || !newNewsletter.endDate) {
      setError('All fields are required');
      return;
    }
    const startDate = parseDateSafe(newNewsletter.startDate);
    const endDate = parseDateSafe(newNewsletter.endDate);
    
    if (startDate > endDate) {
      setError('End date must be after start date');
      return;
    }

    setIsCreating(true);
    try {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('userID');
      
      if (!token || !userId) {
        throw new Error('Authentication token or user ID not found');
      }

      // First, fetch user data to get author information
      const userResponse = await fetch(`https://nvccz-pi.vercel.app/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      if (!userData.success) {
        throw new Error('Failed to fetch user data');
      }

      const newsletterData = {
        title: newNewsletter.title,
        description: newNewsletter.description,
        location: newNewsletter.location,
        startDate: newNewsletter.startDate,
        endDate: newNewsletter.endDate,
        authorId: userData.data.id
      };

      const response = await fetch('https://nvccz-pi.vercel.app/api/newsletters', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newsletterData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create newsletter: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success && responseData.data) {
        // Add the new newsletter to our existing newsletters
        setNewsletters(prev => {
          if (!prev) return null;
          return {
            ...prev,
            data: [responseData.data, ...prev.data]
          };
        });

        // Reset form and close modal
        setNewNewsletter({
          title: '',
          description: '',
          location: '',
          startDate: '',
          endDate: ''
        });
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create newsletter');
      console.error('Error creating newsletter:', err);
    } finally {
      setIsCreating(false);
    }
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
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Newsletter
          </button>
        </div>
        <div className="p-6 text-center text-gray-400">
          No newsletters available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Create Newsletter Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Newsletter
        </button>
      </div>

      {/* Create Newsletter Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl"
            style={{
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.4)'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Create New Newsletter</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newNewsletter.title}
                  onChange={(e) => setNewNewsletter({...newNewsletter, title: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Newsletter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newNewsletter.description}
                  onChange={(e) => setNewNewsletter({...newNewsletter, description: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows={5}
                  placeholder="Write your newsletter description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newNewsletter.location}
                  onChange={(e) => setNewNewsletter({...newNewsletter, location: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Event location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newNewsletter.startDate}
                    onChange={(e) => setNewNewsletter({...newNewsletter, startDate: e.target.value})}
                    className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newNewsletter.endDate}
                    onChange={(e) => setNewNewsletter({...newNewsletter, endDate: e.target.value})}
                    className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2 bg-red-900/20 text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewsletter}
                  className="px-4 py-2 text-sm text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition flex items-center"
                  disabled={isCreating || 
                    !newNewsletter.title.trim() || 
                    !newNewsletter.description.trim() || 
                    !newNewsletter.location.trim() || 
                    !newNewsletter.startDate || 
                    !newNewsletter.endDate}
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Newsletter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter List */}
      {newsletters.data.map((newsletter, index) => (
        <motion.div
          key={newsletter.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
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
                {formatDistanceToNow(new Date(newsletter.createdAt))} ago
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
                    {format(new Date(newsletter.startDate), 'MMMM do, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="text-white">
                    {format(new Date(newsletter.startDate), 'h:mm a')} - {' '}
                    {format(new Date(newsletter.endDate), 'h:mm a')}
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
      ))}
    </div>
  );
}

export default Newsletter;