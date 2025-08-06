'use server';

import type { NextApiRequest, NextApiResponse } from 'next';
import { getForexRates } from '@/lib/forex'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await getForexRates();
//   console.log(response);

  if (!response.success) {
    return res.status(500).json({ success: false, error: response.error });
  }

  return res.status(200).json({ success: true, data: response.data });
}
