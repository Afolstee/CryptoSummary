import { Cryptocurrency, MarketStats } from "@shared/schema";

interface CoinGeckoMarket {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  image?: string;
}

interface CoinGeckoGlobal {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number };
    active_cryptocurrencies: number;
    market_cap_change_percentage_24h_usd: number;
  };
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CoinGeckoAPIService {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private cache = new Map<string, CachedData<any>>();
  private readonly defaultTTL = 60000; // 1 minute default TTL
  
  constructor() {
    // environment variables for configuration
    this.baseUrl = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
    this.apiKey = process.env.COINGECKO_API_KEY; // using free tier
  }

  private async fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };
      
      // Add API key if available (for pro users)
      if (this.apiKey) {
        headers['x-cg-pro-api-key'] = this.apiKey;
      }

      const response = await fetch(url, {
        signal: controller.signal,
        headers,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('CoinGecko API request timeout');
      }
      throw error;
    }
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  async getCryptocurrencies(limit: number = 250): Promise<Cryptocurrency[]> {
    const cacheKey = `cryptocurrencies-${limit}`;
    const cached = this.getCachedData<Cryptocurrency[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`;
    
    try {
      const response = await this.fetchWithTimeout(url);
      const data: CoinGeckoMarket[] = await response.json();
      
      const cryptocurrencies = data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        priceChange24h: coin.price_change_24h || 0,
        priceChangePercentage24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap || 0,
        volume24h: coin.total_volume || 0,
        rank: coin.market_cap_rank || 999,
        logoColor: this.getLogoColor(coin.symbol.toLowerCase()),
        updatedAt: new Date(),
      }));

      this.setCachedData(cacheKey, cryptocurrencies, 30000); // 30s cache for crypto prices
      return cryptocurrencies;
    } catch (error) {
      console.error('Failed to fetch cryptocurrencies from CoinGecko:', error);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  async getMarketStats(): Promise<MarketStats> {
    const cacheKey = 'market-stats';
    const cached = this.getCachedData<MarketStats>(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `${this.baseUrl}/global`;
    
    try {
      const response = await this.fetchWithTimeout(url);
      const globalData: CoinGeckoGlobal = await response.json();
      
      const marketStats = {
        id: 'global-stats',
        totalMarketCap: globalData.data.total_market_cap.usd,
        totalVolume24h: globalData.data.total_volume.usd,
        btcDominance: globalData.data.market_cap_percentage.btc,
        activeCryptos: globalData.data.active_cryptocurrencies,
        marketCapChange24h: globalData.data.market_cap_change_percentage_24h_usd,
        updatedAt: new Date(),
      };

      this.setCachedData(cacheKey, marketStats, 60000); // 1 minute cache for market stats
      return marketStats;
    } catch (error) {
      console.error('Failed to fetch market stats from CoinGecko:', error);
      throw new Error('Failed to fetch market statistics');
    }
  }

  private getLogoColor(symbol: string): string {
    // Map common cryptocurrencies to their brand colors
    const colorMap: Record<string, string> = {
      btc: '#f7931a',
      eth: '#627eea', 
      bnb: '#f3ba2f',
      sol: '#9945ff',
      ada: '#0033ad',
      matic: '#8247e5',
      avax: '#e84142',
      link: '#375bd2',
      dot: '#e6007a',
      uni: '#ff007a',
      ltc: '#bfbbbb',
      bch: '#8dc351',
      xlm: '#7d00ff',
      xrp: '#23292f',
      doge: '#c2a633',
    };
    
    return colorMap[symbol] || '#6366f1'; // Default colour
  }
}

export const coinGeckoService = new CoinGeckoAPIService();