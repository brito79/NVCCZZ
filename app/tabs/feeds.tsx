import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Newspaper, BarChart3, Globe, Filter, RefreshCw } from 'lucide-react';

const FeedPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample data - in real app, this would come from your API
  const [rates] = useState({
    banks: [
      { name: 'CBZ Bank', rate: '12.5%', change: '+0.2%', trend: 'up' },
      { name: 'Steward Bank', rate: '11.8%', change: '-0.1%', trend: 'down' },
      { name: 'CABS', rate: '13.2%', change: '+0.5%', trend: 'up' },
      { name: 'FBC Bank', rate: '12.0%', change: '0.0%', trend: 'neutral' }
    ],
    crypto: [
      { symbol: 'BTC', price: '$43,250', change: '+2.4%', trend: 'up' },
      { symbol: 'ETH', price: '$2,580', change: '-1.2%', trend: 'down' },
      { symbol: 'BNB', price: '$315', change: '+0.8%', trend: 'up' },
      { symbol: 'ADA', price: '$0.52', change: '+3.1%', trend: 'up' }
    ],
    forex: [
      { pair: 'USD/ZWL', rate: '24,500', change: '+0.8%', trend: 'up' },
      { pair: 'GBP/USD', rate: '1.2680', change: '-0.3%', trend: 'down' },
      { pair: 'EUR/USD', rate: '1.0925', change: '+0.1%', trend: 'up' }
    ]
  });

  const [feeds] = useState([
    {
      id: 1,
      title: "Zimbabwe's Economic Growth Projected at 3.5% for 2025",
      summary: "The Reserve Bank of Zimbabwe announces positive economic outlook with projected growth driven by mining and agriculture sectors.",
      source: "Herald",
      category: "economic",
      time: "2 hours ago",
      image: "/api/placeholder/300/200",
      url: "#"
    },
    {
      id: 2,
      title: "Cryptocurrency Adoption Rises in African Markets",
      summary: "New report shows 40% increase in digital currency usage across Zimbabwe and neighboring countries for cross-border payments.",
      source: "Bloomberg",
      category: "technology",
      time: "4 hours ago",
      image: "/api/placeholder/300/200",
      url: "#"
    },
    {
      id: 3,
      title: "Banking Sector Reports Record Profits Despite Challenges",
      summary: "Major banks in Zimbabwe show resilience with improved lending rates and digital banking adoption driving growth.",
      source: "Yahoo Finance",
      category: "financial",
      time: "6 hours ago",
      image: "/api/placeholder/300/200",
      url: "#"
    },
    {
      id: 4,
      title: "Gold Prices Surge to New Heights Amid Global Uncertainty",
      summary: "Precious metals market sees significant gains as investors seek safe-haven assets, benefiting Zimbabwe's mining sector.",
      source: "Herald",
      category: "financial",
      time: "8 hours ago",
      image: "/api/placeholder/300/200",
      url: "#"
    },
    {
      id: 5,
      title: "Fintech Revolution Transforms Payment Systems",
      summary: "Mobile money platforms and digital wallets gain traction, revolutionizing how Zimbabweans conduct financial transactions.",
      source: "Bloomberg",
      category: "technology",
      time: "10 hours ago",
      image: "/api/placeholder/300/200",
      url: "#"
    },
    {
      id: 6,
      title: "Inflation Rates Show Positive Trajectory",
      summary: "Latest economic indicators suggest stabilizing inflation with improved monetary policy effectiveness.",
      source: "Yahoo Finance",
      category: "economic",
      time: "12 hours ago",
      image: "/api/placeholder/300/200",
      url: "#"
    }
  ]);

  const categories = [
    { id: 'all', name: 'All News', icon: Globe },
    { id: 'financial', name: 'Financial', icon: DollarSign },
    { id: 'economic', name: 'Economic', icon: BarChart3 },
    { id: 'technology', name: 'Technology', icon: TrendingUp }
  ];

  const filteredFeeds = feeds.filter(feed => {
    const matchesCategory = selectedCategory === 'all' || feed.category === selectedCategory;
    const matchesSearch = feed.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feed.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const refreshFeeds = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const RateCard = ({ title, data, type } : { title: string; data: any[]; type: string; }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
        {title}
      </h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
            <span className="font-medium text-gray-300">
              {type === 'crypto' ? item.symbol : type === 'forex' ? item.pair : item.name}
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">
                {type === 'crypto' ? item.price : type === 'forex' ? item.rate : item.rate}
              </span>
              <span className={`flex items-center text-sm ${
                item.trend === 'up' ? 'text-green-400' : 
                item.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {item.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> :
                 item.trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FeedCard = ({ feed } : { feed: any }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden hover:bg-gray-800/70 transition-all duration-300">
      <div className="h-48 bg-gray-700 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-80"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-2">
            <Newspaper className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
            {feed.category.charAt(0).toUpperCase() + feed.category.slice(1)}
          </span>
          <span className="text-xs text-gray-400">{feed.time}</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {feed.title}
        </h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
          {feed.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">{feed.source}</span>
          <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
            Read More →
          </button>
        </div>
      </div>
    </div>
  );

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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Rates */}
          <div className="lg:col-span-1 space-y-6">
            <RateCard title="Bank Rates" data={rates.banks} type="bank" />
            <RateCard title="Cryptocurrency" data={rates.crypto} type="crypto" />
            <RateCard title="Forex Rates" data={rates.forex} type="forex" />
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
                  const Icon = category.icon;
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
                      <Icon className="w-4 h-4" />
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
              {filteredFeeds.map(feed => (
                <FeedCard key={feed.id} feed={feed} />
              ))}
            </div>

            {filteredFeeds.length === 0 && (
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
};

export default FeedPage;