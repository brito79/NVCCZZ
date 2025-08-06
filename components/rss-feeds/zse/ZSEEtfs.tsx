'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchZseETFs, ZseETF, ZseETFsResponse } from '@/pages/api/zse-etfs';

interface ZSEEtfsProps {
  className?: string;
}

const ZSEEtfs: React.FC<ZSEEtfsProps> = ({ className = '' }) => {
  const [data, setData] = useState<ZseETFsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching ZSE ETFs data...');
      const result = await fetchZseETFs();
      console.log('ZSE ETFs API Result:', result);
      
      if (result.success && result.data) {
        console.log('ETFs data:', result.data.etfs);
        console.log('Number of ETFs:', result.data.etfs.length);
        
        // Debug each ETF item
        result.data.etfs.forEach((etf, index) => {
          console.log(`ETF ${index + 1}:`, {
            security: etf.security,
            price: etf.price,
            price_currency: etf.price_currency,
            change: etf.change,
            change_direction: etf.change_direction,
            market_cap: etf.market_cap,
            market_cap_currency: etf.market_cap_currency,
            units: etf.units
          });
        });
        
        setData(result.data);
        setLastUpdated(new Date());
      } else {
        const errorMsg = result.error || 'Failed to fetch ETFs data';
        console.error('ETFs fetch error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('ETFs fetch exception:', err);
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

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
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

  const formatPrice = (price: number, currency: string) => {
    if (price === undefined || price === null) return 'N/A';
    if (!currency) currency = 'USD';
    return `${currency} ${price.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap: number, currency: string, units: string) => {
    if (marketCap === undefined || marketCap === null) return 'N/A';
    if (!currency) currency = 'USD';
    if (!units) units = '';
    return `${currency} ${marketCap.toFixed(2)} ${units}`.trim();
  };

  const formatChange = (change: number, direction: string) => {
    if (change === undefined || change === null) return '0.00';
    const prefix = direction === 'up' ? '+' : direction === 'down' ? '-' : '';
    return `${prefix}${Math.abs(change).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-300">Loading ZSE ETFs...</span>
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
              <h3 className="text-lg font-semibold text-white">Error Loading ETFs Data</h3>
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

  if (!data || !data.etfs || !data.etfs.length) {
    console.log('ZSEETFs: No data condition triggered', { 
      hasData: !!data, 
      hasETFs: data?.etfs, 
      etfsLength: data?.etfs?.length 
    });
    
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">ZSE ETFs</h3>
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
          <div className="text-gray-400 text-sm">No ETFs data available</div>
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
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">ZSE ETFs</h3>
            <p className="text-sm text-gray-400">Exchange Traded Funds</p>
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
              <th className="text-left py-3 px-2 font-medium text-gray-300">Security</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">Price</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">Change</th>
              <th className="text-right py-3 px-2 font-medium text-gray-300">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {data.etfs.map((etf, index) => {
              console.log(`Rendering ETF ${index + 1}:`, etf);
              return (
                <tr key={etf.security || `etf-${index}`} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-medium text-white">
                      {etf.security || 'N/A'}
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className="font-medium text-white">
                      {formatPrice(etf.price, etf.price_currency)}
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className="flex items-center justify-end space-x-2">
                      {getDirectionIcon(etf.change_direction)}
                      <span className={`font-medium ${getDirectionColor(etf.change_direction)}`}>
                        {formatChange(etf.change, etf.change_direction)}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-2">
                    <div className="font-medium text-white">
                      {formatMarketCap(etf.market_cap, etf.market_cap_currency, etf.units)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Showing {data.etfs.length} ETF{data.etfs.length !== 1 ? 's' : ''} • Source: {data.source}
      </div>
    </div>
  );
};

export default ZSEEtfs;
