'use client'

import React, { useState, useRef, useCallback } from 'react';
import { TrendingUp, Building2, Globe, BarChart3, ChevronDown, X, ArrowUp, ArrowDown, Activity, DollarSign, Briefcase } from 'lucide-react';
import ZSETopGainers from './rss-feeds/zse/ZSETopGainers';
import ZSETopLosers from './rss-feeds/zse/ZSETopLosers';
import ZSEMarketIndices from './rss-feeds/zse/ZSEMarketIndices';
import ZSEMarketActivity from './rss-feeds/zse/ZSEMarketActivity';
import ZSEEtfs from './rss-feeds/zse/ZSEEtfs';
import RBZBankRates from './rss-feeds/rbz/RBZBankRates';
import AfricaTradingViewFinancialData from './rss-feeds/tradingviews/AfricaTradingViewFinacialData';
import WorldTradingViewData from './rss-feeds/tradingviews/WorldTradingViewData';

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

  const zseMenuItems = [
    { id: 'top-gainers', title: 'ZSE Top Gainers', icon: ArrowUp, color: 'text-green-400' },
    { id: 'top-losers', title: 'ZSE Top Losers', icon: ArrowDown, color: 'text-red-400' },
    { id: 'market-indices', title: 'ZSE Market Indices', icon: BarChart3, color: 'text-blue-400' },
    { id: 'etfs', title: 'ZSE ETFs', icon: Briefcase, color: 'text-purple-400' },
    { id: 'market-activity', title: 'ZSE Market Activity', icon: Activity, color: 'text-orange-400' }
  ];

  const rbzMenuItems = [
    { id: 'rbz-bank-rates', title: 'RBZ Bank Rates', icon: Building2, color: 'text-blue-400' }
  ];

  const tradingViewAfricanMenuItems = [
    { id: 'african-indices', title: 'African Market Indices', icon: Globe, color: 'text-orange-400' }
  ];

  const tradingViewGlobalMenuItems = [
    { id: 'world-indices', title: 'Global Market Indices', icon: Globe, color: 'text-purple-400' }
  ];

  const openModal = (modalId: string) => {
    console.log('Model Opened')
    console.log(`Opening modal for: ${modalId}`);
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
        return { title: 'Top Gainers', icon: ArrowUp, color: 'text-green-400' };
      case 'top-losers':
        return { title: 'Top Losers', icon: ArrowDown, color: 'text-red-400' };
      case 'market-indices':
        return { title: 'Market Indices', icon: BarChart3, color: 'text-blue-400' };
      case 'etfs':
        return { title: 'ETFs', icon: Briefcase, color: 'text-purple-400' };
      case 'market-activity':
        return { title: 'Market Activity', icon: Activity, color: 'text-orange-400' };
      case 'rbz-bank-rates':
        return { title: 'RBZ Bank Rates', icon: Building2, color: 'text-blue-400' };
      case 'african-indices':
        return { title: 'African Market Indices', icon: Globe, color: 'text-orange-400' };
      case 'world-indices':
        return { title: 'Global Market Indices', icon: Globe, color: 'text-purple-400' };
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
    <div className="bg-gray-900">

    </div>
  );
};

export default ZimFinancialData;
