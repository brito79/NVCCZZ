import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Newspaper, BarChart3, Globe, Filter, RefreshCw, MapPin, Building2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import useSWR from 'swr';
import { FeedItem, ForexData, BankRatesResponse } from '@/types.db';
import { ZW } from 'country-flag-icons/react/3x2';
import { BankRatesCard } from '@/components/rss-feeds/BankRatesCard';
import { FeedCard } from '@/components/rss-feeds/FeedCard';
import { categories, isFinancialOrEconomic, categorizeByRegion } from '@/utils/feedUtils';
import ZimFinancialData from '@/components/MenuAllFinancialData';
import FloatingRBZData from '@/components/rss-feeds/FloatingRBZData';
import WeatherCard from '@/components/rss-feeds/sidebar/WeatherCard';

// Combined Rate Card Component
const CombinedRateCard = ({ cryptoData, forexData, cryptoLoading, forexLoading }: {
  cryptoData: any[];
  forexData: any[];
  cryptoLoading: boolean;
  forexLoading: boolean;
}) => {
  const [currentView, setCurrentView] = useState<'crypto' | 'forex'>('crypto');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const switchView = (newView: 'crypto' | 'forex') => {
    if (newView !== currentView && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentView(newView);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const nextView = () => {
    switchView(currentView === 'crypto' ? 'forex' : 'crypto');
  };

  const prevView = () => {
    switchView(currentView === 'crypto' ? 'forex' : 'crypto');
  };

  const getCurrentData = () => {
    return currentView === 'crypto' ? cryptoData : forexData;
  };

  const getCurrentTitle = () => {
    return currentView === 'crypto' ? 'Cryptocurrency' : 'Forex Rates';
  };

  const isCurrentlyLoading = () => {
    return currentView === 'crypto' ? cryptoLoading : forexLoading;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-3 mb-4 relative group hover:border-gray-600 transition-all duration-300">
      {/* Navigation Arrows */}
      <button
        onClick={prevView}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-gray-700/70 hover:bg-blue-600 transition-all duration-300 text-gray-300 hover:text-white shadow-lg hover:shadow-xl hover:scale-110 opacity-70 group-hover:opacity-100"
        aria-label="Previous view"
        disabled={isTransitioning}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <button
        onClick={nextView}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-gray-700/70 hover:bg-blue-600 transition-all duration-300 text-gray-300 hover:text-white shadow-lg hover:shadow-xl hover:scale-110 opacity-70 group-hover:opacity-100"
        aria-label="Next view"
        disabled={isTransitioning}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="text-center px-12">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center justify-center">
          <DollarSign className="w-4 h-4 mr-1.5 text-blue-400 flex-shrink-0" />
          <span className={`truncate text-sm transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {getCurrentTitle()}
          </span>
          {isCurrentlyLoading() && (
            <div className="ml-2 animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-400 flex-shrink-0"></div>
          )}
        </h3>

        {/* View Indicator Dots */}
        <div className="flex justify-center mb-3 space-x-2">
          <button
            onClick={() => switchView('crypto')}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              currentView === 'crypto' 
                ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label="View cryptocurrency"
          />
          <button
            onClick={() => switchView('forex')}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
              currentView === 'forex' 
                ? 'bg-blue-400 shadow-lg shadow-blue-400/50' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label="View forex rates"
          />
        </div>
      </div>

      {/* Data Display with Smooth Transitions */}
      <div className={`space-y-1.5 transition-all duration-300 ${isTransitioning ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}`}>
        {getCurrentData().map((item, index) => (
          <div 
            key={`${currentView}-${index}`} 
            className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-b-0 min-h-[36px] gap-2 rounded-md hover:bg-gray-700/30 transition-colors duration-200 px-2"
          >
            <div className="flex-shrink-0 min-w-0 flex-1">
              <span className="font-medium text-gray-300 text-xs block truncate">
                {currentView === 'crypto' ? item.symbol : item.pair}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <div className="text-right min-w-0">
                <span className="font-bold text-xs text-white block truncate">
                  {currentView === 'crypto' ? item.price : item.rate}
                </span>
              </div>
              <div className={`flex items-center text-xs min-w-0 px-1.5 py-0.5 rounded-full transition-colors duration-200 ${
                item.trend === 'up' ? 'text-green-400 bg-green-400/10' : 
                item.trend === 'down' ? 'text-red-400 bg-red-400/10' : 'text-gray-400'
              }`}>
                {item.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5 flex-shrink-0" /> :
                 item.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-0.5 flex-shrink-0" /> : null}
                <span className="truncate text-xs font-medium">{item.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Loading Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-gray-800/20 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      )}
    </div>
  );
};

const fetcher = async (url: string) => await fetch(url).then(res => res.json());

const FeedPage = () => {
    const [mounted, setMounted] = useState(false);
    const { data, error, isLoading: feedsLoading } = useSWR<{ items: FeedItem[] }>(mounted ? '/api/feeds' : null, fetcher);
    const { data: cryptoData, error: cryptoError, isLoading: cryptoLoading } = useSWR(mounted ? '/api/crypto' : null, fetcher);
    const { data: forexData, error: forexError, isLoading: forexLoading } = useSWR(mounted ? '/api/forex' : null, fetcher);
    const { data: bankRatesData, error: bankRatesError, isLoading: bankRatesLoading } = useSWR<BankRatesResponse>(mounted ? '/api/bankRates' : null, fetcher);
    
    const [selectedCategory, setSelectedCategory] = useState('zimbabwean');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

  const feedsData = data?.items || [];

  const filteredFeeds = feedsData.filter(feed => {
    // First filter: only financial/economic news
    if (!isFinancialOrEconomic(feed)) {
      return false;
    }
    
    // Second filter: category matching (no 'all' category anymore)
    const feedCategory = categorizeByRegion(feed);
    if (feedCategory !== selectedCategory) {
      return false;
    }
    
    // Third filter: search term matching
    if (!searchTerm) return true;

    const matchesSearch = feed.title.toLowerCase().includes(searchTerm.toLowerCase()) || feed.contentSnippet?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const refreshFeeds = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Get dynamic rates with fallbacks
  const getRatesData = () => {
    // Handle forex data from API
    let forexRates = [
      { pair: 'USD/ZWL', rate: '24,500', change: '+0.8%', trend: 'up' },
      { pair: 'USD/GBP', rate: '1.2680', change: '-0.3%', trend: 'down' },
      { pair: 'USD/EUR', rate: '1.0925', change: '+0.1%', trend: 'up' }
    ];

    if (forexData && forexData.success && forexData.data) {
      forexRates = forexData.data;
    } else if (forexData && Array.isArray(forexData)) {
      forexRates = forexData;
    }

    return {
      crypto: cryptoData || [
        { symbol: 'BTC', price: '$43,250', change: '+2.4%', trend: 'up' },
        { symbol: 'ETH', price: '$2,580', change: '-1.2%', trend: 'down' },
        { symbol: 'BNB', price: '$315', change: '+0.8%', trend: 'up' },
        { symbol: 'ADA', price: '$0.52', change: '+3.1%', trend: 'up' }
      ],
      forex: forexRates
    };
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (feedsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 text-red-300 rounded-lg max-w-2xl mx-auto">
        Error loading feeds: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 mb-4">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">NVCCZ Financial Feeds</h1>
            </div>
            <button 
              onClick={refreshFeeds}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mb-2"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* RBZ Exchange Rates Banner */}
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 py-2 mb-4">
        <FloatingRBZData />
      </div>
      
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 mb-2">
        <ZimFinancialData />
      </div>

      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* Sidebar - Rates */}
          <div className="lg:col-span-1 space-y-2 max-w-xs">
            {/* <BankRatesCard data={bankRatesData} isLoading={bankRatesLoading} /> */}
            <CombinedRateCard 
              cryptoData={getRatesData().crypto}
              forexData={getRatesData().forex}
              cryptoLoading={cryptoLoading}
              forexLoading={forexLoading}
            />
            <WeatherCard/>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Search and Filters */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-3 mb-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search financial news..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Filter:</span>
                </div>
              </div>
              
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(category => {
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {category.id === 'zimbabwean' ? (
                        <ZW className="w-4 h-4" />
                      ) : category.id === 'african' ? (
                        <MapPin className="w-4 h-4" />
                      ) : (
                        <Globe className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feed Results */}
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-white">
                Latest News ({filteredFeeds.length} articles)
              </h2>
            </div>

            {/* Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredFeeds.map((feed, index) => (
                <FeedCard key={feed.guid || index} feed={feed} />
              ))}
            </div>

            {filteredFeeds.length === 0 && !feedsLoading && (
              <div className="text-center py-6">
                <Newspaper className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No articles found</h3>
                <p className="text-gray-400">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
