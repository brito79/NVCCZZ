import { NextApiRequest, NextApiResponse } from 'next';
import { fetchBankRates } from '@/lib/bankRates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await fetchBankRates();
    // Check if the result is successful and contains data
    console.log(result);
    
    if (result.success && result.data) {
        
      return res.status(200).json(result.data);
    } else {
      return res.status(500).json({ message: result.error || 'Failed to fetch bank rates' });
    }
  } catch (error) {
    console.error('Error fetching bank rates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
