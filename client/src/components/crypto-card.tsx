import { Cryptocurrency } from "@shared/schema";
import { cryptoService } from "@/services/crypto-service";

interface CryptoCardProps {
  cryptocurrency: Cryptocurrency;
}

export default function CryptoCard({ cryptocurrency }: CryptoCardProps) {
  const isPositive = cryptocurrency.priceChangePercentage24h >= 0;

  return (
    <div 
      className="crypto-card bg-card border border-border rounded-lg p-6 hover:border-primary/50"
      data-testid={`crypto-card-${cryptocurrency.id}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: cryptocurrency.logoColor }}
            data-testid={`crypto-logo-${cryptocurrency.id}`}
          >
            {cryptocurrency.symbol.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground" data-testid={`crypto-name-${cryptocurrency.id}`}>
              {cryptocurrency.name}
            </h4>
            <p className="text-sm text-muted-foreground" data-testid={`crypto-symbol-${cryptocurrency.id}`}>
              {cryptocurrency.symbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground" data-testid={`crypto-rank-${cryptocurrency.id}`}>
            #{cryptocurrency.rank}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div 
          className="trend-indicator text-2xl font-bold text-foreground" 
          data-testid={`crypto-price-${cryptocurrency.id}`}
        >
          {cryptoService.formatPrice(cryptocurrency.price)}
        </div>
        <div className="flex items-center justify-between">
          <span 
            className={`text-sm font-medium ${isPositive ? 'price-change-positive' : 'price-change-negative'}`}
            data-testid={`crypto-change-${cryptocurrency.id}`}
          >
            {cryptoService.formatPercentage(cryptocurrency.priceChangePercentage24h)}
          </span>
          <span 
            className="text-sm text-muted-foreground trend-indicator"
            data-testid={`crypto-market-cap-${cryptocurrency.id}`}
          >
            {cryptoService.formatMarketCap(cryptocurrency.marketCap)}
          </span>
        </div>
      </div>
    </div>
  );
}
