import { useQuery } from "@tanstack/react-query";
import { cryptoService } from "@/services/crypto-service";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketStats as MarketStatsType } from "@shared/schema";

export default function MarketStats() {
  const { data: marketStats, isLoading, error } = useQuery<MarketStatsType>({
    queryKey: ['/api/market-stats'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !marketStats) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
        <p className="text-destructive text-sm" data-testid="error-message">
          Failed to load market statistics. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-border rounded-lg p-4" data-testid="stat-total-market-cap">
        <div className="text-sm text-muted-foreground mb-1">Total Market Cap</div>
        <div className="text-xl font-bold text-foreground trend-indicator">
          {cryptoService.formatMarketCap(marketStats.totalMarketCap)}
        </div>
        <div className={`text-sm ${marketStats.marketCapChange24h >= 0 ? 'price-change-positive' : 'price-change-negative'}`}>
          {cryptoService.formatPercentage(marketStats.marketCapChange24h)}
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-4" data-testid="stat-24h-volume">
        <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
        <div className="text-xl font-bold text-foreground trend-indicator">
          {cryptoService.formatMarketCap(marketStats.totalVolume24h)}
        </div>
        <div className="text-sm text-muted-foreground">Trading</div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-4" data-testid="stat-btc-dominance">
        <div className="text-sm text-muted-foreground mb-1">BTC Dominance</div>
        <div className="text-xl font-bold text-foreground trend-indicator">
          {marketStats.btcDominance.toFixed(1)}%
        </div>
        <div className="text-sm text-muted-foreground">Market share</div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-4" data-testid="stat-active-cryptos">
        <div className="text-sm text-muted-foreground mb-1">Active Cryptos</div>
        <div className="text-xl font-bold text-foreground trend-indicator">
          {marketStats.activeCryptos.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">Live tracking</div>
      </div>
    </div>
  );
}
