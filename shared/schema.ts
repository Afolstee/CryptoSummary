import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  price: real("price").notNull(),
  priceChange24h: real("price_change_24h").notNull(),
  priceChangePercentage24h: real("price_change_percentage_24h").notNull(),
  marketCap: real("market_cap").notNull(),
  volume24h: real("volume_24h").notNull(),
  rank: integer("rank").notNull(),
  logoColor: text("logo_color").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketStats = pgTable("market_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalMarketCap: real("total_market_cap").notNull(),
  totalVolume24h: real("total_volume_24h").notNull(),
  btcDominance: real("btc_dominance").notNull(),
  activeCryptos: integer("active_cryptos").notNull(),
  marketCapChange24h: real("market_cap_change_24h").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCryptocurrencySchema = createInsertSchema(cryptocurrencies);
export const insertMarketStatsSchema = createInsertSchema(marketStats);

export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;
export type InsertCryptocurrency = z.infer<typeof insertCryptocurrencySchema>;
export type MarketStats = typeof marketStats.$inferSelect;
export type InsertMarketStats = z.infer<typeof insertMarketStatsSchema>;
