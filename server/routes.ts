import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cryptocurrencies
  app.get("/api/cryptocurrencies", async (req, res) => {
    try {
      const cryptocurrencies = await storage.getCryptocurrencies();
      res.json(cryptocurrencies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cryptocurrencies" });
    }
  });

  // Get specific cryptocurrency
  app.get("/api/cryptocurrencies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cryptocurrency = await storage.getCryptocurrency(id);
      if (!cryptocurrency) {
        return res.status(404).json({ message: "Cryptocurrency not found" });
      }
      res.json(cryptocurrency);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cryptocurrency" });
    }
  });

  // Get market statistics
  app.get("/api/market-stats", async (req, res) => {
    try {
      const marketStats = await storage.getMarketStats();
      if (!marketStats) {
        return res.status(404).json({ message: "Market stats not found" });
      }
      res.json(marketStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
