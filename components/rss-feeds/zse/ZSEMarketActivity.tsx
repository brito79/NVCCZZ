'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, RefreshCw, TrendingUp, DollarSign, BarChart3, Users } from 'lucide-react';
import { fetchMarketActivity, ZseMarketActivity, ZseMarketActivityResponse } from '@/pages/api/zse-market-activity';

interface ZSEMarketActivityProps {
  className?: string;
}

const ZSEMarketActivity: React.FC<ZSEMarketActivityProps> = ({ className = '' }) => {
  const [data, setData] = useState<ZseMarketActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching ZSE Market Activity data...');
      const result = await fetchMarketActivity();
      console.log('ZSE Market Activity API Result:', result);
      
      if (result.success && result.data) {
        console.log('Market Activity data:', result.data.market_activity);
        
        // Debug market activity data
        const activity = result.data.market_activity;
        console.log('Market Activity Details:', {
          trades: activity.trades,
          market_cap: activity.market_cap,
          foreign_buys: activity.foreign_buys,
          foreign_sells: activity.foreign_sells
        });
        
        setData(result.data);
        setLastUpdated(new Date());
      } else {
        const errorMsg = result.error || 'Failed to fetch market activity data';
        console.error('Market Activity fetch error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Market Activity fetch exception:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return 'N/A';
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `USD ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-300">Loading ZSE Market Activity...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Error Loading Market Activity</h3>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.market_activity) {
    console.log('ZSEMarketActivity: No data condition triggered', { 
      hasData: !!data, 
      hasActivity: data?.market_activity 
    });
    
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">ZSE Market Activity</h3>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">No market activity data available</div>
          {lastUpdated && (
            <div className="text-gray-500 text-xs mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  const activity = data.market_activity;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">ZSE Market Activity</h3>
            <p className="text-sm text-gray-400">Daily Market Overview</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Trades */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-medium text-gray-300">Total Trades</h4>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatNumber(activity.trades)}
          </div>
        </div>

        {/* Market Cap */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-medium text-gray-300">Market Cap</h4>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(activity.market_cap)}
          </div>
        </div>

        {/* Foreign Buys */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-medium text-gray-300">Foreign Buys</h4>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(activity.foreign_buys)}
          </div>
        </div>

        {/* Foreign Sells */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-5 h-5 text-orange-400" />
            <h4 className="text-sm font-medium text-gray-300">Foreign Sells</h4>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(activity.foreign_sells)}
          </div>
        </div>

        {/* Net Foreign Flow */}
        <div className="bg-gray-700/30 rounded-lg p-4 md:col-span-2">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-medium text-gray-300">Net Foreign Flow</h4>
          </div>
          <div className="text-2xl font-bold text-white">
            {(() => {
              const netFlow = activity.foreign_buys - activity.foreign_sells;
              const isPositive = netFlow >= 0;
              return (
                <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                  {isPositive ? '+' : ''}{formatCurrency(netFlow)}
                </span>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Date: {data.date}</span>
          <span>Source: {data.source}</span>
        </div>
      </div>
    </div>
  );
};

export default ZSEMarketActivity;
