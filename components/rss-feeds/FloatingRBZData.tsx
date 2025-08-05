'use client'

import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';

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

const FloatingRBZData = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock RBZ bank rates data
  const mockRBZData: RBZDataResponse = {
    status: "success",
    timestamp: "2025-08-05T10:30:00Z",
    source: "Reserve Bank of Zimbabwe",
    rates: [
      { currency: "USD", symbol: "$", buy_rate: 1.00, sell_rate: 1.00, mid_rate: 1.00, change: 0.00, change_percent: 0.00, last_updated: "2025-08-05T10:30:00Z" },
      { currency: "EUR", symbol: "€", buy_rate: 0.85, sell_rate: 0.87, mid_rate: 0.86, change: -0.02, change_percent: -2.27, last_updated: "2025-08-05T10:30:00Z" },
      { currency: "GBP", symbol: "£", buy_rate: 0.73, sell_rate: 0.75, mid_rate: 0.74, change: 0.01, change_percent: 1.37, last_updated: "2025-08-05T10:30:00Z" },
      { currency: "ZAR", symbol: "R", buy_rate: 18.45, sell_rate: 18.85, mid_rate: 18.65, change: -0.35, change_percent: -1.84, last_updated: "2025-08-05T10:30:00Z" },
      { currency: "BWP", symbol: "P", buy_rate: 13.25, sell_rate: 13.55, mid_rate: 13.40, change: 0.15, change_percent: 1.13, last_updated: "2025-08-05T10:30:00Z" },
      { currency: "AUD", symbol: "A$", buy_rate: 1.52, sell_rate: 1.55, mid_rate: 1.535, change: 0.02, change_percent: 1.32, last_updated: "2025-08-05T10:30:00Z" },
      { currency: "CAD", symbol: "C$", buy_rate: 1.35, sell_rate: 1.38, mid_rate: 1.365, change: -0.01, change_percent: -0.73, last_updated: "2025-08-05T10:30:00Z" },
      { currency: "CNY", symbol: "¥", buy_rate: 7.15, sell_rate: 7.25, mid_rate: 7.20, change: 0.05, change_percent: 0.70, last_updated: "2025-08-05T10:30:00Z" }
    ]
  };

  // Cycle through rates automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= mockRBZData.rates.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [mockRBZData.rates.length]);

  const currentRate = mockRBZData.rates[currentIndex];

  if (!isVisible) return null;

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
              <span className="text-blue-200 font-medium text-sm">RBZ Exchange Rates</span>
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
                  {currentRate.change >= 0 ? '+' : ''}{currentRate.change_percent.toFixed(2)}%
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
                {currentIndex + 1}/{mockRBZData.rates.length}
              </span>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              <span className="text-green-300 text-xs font-medium">LIVE</span>
            </div>
          </div>

          {/* Close button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-blue-600/30 rounded-full transition-colors pointer-events-auto"
          >
            <span className="text-blue-300 text-xs">✕</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-900/50">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / mockRBZData.rates.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingRBZData;
