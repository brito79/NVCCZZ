import type { NextApiRequest, NextApiResponse } from 'next';

interface CryptoPrice {
  usd: number;
  usd_24h_change?: number;
}

interface CryptoData {
  bitcoin: CryptoPrice;
  binancecoin: CryptoPrice;
  cardano: CryptoPrice;
  ethereum: CryptoPrice;
}

export default async function handlerCrypto(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,binancecoin,cardano,ethereum&vs_currencies=usd&include_24hr_change=true',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CryptoData = await response.json();

    // Helper function to format change and determine trend
    const formatCryptoData = (price: number, change?: number) => {
      const formattedPrice = price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString()}`;
      const changeValue = change || 0;
      const formattedChange = changeValue > 0 ? `+${changeValue.toFixed(2)}%` : `${changeValue.toFixed(2)}%`;
      const trend = changeValue > 0 ? 'up' : changeValue < 0 ? 'down' : 'neutral';
      
      return {
        price: formattedPrice,
        change: formattedChange,
        trend: trend
      };
    };

    // Format the data in the requested format
    const formattedData = [
      {
        symbol: 'BTC',
        ...formatCryptoData(data.bitcoin.usd, data.bitcoin.usd_24h_change)
      },
      {
        symbol: 'ETH',
        ...formatCryptoData(data.ethereum.usd, data.ethereum.usd_24h_change)
      },
      {
        symbol: 'BNB',
        ...formatCryptoData(data.binancecoin.usd, data.binancecoin.usd_24h_change)
      },
      {
        symbol: 'ADA',
        ...formatCryptoData(data.cardano.usd, data.cardano.usd_24h_change)
      }
    ];

    // Set cache headers for 60 seconds
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Crypto API fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch crypto prices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
