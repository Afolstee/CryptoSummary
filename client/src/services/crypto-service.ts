import { Cryptocurrency, MarketStats } from "@shared/schema";

export class CryptoService {
  private baseUrl = '/api';

  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    const response = await fetch(`${this.baseUrl}/cryptocurrencies`);
    if (!response.ok) {
      throw new Error('Failed to fetch cryptocurrencies');
    }
    return response.json();
  }

  async getCryptocurrency(id: string): Promise<Cryptocurrency> {
    const response = await fetch(`${this.baseUrl}/cryptocurrencies/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cryptocurrency ${id}`);
    }
    return response.json();
  }

  async getMarketStats(): Promise<MarketStats> {
    const response = await fetch(`${this.baseUrl}/market-stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch market stats');
    }
    return response.json();
  }

  formatPrice(price: number): string {
    if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 1000) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(1)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  }

  formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '▲' : '▼';
    return `${sign} ${Math.abs(percentage).toFixed(2)}%`;
  }
}

export const cryptoService = new CryptoService();
