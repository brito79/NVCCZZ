'use client'

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Newspaper, BarChart3, Globe, Filter, RefreshCw, MapPin, Building2, Calendar } from 'lucide-react';
import useSWR from 'swr';
import { FeedItem, ForexData, BankRatesResponse } from '@/types.db';
import { ZW } from 'country-flag-icons/react/3x2';
import { RateCard } from '@/components/rss-feeds/RateCard';
import { BankRatesCard } from '@/components/rss-feeds/BankRatesCard';
import { FeedCard } from '@/components/rss-feeds/FeedCard';
import { categories, isFinancialOrEconomic, categorizeByRegion } from '@/utils/feedUtils';
import ZimFinancialData from '@/components/ZimFinancialData';
import FloatingRBZData from '@/components/rss-feeds/FloatingRBZData';

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
      <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <h1 className="ml-3 text-xl font-bold text-white">NVCCZ Financial Feeds</h1>
            </div>
            <button 
              onClick={refreshFeeds}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          <FloatingRBZData />
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ZimFinancialData />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Rates */}
          <div className="lg:col-span-1 space-y-6">
            <BankRatesCard data={bankRatesData} isLoading={bankRatesLoading} />
            <RateCard title="Cryptocurrency" data={getRatesData().crypto} type="crypto" isLoading={cryptoLoading} />
            <RateCard title="Forex Rates" data={getRatesData().forex} type="forex" isLoading={forexLoading} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
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
              <div className="flex flex-wrap gap-2 mt-4">
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
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Latest News ({filteredFeeds.length} articles)
              </h2>
            </div>

            {/* Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFeeds.map((feed, index) => (
                <FeedCard key={feed.guid || index} feed={feed} />
              ))}
            </div>

            {filteredFeeds.length === 0 && !feedsLoading && (
              <div className="text-center py-12">
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
