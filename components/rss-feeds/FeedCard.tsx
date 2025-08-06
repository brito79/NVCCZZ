import { FeedItem } from "@/types.db";
import { Newspaper, TrendingUp } from "lucide-react";
import { categorizeByRegion } from "@/utils/feedUtils";

export const FeedCard = ({ feed }: { feed: FeedItem }) => {
    const region = categorizeByRegion(feed);
    const regionDisplay = region === 'zimbabwean' ? 'Zimbabwe' : 
                         region === 'african' ? 'Africa' : 'International';
    
    const hasImage = feed.imageUrl || (feed.enclosure && feed.enclosure.url && feed.enclosure.type?.startsWith('image/'));
    const imageUrl = feed.imageUrl || (feed.enclosure && feed.enclosure.url);
    
    if (hasImage && imageUrl) {
      // Card with image - keep original design
      return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden hover:bg-gray-800/70 transition-all duration-300">
          <div className="h-48 bg-gray-700 relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={feed.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-80 hidden"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
                <Newspaper className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                {regionDisplay}
              </span>
              <span className="text-xs text-gray-400">{feed.pubDate}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {feed.title}
            </h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-3">
              {feed.contentSnippet}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">{feed.creator}</span>
              <a 
                href={feed.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
              >
                Read More →
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    // Card without image - enhanced design
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-600/50 overflow-hidden hover:bg-gray-800/80 hover:border-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-xl">
        {/* Decorative header with region-specific gradient */}
        <div className={`h-2 ${
          region === 'zimbabwean' ? 'bg-gradient-to-r from-green-500 via-yellow-500 to-red-500' :
          region === 'african' ? 'bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500' :
          'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500'
        }`}></div>
        
        <div className="p-6">
          {/* Header with category and date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                region === 'zimbabwean' ? 'bg-green-400' :
                region === 'african' ? 'bg-orange-400' :
                'bg-blue-400'
              }`}></div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                region === 'zimbabwean' ? 'text-green-300 bg-green-900/30' :
                region === 'african' ? 'text-orange-300 bg-orange-900/30' :
                'text-blue-300 bg-blue-900/30'
              }`}>
                {regionDisplay}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{feed.pubDate}</span>
          </div>
          
          {/* Title with larger, more prominent styling */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
            {feed.title}
          </h3>
          
          {/* Content snippet with better spacing */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-4 leading-relaxed">
            {feed.contentSnippet}
          </p>
          
          {/* Footer with enhanced styling */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                <Newspaper className="w-3 h-3 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400 font-medium">{feed.creator || 'Unknown'}</span>
            </div>
            <a 
              href={feed.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                region === 'zimbabwean' ? 'text-green-300 bg-green-900/20 hover:bg-green-900/40' :
                region === 'african' ? 'text-orange-300 bg-orange-900/20 hover:bg-orange-900/40' :
                'text-blue-300 bg-blue-900/20 hover:bg-blue-900/40'
              }`}
            >
              <span>Read More</span>
              <TrendingUp className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  };