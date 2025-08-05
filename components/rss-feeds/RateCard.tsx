import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

  export const RateCard = ({ title, data, type, isLoading }: { title: string; data: any[]; type: string; isLoading?: boolean; }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
        {title}
        {isLoading && (
          <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-400"></div>
        )}
      </h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
            <span className="font-medium text-gray-300">
              {type === 'crypto' ? item.symbol : type === 'forex' ? item.pair : item.name}
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">
                {type === 'crypto' ? item.price : type === 'forex' ? item.rate : item.rate}
              </span>
              <span className={`flex items-center text-sm ${
                item.trend === 'up' ? 'text-green-400' : 
                item.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {item.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> :
                 item.trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );