import { type Cryptocurrency, type InsertCryptocurrency, type MarketStats, type InsertMarketStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCryptocurrencies(): Promise<Cryptocurrency[]>;
  getCryptocurrency(id: string): Promise<Cryptocurrency | undefined>;
  updateCryptocurrency(id: string, data: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined>;
  getMarketStats(): Promise<MarketStats | undefined>;
  updateMarketStats(data: InsertMarketStats): Promise<MarketStats>;
}

export class MemStorage implements IStorage {
  private cryptocurrencies: Map<string, Cryptocurrency>;
  private marketStatsData: MarketStats | undefined;

  constructor() {
    this.cryptocurrencies = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with popular cryptocurrencies
    const mockCryptos: Cryptocurrency[] = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 43782.45,
        priceChange24h: 1356.78,
        priceChangePercentage24h: 3.21,
        marketCap: 892100000000,
        volume24h: 28400000000,
        rank: 1,
        logoColor: "#f7931a",
        updatedAt: new Date(),
      },
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        price: 2654.32,
        priceChange24h: 48.72,
        priceChangePercentage24h: 1.87,
        marketCap: 319200000000,
        volume24h: 12800000000,
        rank: 2,
        logoColor: "#627eea",
        updatedAt: new Date(),
      },
      {
        id: "binancecoin",
        name: "BNB",
        symbol: "BNB",
        price: 312.18,
        priceChange24h: -2.99,
        priceChangePercentage24h: -0.95,
        marketCap: 47800000000,
        volume24h: 1200000000,
        rank: 3,
        logoColor: "#f3ba2f",
        updatedAt: new Date(),
      },
      {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        price: 98.42,
        priceChange24h: 5.34,
        priceChangePercentage24h: 5.73,
        marketCap: 43200000000,
        volume24h: 2100000000,
        rank: 4,
        logoColor: "#9945ff",
        updatedAt: new Date(),
      },
      {
        id: "cardano",
        name: "Cardano",
        symbol: "ADA",
        price: 0.4821,
        priceChange24h: -0.0105,
        priceChangePercentage24h: -2.14,
        marketCap: 16900000000,
        volume24h: 487000000,
        rank: 5,
        logoColor: "#0033ad",
        updatedAt: new Date(),
      },
      {
        id: "polygon",
        name: "Polygon",
        symbol: "MATIC",
        price: 0.9347,
        priceChange24h: 0.0384,
        priceChangePercentage24h: 4.28,
        marketCap: 8700000000,
        volume24h: 342000000,
        rank: 6,
        logoColor: "#8247e5",
        updatedAt: new Date(),
      },
      {
        id: "avalanche",
        name: "Avalanche",
        symbol: "AVAX",
        price: 37.62,
        priceChange24h: -0.70,
        priceChangePercentage24h: -1.83,
        marketCap: 14100000000,
        volume24h: 523000000,
        rank: 7,
        logoColor: "#e84142",
        updatedAt: new Date(),
      },
      {
        id: "chainlink",
        name: "Chainlink",
        symbol: "LINK",
        price: 14.92,
        priceChange24h: 0.38,
        priceChangePercentage24h: 2.61,
        marketCap: 8900000000,
        volume24h: 412000000,
        rank: 8,
        logoColor: "#375bd2",
        updatedAt: new Date(),
      }
    ];

    mockCryptos.forEach(crypto => {
      this.cryptocurrencies.set(crypto.id, crypto);
    });

    this.marketStatsData = {
      id: randomUUID(),
      totalMarketCap: 2310000000000,
      totalVolume24h: 89200000000,
      btcDominance: 52.3,
      activeCryptos: 13205,
      marketCapChange24h: 2.4,
      updatedAt: new Date(),
    };
  }

  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    // Simulate slight price variations for real-time feel
    const cryptos = Array.from(this.cryptocurrencies.values());
    return cryptos.map(crypto => ({
      ...crypto,
      price: crypto.price * (1 + (Math.random() - 0.5) * 0.001), // ±0.05% variation
      updatedAt: new Date(),
    }));
  }

  async getCryptocurrency(id: string): Promise<Cryptocurrency | undefined> {
    return this.cryptocurrencies.get(id);
  }

  async updateCryptocurrency(id: string, data: Partial<InsertCryptocurrency>): Promise<Cryptocurrency | undefined> {
    const existing = this.cryptocurrencies.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.cryptocurrencies.set(id, updated);
    return updated;
  }

  async getMarketStats(): Promise<MarketStats | undefined> {
    if (!this.marketStatsData) return undefined;
    
    // Simulate slight variations
    return {
      ...this.marketStatsData,
      totalMarketCap: this.marketStatsData.totalMarketCap * (1 + (Math.random() - 0.5) * 0.001),
      totalVolume24h: this.marketStatsData.totalVolume24h * (1 + (Math.random() - 0.5) * 0.002),
      updatedAt: new Date(),
    };
  }

  async updateMarketStats(data: InsertMarketStats): Promise<MarketStats> {
    const stats: MarketStats = {
      id: randomUUID(),
      ...data,
      updatedAt: new Date(),
    };
    this.marketStatsData = stats;
    return stats;
  }
}

export const storage = new MemStorage();
