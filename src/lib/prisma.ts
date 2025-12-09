import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Use DATABASE_URL but strip parameters to avoid driver confusion
const originalUrl = process.env.DATABASE_URL!;
let connectionString = originalUrl;
let hostname = 'localhost';

try {
  const url = new URL(originalUrl);
  // Remove query parameters like pgbouncer=true
  url.search = '';
  connectionString = url.toString();
  hostname = url.hostname;

  console.log(`Connecting to DB: ${url.hostname} as ${url.username}`);
} catch (e) {
  console.warn('Failed to parse/clean connection string:', e);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
    servername: hostname // Ensure SNI is sent for Supabase Pooler
  },
})
const adapter = new PrismaPg(pool)

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma