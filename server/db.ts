import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Defensive database initialization - only initialize when DATABASE_URL is available
let pool: Pool | null = null;
let db: any = null;

export function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL not set. Database features will be unavailable.");
    return null;
  }

  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
  }
  
  return db;
}

// Lazy initialization - only create connection when actually needed
export function getDatabase() {
  if (!db && process.env.DATABASE_URL) {
    return initializeDatabase();
  }
  return db;
}
