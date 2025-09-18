import { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';
import { coinGeckoService } from '../server/api-service';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const cryptocurrencies = await storage.getCryptocurrencies();
    
    // Set cache headers for Vercel CDN
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(cryptocurrencies);
  } catch (error) {
    console.error('Failed to fetch cryptocurrencies:', error);
    res.status(500).json({ message: 'Failed to fetch cryptocurrencies' });
  }
}