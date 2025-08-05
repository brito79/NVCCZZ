'use client'

import React, { useState, useRef, useCallback } from 'react';
import { TrendingUp, Building2, Globe, BarChart3, ChevronDown, X, ArrowUp, ArrowDown, Activity, DollarSign, Briefcase } from 'lucide-react';
import ZSETopGainers from './rss-feeds/zse/ZSETopGainers';
import ZSETopLosers from './rss-feeds/zse/ZSETopLosers';
import ZSEMarketIndices from './rss-feeds/zse/ZSEMarketIndices';
import ZSEMarketActivity from './rss-feeds/zse/ZSEMarketActivity';

interface TopGainer {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
}

interface TopGainersResponse {
  status: string;
  timestamp: string;
  source: string;
  url: string;
  top_gainers: TopGainer[];
  count: number;
}

const ZimFinancialData = () => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((sectionId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredSection(sectionId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSection(null);
    }, 150);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleDropdownLeave = useCallback(() => {
    setHoveredSection(null);
  }, []);

  // Mock data for ZSE modals
  const mockTopGainersData: TopGainersResponse = {
    status: "success",
    timestamp: "2025-08-05T10:30:00Z",
    source: "Zimbabwe Stock Exchange",
    url: "https://www.zse.co.zw",
    top_gainers: [
      { symbol: "DELTA", name: "Delta Corporation Limited", price: 245.50, change: 12.30, change_percent: 5.28, volume: 150000 },
      { symbol: "ECONET", name: "Econet Wireless Zimbabwe", price: 89.75, change: 4.25, change_percent: 4.97, volume: 250000 },
      { symbol: "INNSCOR", name: "Innscor Africa Limited", price: 67.80, change: 2.90, change_percent: 4.47, volume: 180000 },
      { symbol: "SEEDCO", name: "Seed Co Limited", price: 145.20, change: 5.80, change_percent: 4.16, volume: 120000 },
      { symbol: "BARCLAYS", name: "Barclays Bank of Zimbabwe", price: 23.45, change: 0.85, change_percent: 3.76, volume: 300000 }
    ],
    count: 5
  };

  const mockTopLosersData: TopGainersResponse = {
    status: "success",
    timestamp: "2025-08-05T10:30:00Z",
    source: "Zimbabwe Stock Exchange",
    url: "https://www.zse.co.zw",
    top_gainers: [
      { symbol: "ZIMRE", name: "Zimre Holdings Limited", price: 8.50, change: -0.75, change_percent: -8.11, volume: 90000 },
      { symbol: "CAFCA", name: "Cafca Limited", price: 15.20, change: -1.20, change_percent: -7.32, volume: 75000 },
      { symbol: "ZIMPLOW", name: "Zimplow Holdings", price: 12.80, change: -0.80, change_percent: -5.88, volume: 60000 },
      { symbol: "TURNALL", name: "Turnall Holdings", price: 4.50, change: -0.25, change_percent: -5.26, volume: 45000 },
      { symbol: "NICOZ", name: "Nicoz Diamond Insurance", price: 18.90, change: -0.90, change_percent: -4.55, volume: 85000 }
    ],
    count: 5
  };

  const zseMenuItems = [
    { id: 'top-gainers', title: 'ZSE Top Gainers', icon: ArrowUp, color: 'text-green-400' },
    { id: 'top-losers', title: 'ZSE Top Losers', icon: ArrowDown, color: 'text-red-400' },
    { id: 'market-indices', title: 'ZSE Market Indices', icon: BarChart3, color: 'text-blue-400' },
    { id: 'etfs', title: 'ZSE ETFs', icon: Briefcase, color: 'text-purple-400' },
    { id: 'market-activity', title: 'ZSE Market Activity', icon: Activity, color: 'text-orange-400' }
  ];

  const openModal = (modalId: string) => {
    setSelectedDataSource(modalId);
    setHoveredSection(null); // Close the dropdown when selecting data
  };

  const closeModal = () => {
    setSelectedDataSource(null);
  };

  const getSelectedData = () => {
    if (!selectedDataSource) return null;

    switch (selectedDataSource) {
      case 'top-gainers':
        return { title: 'Top Gainers', data: mockTopGainersData, isGainers: true, icon: ArrowUp, color: 'text-green-400' };
      case 'top-losers':
        return { title: 'Top Losers', data: mockTopLosersData, isGainers: false, icon: ArrowDown, color: 'text-red-400' };
      case 'market-indices':
        return { title: 'Market Indices', data: { ...mockTopGainersData, top_gainers: [] }, isGainers: true, icon: BarChart3, color: 'text-blue-400' };
      case 'etfs':
        return { title: 'ETFs', data: { ...mockTopGainersData, top_gainers: [] }, isGainers: true, icon: Briefcase, color: 'text-purple-400' };
      case 'market-activity':
        return { title: 'Market Activity', data: { ...mockTopGainersData, top_gainers: [] }, isGainers: true, icon: Activity, color: 'text-orange-400' };
      default:
        return null;
    }
  };

  const menuItems = [
    {
      id: 'zse',
      title: 'ZSE',
      fullTitle: 'Zimbabwe Stock Exchange',
      icon: TrendingUp,
      description: 'Stock market data and indices',
      color: 'from-green-600 to-green-800',
      hoverBg: 'hover:bg-green-600/10',
      textColor: 'text-green-400'
    },
    {
      id: 'rbz',
      title: 'RBZ',
      fullTitle: 'Reserve Bank of Zimbabwe',
      icon: Building2,
      description: 'Central bank rates and monetary policy',
      color: 'from-blue-600 to-blue-800',
      hoverBg: 'hover:bg-blue-600/10',
      textColor: 'text-blue-400'
    },
    {
      id: 'tradingview-african',
      title: 'TradingView (African)',
      fullTitle: 'TradingView African Markets',
      icon: BarChart3,
      description: 'African markets and regional indices',
      color: 'from-orange-600 to-orange-800',
      hoverBg: 'hover:bg-orange-600/10',
      textColor: 'text-orange-400'
    },
    {
      id: 'tradingview-global',
      title: 'TradingView (Global)',
      fullTitle: 'TradingView Global Indices',
      icon: Globe,
      description: 'International markets and global indices',
      color: 'from-purple-600 to-purple-800',
      hoverBg: 'hover:bg-purple-600/10',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Financial Data Sources</h2>
          <p className="text-gray-400">Hover over any section to view financial information</p>
        </div>

        {/* Inline Menu */}
        <div className="relative">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isHovered = hoveredSection === item.id;
              
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={`
                      flex items-center space-x-2 px-4 py-3 rounded-lg border border-gray-700
                      bg-gray-800/50 backdrop-blur-sm cursor-pointer transition-all duration-200
                      ${item.hoverBg} hover:border-gray-600 hover:shadow-lg
                      ${isHovered ? 'transform scale-105 shadow-xl' : ''}
                    `}
                  >
                    <div className={`w-6 h-6 bg-gradient-to-br ${item.color} rounded flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">{item.title}</span>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isHovered ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hover Content Area */}
          {hoveredSection && (
            <div 
              className="absolute top-full left-0 right-0 z-50 mt-2"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <div className="bg-gray-800/90 backdrop-blur-md rounded-xl border border-gray-600 shadow-2xl overflow-hidden">
                {(() => {
                  const activeItem = menuItems.find(item => item.id === hoveredSection);
                  if (!activeItem) return null;
                  
                  const IconComponent = activeItem.icon;
                  
                  return (
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${activeItem.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{activeItem.fullTitle}</h3>
                          <p className="text-gray-400">{activeItem.description}</p>
                        </div>
                      </div>
                      
                      {/* ZSE Specific Content */}
                      {hoveredSection === 'zse' ? (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-3">Available Data Categories</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {zseMenuItems.map((zseItem) => {
                              const ZseIconComponent = zseItem.icon;
                              return (
                                <button
                                  key={zseItem.id}
                                  onClick={() => openModal(zseItem.id)}
                                  className="flex items-center space-x-3 p-4 bg-gray-700/50 hover:bg-gray-700/80 rounded-lg transition-all duration-200 hover:scale-[1.02] group"
                                >
                                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center group-hover:bg-gray-500 transition-colors">
                                    <ZseIconComponent className={`w-4 h-4 ${zseItem.color}`} />
                                  </div>
                                  <div className="text-left">
                                    <div className="text-white font-medium text-sm">{zseItem.title}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Click any category to view detailed data</span>
                              <button className="px-3 py-1 rounded text-sm font-medium text-green-400 bg-gray-700 hover:bg-gray-600 transition-colors">
                                View All
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Other sections default content */
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Sample Data Cards */}
                            <div className="bg-gray-700/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">Market Status</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              </div>
                              <div className="text-lg font-semibold text-white">Active</div>
                            </div>
                            
                            <div className="bg-gray-700/50 rounded-lg p-4">
                              <div className="text-sm text-gray-400 mb-2">Index Value</div>
                              <div className="text-lg font-semibold text-white">2,485.67</div>
                              <div className={`text-sm ${activeItem.textColor} flex items-center`}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +2.45%
                              </div>
                            </div>
                            
                            <div className="bg-gray-700/50 rounded-lg p-4">
                              <div className="text-sm text-gray-400 mb-2">Volume</div>
                              <div className="text-lg font-semibold text-white">1.2M</div>
                              <div className="text-sm text-gray-400">shares traded</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Last updated: 2 minutes ago</span>
                              <button className={`px-3 py-1 rounded text-sm font-medium ${activeItem.textColor} bg-gray-700 hover:bg-gray-600 transition-colors`}>
                                View Details
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area - Only show when data is selected */}
        {selectedDataSource && (
          <div className="mt-8 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6 transform animate-in slide-in-from-bottom duration-500">
            {(() => {
              const selectedData = getSelectedData();
              if (!selectedData) return null;
              
              const IconComponent = selectedData.icon;
              
              return (
                <div className="space-y-4">
                  {/* Compact Header */}
                  <div className="flex items-center justify-between border-b border-gray-600 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center shadow-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedData.title}</h3>
                        <p className="text-sm text-gray-400">Zimbabwe Stock Exchange</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedDataSource(null)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Data Content */}
                  <div className="mt-4">
                    {(() => {
                      switch (selectedDataSource) {
                        case 'top-gainers':
                          return <ZSETopGainers />;
                        case 'top-losers':
                          return <ZSETopLosers />;
                        case 'market-indices':
                          return <ZSEMarketIndices />;
                        case 'etfs':
                          return (
                            <div className="text-center py-8">
                              <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                              <h3 className="text-lg font-semibold text-gray-300 mb-2">ZSE ETFs</h3>
                              <p className="text-gray-500 mb-4 text-sm">ETF data will be available soon with live integration.</p>
                              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                                <Activity className="w-5 h-5" />
                                <span className="text-sm">Coming Soon</span>
                              </div>
                            </div>
                          );
                        case 'market-activity':
                          return <ZSEMarketActivity />;
                        default:
                          return null;
                      }
                    })()}
                  </div>

                  {/* Compact Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-600">
                    <div className="text-xs text-gray-400">
                      Live data from Zimbabwe Stock Exchange
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedDataSource(null)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZimFinancialData;
