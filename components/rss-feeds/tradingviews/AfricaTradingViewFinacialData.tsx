'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, RefreshCw, AlertCircle, Globe, Activity } from 'lucide-react';
import { fetchAfricanIndices, AfricanIndicesResponse, AfricanIndex } from '@/pages/api/africa-indices';

interface AfricaTradingViewFinancialDataProps {
  className?: string;
}

const AfricaTradingViewFinancialData: React.FC<AfricaTradingViewFinancialDataProps> = ({ className = '' }) => {
  const [data, setData] = useState<AfricanIndicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching African Indices data...');
      const result = await fetchAfricanIndices();
      console.log('African Indices API Result:', result);
      
      if (result.success && result.data) {
        console.log('African indices data:', result.data.indices);
        console.log('Number of indices:', result.data.indices.length);
        
        // Debug each index item
        result.data.indices.forEach((index, idx) => {
          console.log(`Index ${idx + 1}:`, {
            symbol: index.symbol,
            name: index.name,
            price: index.price,
            change: index.change,
            changePercent: index['change %'],
            high: index.high,
            low: index.low,
            tech_rating: index.tech_rating
          });
        });
        
        setData(result.data);
        setLastUpdated(new Date());
      } else {
        const errorMsg = result.error || 'Failed to fetch African indices data';
        console.error('African indices fetch error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('African indices fetch exception:', err);
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

  const parseNumericValue = (value: string) => {
    if (!value || value === '' || value === 'N/A') return null;
    const parsed = parseFloat(value.replace(/[,%]/g, ''));
    return isNaN(parsed) ? null : parsed;
  };

  const formatPrice = (price: string) => {
    if (!price || price === '' || price === 'N/A') return 'N/A';
    const numericPrice = parseNumericValue(price);
    if (numericPrice === null) return price;
    return numericPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (change: string) => {
    if (!change || change === '' || change === 'N/A') return 'N/A';
    return change;
  };

  const formatPercentage = (changePercent: string) => {
    if (!changePercent || changePercent === '' || changePercent === 'N/A') return 'N/A';
    return changePercent.includes('%') ? changePercent : `${changePercent}%`;
  };

  const getChangeDirection = (change: string) => {
    if (!change || change === '' || change === 'N/A') return 'neutral';
    const numericChange = parseNumericValue(change);
    if (numericChange === null) return 'neutral';
    return numericChange > 0 ? 'up' : numericChange < 0 ? 'down' : 'neutral';
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
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

  const getTechnicalRatingColor = (rating: string) => {
    if (!rating || rating === '' || rating === 'N/A') return 'text-gray-400';
    const lowerRating = rating.toLowerCase();
    if (lowerRating.includes('strong buy') || lowerRating.includes('buy')) return 'text-green-400';
    if (lowerRating.includes('strong sell') || lowerRating.includes('sell')) return 'text-red-400';
    if (lowerRating.includes('neutral') || lowerRating.includes('hold')) return 'text-yellow-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-300">Loading African Indices...</span>
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
              <h3 className="text-lg font-semibold text-white">Error Loading African Indices</h3>
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

  if (!data || !data.indices || !data.indices.length) {
    console.log('AfricaTradingViewFinancialData: No data condition triggered', { 
      hasData: !!data, 
      hasIndices: data?.indices, 
      indicesLength: data?.indices?.length 
    });
    
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">African Indices</h3>
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
          <div className="text-gray-400 text-sm">No African indices data available</div>
          {lastUpdated && (
            <div className="text-gray-500 text-xs mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">African Market Indices</h3>
            <p className="text-sm text-gray-400">TradingView African Markets</p>
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-300">Index</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">Price</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">Change</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">Change %</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">High</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">Low</th>
              <th className="text-center py-3 px-2 font-medium text-gray-300">Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.indices.map((index, idx) => {
              console.log(`Rendering Index ${idx + 1}:`, index);
              const direction = getChangeDirection(index.change);
              return (
                <tr key={index.symbol || `index-${idx}`} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium text-white">
                        {index.symbol || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1" title={index.full_name}>
                        {index.name || index.full_name || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className="font-medium text-white">
                      {formatPrice(index.price)}
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className="flex items-center justify-end space-x-2">
                      {getDirectionIcon(direction)}
                      <span className={`font-medium ${getDirectionColor(direction)}`}>
                        {formatChange(index.change)}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className={`font-medium ${getDirectionColor(direction)}`}>
                      {formatPercentage(index['change %'])}
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className="font-medium text-white">
                      {formatPrice(index.high)}
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className="font-medium text-white">
                      {formatPrice(index.low)}
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">
                    <div className={`text-xs font-medium px-2 py-1 rounded ${getTechnicalRatingColor(index.tech_rating)}`}>
                      {index.tech_rating || 'N/A'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Showing {data.indices.length} African {data.indices.length !== 1 ? 'indices' : 'index'} • Source: {data.source}
      </div>
    </div>
  );
};

export default AfricaTradingViewFinancialData;
