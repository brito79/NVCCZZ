import { BankRatesResponse } from "@/types.db";
import { Building2, Calendar } from "lucide-react";
import ZSETopGainers from "./zse/ZSETopGainers";

 export const BankRatesCard = ({ data, isLoading }: { data?: BankRatesResponse; isLoading?: boolean; }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <Building2 className="w-5 h-5 mr-2 text-green-400" />
        Bank Exchange Rates
        {isLoading && (
          <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400"></div>
        )}
      </h3>
      
      {data && (
        <div className="mb-3 pb-2 border-b border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{data.date}</span>
            </div>
            <span>{data.source}</span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data?.exchange_rates
          ?.filter(rate => typeof rate.ask === 'number' && typeof rate.avg === 'number' && typeof rate.bid === 'number')
          .map((rate, index) => (
          <div key={index} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-sm">{rate.currency}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-400 font-medium">BID</div>
                <div className="text-red-300 font-bold">{rate.bid.toFixed(4)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 font-medium">AVG</div>
                <div className="text-blue-300 font-bold">{rate.avg.toFixed(4)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 font-medium">ASK</div>
                <div className="text-green-300 font-bold">{rate.ask.toFixed(4)}</div>
              </div>
            </div>
          </div>
        )) || (
          <div className="text-center py-4 text-gray-400">
            {isLoading ? 'Loading rates...' : 'No exchange rates available'}
          </div>
        )}
      </div>
      
      {data && (
        <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-500">
          Updated: {new Date(data.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );