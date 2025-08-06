'use client'

import { MessageSquare, Heart, Share2, User, Clock, Bell, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
interface CreatePostData {
  title: string;
  content: string;
  expiresAt?: string;
}
interface Reply {
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

interface Post {
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

interface PostsData {
  success: boolean;
  data: Post[];
}
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    name: string;
    value: boolean;
  }[];
}

interface UserResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: Role;
  };
}


const Posts = () => {
  const [posts, setPosts] = useState<PostsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('https://nvccz-pi.vercel.app/api/posts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data: PostsData = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        setUserLoading(true);
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userID');
        
        if (!token) {
          setAuthError('Authentication token not found');
          return;
        }
        
        if (!userId) {
          setAuthError('User ID not found in session');
          return;
        }

        const response = await fetch(`https://nvccz-pi.vercel.app/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data: UserResponse = await response.json();
        
        if (data.success && data.data.role?.name === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setAuthError(err instanceof Error ? err.message : 'Failed to verify user permissions');
      } finally {
        setUserLoading(false);
      }
    };

    fetchPosts();
    fetchUserRole();
  }, []);

  const handleReplySubmit = async (postId: string) => {
    if (!replyContent.trim()) return;
    
    setIsSubmitting(true);
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
  
      const author = {
        id: userData.data.id,
        firstName: userData.data.firstName,
        lastName: userData.data.lastName,
        email: userData.data.email
      };
  
      // Create the new reply object
      const newReply = {
        id: `temp-${Date.now()}`, // Temporary ID for local state
        content: replyContent,
        authorId: author.id,
        author,
        postId,
        parentReplyId: null,
        parentReply: null,
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
  
      // Find the current post
      const currentPost = posts?.data.find(post => post.id === postId);
      if (!currentPost) {
        throw new Error('Post not found');
      }
  
      // Create the updated post with the new reply added to replies array
      const updatedPost = {
        ...currentPost,
        replies: [...currentPost.replies, newReply]
      };
  
      // Send the PUT request with the full updated post
      const response = await fetch(`https://nvccz-pi.vercel.app/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
      });

      console.log(response)
  
      if (!response.ok) {
        throw new Error(`Failed to add reply: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      // Update the local state with the response data (which should include the server-generated ID)
      if (posts && responseData.success) {
        setPosts(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            data: prev.data.map(post => {
              if (post.id === postId) {
                return responseData.data; // Use the full post data returned from server
              }
              return post;
            })
          };
        });
      }
  
      // Reset the reply form
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<CreatePostData>({
    title: '',
    content: '',
    expiresAt: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Add this function to your component
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsCreating(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('https://nvccz-pi.vercel.app/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          expiresAt: newPost.expiresAt || null
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.success && responseData.data) {
        // Add the new post to our existing posts
        setPosts(prev => {
          if (!prev) return null;
          return {
            ...prev,
            data: [responseData.data, ...prev.data]
          };
        });

        // Reset form and close modal
        setNewPost({
          title: '',
          content: '',
          expiresAt: ''
        });
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err);
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

  if (!posts || !posts.success || posts.data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400 max-w-2xl mx-auto">
         <div className="flex justify-end">
        {authError ? (
          <div className="text-red-400 text-sm">{authError}</div>
        ) : (
          !userLoading && isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </button>
          )
        )}
      </div>
            {/* Create Post Modal */}
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
              <h2 className="text-xl font-bold text-white">Create New Post</h2>
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
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows={5}
                  placeholder="Write your post content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expiration Date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={newPost.expiresAt}
                  onChange={(e) => setNewPost({...newPost, expiresAt: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
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
                  onClick={handleCreatePost}
                  className="px-4 py-2 text-sm text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition flex items-center"
                  disabled={isCreating || !newPost.title.trim() || !newPost.content.trim()}
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        No posts available
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Create Post Button */}
      <div className="flex justify-end">
        {authError ? (
          <div className="text-red-400 text-sm">{authError}</div>
        ) : (
          !userLoading && isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </button>
          )
        )}
      </div>

      {/* Create Post Modal */}
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
              <h2 className="text-xl font-bold text-white">Create New Post</h2>
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
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows={5}
                  placeholder="Write your post content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expiration Date (optional)
                </label>
                <input
                  type="datetime-local"
                  value={newPost.expiresAt}
                  onChange={(e) => setNewPost({...newPost, expiresAt: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
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
                  onClick={handleCreatePost}
                  className="px-4 py-2 text-sm text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition flex items-center"
                  disabled={isCreating || !newPost.title.trim() || !newPost.content.trim()}
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Create Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {posts.data.map((post, index) => (
        <motion.div
          key={post.id}
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
              <h2 className="text-xl font-bold text-white">{post.title}</h2>
              <div className="flex items-center space-x-2">
                {post.isNotified && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-900/50 text-blue-300 flex items-center">
                    <Bell className="w-3 h-3 mr-1" />
                    Notified
                  </span>
                )}
                <span className="text-xs px-2 py-1 rounded-full bg-blue-900/50 text-blue-300">
                  {post.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center mt-2">
              <div className="flex items-center text-gray-300 text-sm">
                <User className="w-4 h-4 mr-1" />
                {post.author.firstName} {post.author.lastName}
              </div>
              <span className="mx-2 text-gray-500">•</span>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-300 mb-4 whitespace-pre-line">{post.content}</p>
            
            {/* Expiration */}
            {post.expiresAt && (
              <div className="mt-4 text-sm text-gray-400">
                Expires: {format(new Date(post.expiresAt), 'MMMM do, yyyy')}
              </div>
            )}
          </div>

          {/* Replies preview */}
          {post.replies.length > 0 && (
            <div className="px-6 pb-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-2">
                {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
              </div>
              <div className="space-y-3">
                {post.replies.slice(0, 2).map((reply) => (
                  <div key={reply.id} className="p-3 rounded-lg bg-gray-800/50">
                    <div className="flex items-center text-sm text-gray-300 mb-1">
                      <User className="w-3 h-3 mr-1" />
                      {reply.author.firstName} {reply.author.lastName}
                    </div>
                    <p className="text-gray-300 text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply form */}
          {replyingTo === post.id && (
            <div className="px-6 pb-4 border-t border-gray-700">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-3 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 focus:border-blue-500 focus:outline-none"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReplySubmit(post.id)}
                  className="px-4 py-2 text-sm text-white rounded-lg bg-blue-600 hover:bg-blue-500 transition flex items-center"
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    'Post Reply'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Footer with actions */}
          <div className="px-6 py-4 border-t border-gray-700 flex justify-between">
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              Like
            </button>
            <button 
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
              onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Reply ({post.replies.length})
            </button>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Posts;