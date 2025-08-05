'use client'

import React from 'react';
import { Activity, AlertCircle } from 'lucide-react';

interface ZSEMarketActivityProps {
  className?: string;
}

const ZSEMarketActivity: React.FC<ZSEMarketActivityProps> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 ${className}`}>
      <div className="text-center">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-4">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">ZSE Market Activity</h3>
        <p className="text-gray-400 mb-4 text-sm">Real-time market activity data will be available soon.</p>
        <div className="flex items-center justify-center space-x-2 text-yellow-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default ZSEMarketActivity;
