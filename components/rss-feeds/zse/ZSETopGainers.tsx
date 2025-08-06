'use client'

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchTopGainers, TopGainer, TopGainersResponse } from '@/pages/api/zse-top-gainers';


interface ZSETopGainersProps {
    className?: string;
}

const ZSETopGainers: React.FC<ZSETopGainersProps> = ({ className = '' }) => {
  const [data, setData] = useState<TopGainersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      const result = await fetchTopGainers();
    
      
      if (result.success && result.data) {
        console.log('ZSETopGainers: Data loaded successfully:', result.data);
        console.log('ZSETopGainers: Number of gainers:', result.data.top_gainers?.length);
        setData(result.data);
        setLastUpdated(new Date());
      } else {
        console.error('ZSETopGainers: API error:', result.error);
        setError(result.error || 'Failed to load data');
      }
    } catch (err) {
      console.error('ZSETopGainers: Network error:', err);
      setError('Network error occurred: ' + (err instanceof Error ? err.message : 'Unknown error'));
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

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatValue = (value: number, currency: string) => {
    return `${currency} ${value.toFixed(2)}`;
  };

  const formatChange = (change: number, direction: string) => {
    const prefix = direction === 'up' ? '+' : direction === 'down' ? '-' : '';
    return `${prefix}${Math.abs(change).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-300">Loading ZSE Top Gainers...</span>
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
              <h3 className="text-lg font-semibold text-white">Error Loading Data</h3>
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

  if (!data || !data.top_gainers || !data.top_gainers.length) {
    console.log('ZSETopGainers: No data condition triggered', { 
      hasData: !!data, 
      hasTopGainers: !!(data?.top_gainers),
      gainersLength: data?.top_gainers?.length 
    });
    
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Data Available</h3>
          <p className="text-gray-500 mb-4 text-sm">
            ZSE top gainers data is currently unavailable.
            {data && (
              <span className="block text-xs mt-2">
                Debug: Data received but no top_gainers array or empty array
              </span>
            )}
          </p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ZSE Top Gainers</h3>
              <p className="text-sm text-gray-400">
                {data.count} stocks • {data.source}
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700/30">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Symbol
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Value
              </th>
              <th className="text-right py-3 px-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Change
              </th>
              <th className="text-center py-3 px-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.top_gainers.map((stock: TopGainer, index: number) => (
              <tr 
                key={`${stock.symbol}-${index}`}
                className="hover:bg-gray-700/20 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-sm">
                    {stock.symbol}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="text-white font-medium text-sm">
                    {formatValue(stock.value, stock.currency)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className={`font-medium text-sm ${getDirectionColor(stock.direction)}`}>
                    {formatChange(stock.change, stock.direction)}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {getDirectionIcon(stock.direction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/20">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div>
            Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
          </div>
          <div>
            Status: <span className="text-green-400">{data.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZSETopGainers;
