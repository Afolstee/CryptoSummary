import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import MarketStats from "@/components/market-stats";
import CryptoCard from "@/components/crypto-card";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Cryptocurrency } from "@shared/schema";

export default function Dashboard() {
  const { data: cryptocurrencies, isLoading, error } = useQuery<Cryptocurrency[]>({
    queryKey: ['/api/cryptocurrencies'],
    refetchInterval: 10000, // Refetch every 10 seconds for real-time feel
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/cryptocurrencies'] });
    queryClient.invalidateQueries({ queryKey: ['/api/market-stats'] });
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview Section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1" data-testid="page-title">
                Market Overview
              </h2>
              <p className="text-muted-foreground" data-testid="page-subtitle">
                Real-time cryptocurrency prices and trends
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                data-testid="refresh-button"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <select 
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="timeframe-select"
              >
                <option value="24h">24h</option>
                <option value="7d">7d</option>
                <option value="30d">30d</option>
              </select>
            </div>
          </div>

          <MarketStats />
        </section>

        {/* Crypto Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground" data-testid="crypto-grid-title">
              Top Cryptocurrencies
            </h3>
            <button 
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              data-testid="view-all-link"
            >
              View All →
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-destructive mb-2">Failed to Load Data</h3>
              <p className="text-destructive text-sm mb-4" data-testid="crypto-error-message">
                Unable to fetch cryptocurrency data. Please check your connection and try again.
              </p>
              <Button 
                onClick={handleRefresh}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                data-testid="retry-button"
              >
                Try Again
              </Button>
            </div>
          ) : !cryptocurrencies || cryptocurrencies.length === 0 ? (
            <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
              <p className="text-muted-foreground text-sm" data-testid="no-data-message">
                No cryptocurrency data is currently available. Please try refreshing the page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="crypto-grid">
              {cryptocurrencies.map((crypto: Cryptocurrency) => (
                <CryptoCard key={crypto.id} cryptocurrency={crypto} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 mt-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">₿</span>
                </div>
                <span className="text-sm text-muted-foreground" data-testid="copyright">
                  CryptoTracker © 2024
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span data-testid="update-frequency">Data updates every 10 seconds</span>
                <span>•</span>
                <span data-testid="api-status">API Ready Architecture</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
