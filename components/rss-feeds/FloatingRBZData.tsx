'use client'

import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import useSWR from 'swr';
import { BankRatesResponse } from '@/types.db';

interface BankRate {
  currency: string;
  symbol: string;
  buy_rate: number;
  sell_rate: number;
  mid_rate: number;
  change: number;
  change_percent: number;
  last_updated: string;
}

interface RBZDataResponse {
  status: string;
  timestamp: string;
  source: string;
  rates: BankRate[];
}

const fetcher = async (url: string) => await fetch(url).then(res => res.json());

const FloatingRBZData = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Fetch bank rates data - More aggressive refresh for live data
  const { data: bankRatesData, error, isLoading } = useSWR<BankRatesResponse>(
    mounted ? '/api/bankRates' : null, 
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 1 minute for more live data
      revalidateOnFocus: true, // Refresh when window regains focus
      revalidateOnReconnect: true, // Refresh when reconnected
      dedupingInterval: 30000, // Dedupe requests for 30 seconds
    }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Currency symbol mapping
  const getCurrencySymbol = (currency: string): string => {
    const symbolMap: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'ZAR': 'R',
      'BWP': 'P',
      'AUD': 'A$',
      'CAD': 'C$',
      'CNY': '¥',
      'JPY': '¥',
      'CHF': 'CHF',
      'SEK': 'kr',
      'NOK': 'kr',
      'DKK': 'kr',
    };
    return symbolMap[currency] || currency;
  };

  // Transform API data to component format
  const transformedRates: BankRate[] = bankRatesData?.exchange_rates?.map((rate, index) => ({
    currency: rate.currency,
    symbol: getCurrencySymbol(rate.currency),
    buy_rate: rate.bid, // Use bid as buy rate
    sell_rate: rate.ask, // Use ask as sell rate  
    mid_rate: rate.avg,  // Use avg as mid rate
    change: 0, // We don't have change data from API, so default to 0
    change_percent: 0, // We don't have percentage change from API
    last_updated: bankRatesData.timestamp || new Date().toISOString(),
  })) || [];

  // Use ONLY real API data - no mock data fallback
  const currentRates = transformedRates;
  
  console.log('Bank Rates API Data:', bankRatesData);
  console.log('Transformed Rates:', transformedRates);
  console.log('Current Rates Length:', currentRates.length);

  // Cycle through rates automatically
  useEffect(() => {
    if (currentRates.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= currentRates.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [currentRates.length]);

  // Show loading or error state when no API data
  if (!mounted) {
    return (
      <div className="fixed top-20 left-0 right-0 z-40 pointer-events-none">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80 backdrop-blur-md border-y border-blue-600/30 shadow-lg">
          <div className="relative flex items-center justify-center py-3 px-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
            <span className="ml-3 text-blue-200 text-sm">Loading exchange rates...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state when API fails
  if (error) {
    return (
      <div className="fixed top-20 left-0 right-0 z-40 pointer-events-none">
        <div className="relative overflow-hidden bg-gradient-to-r from-red-900/80 via-red-800/80 to-red-900/80 backdrop-blur-md border-y border-red-600/30 shadow-lg">
          <div className="relative flex items-center justify-center py-3 px-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="ml-3 text-red-200 text-sm">RBZ Exchange Rates - API Error</span>
            <span className="ml-2 text-red-300 text-xs">● OFFLINE</span>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching
  if (isLoading || currentRates.length === 0) {
    return (
      <div className="fixed top-20 left-0 right-0 z-40 pointer-events-none">
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-900/80 via-yellow-800/80 to-yellow-900/80 backdrop-blur-md border-y border-yellow-600/30 shadow-lg">
          <div className="relative flex items-center justify-center py-3 px-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400"></div>
            <span className="ml-3 text-yellow-200 text-sm">Fetching live exchange rates from RBZ...</span>
          </div>
        </div>
      </div>
    );
  }

  const currentRate = currentRates[currentIndex];
  if (!currentRate) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 pointer-events-none">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80 backdrop-blur-md border-y border-blue-600/30 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent animate-pulse"></div>
        
        {/* Floating content */}
        <div className="relative flex items-center justify-center py-3 px-4">
          <div className="flex items-center space-x-6 transition-all duration-500 ease-in-out transform">
            {/* RBZ Logo/Icon */}
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-200 font-medium text-sm">
                RBZ Exchange Rates - LIVE API Data
                <span className="ml-1 text-green-300 text-xs">● LIVE</span>
              </span>
            </div>

            <div className="hidden sm:block">
              <ArrowRight className="w-4 h-4 text-blue-300 animate-bounce" />
            </div>

            {/* Current Rate Display */}
            <div className="flex items-center space-x-4 sm:space-x-6 bg-black/20 rounded-lg px-3 sm:px-4 py-2 backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
              {/* Currency Info */}
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-lg sm:text-xl">{currentRate.symbol}</span>
                <span className="text-blue-200 font-medium text-sm">{currentRate.currency}</span>
              </div>

              {/* Buy Rate */}
              <div className="text-center">
                <div className="text-xs text-blue-300 mb-1">BUY</div>
                <div className="text-white font-semibold text-sm">{currentRate.buy_rate.toFixed(2)}</div>
              </div>

              {/* Sell Rate */}
              <div className="text-center">
                <div className="text-xs text-blue-300 mb-1">SELL</div>
                <div className="text-white font-semibold text-sm">{currentRate.sell_rate.toFixed(2)}</div>
              </div>

              {/* Mid Rate - Hidden on small screens */}
              <div className="hidden sm:block text-center">
                <div className="text-xs text-blue-300 mb-1">MID</div>
                <div className="text-white font-semibold text-sm">{currentRate.mid_rate.toFixed(3)}</div>
              </div>

              {/* Change */}
              <div className="flex items-center space-x-1">
                {currentRate.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-400 animate-pulse" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400 animate-pulse" />
                )}
                <span className={`text-sm font-medium ${
                  currentRate.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentRate.change === 0 ? 'N/A' : 
                   `${currentRate.change >= 0 ? '+' : ''}${currentRate.change_percent.toFixed(2)}%`
                  }
                </span>
              </div>
            </div>

            <div className="hidden sm:block">
              <ArrowRight className="w-4 h-4 text-blue-300 animate-bounce" />
            </div>

            {/* Rate Counter */}
            <div className="flex items-center space-x-2 text-blue-200">
              <span className="text-xs hidden sm:inline">Rate</span>
              <span className="bg-blue-600/30 rounded-full px-2 py-1 text-xs font-medium animate-pulse">
                {currentIndex + 1}/{currentRates.length}
              </span>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-green-300 text-xs font-medium">LIVE API</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-900/50">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / currentRates.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingRBZData;
