import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Parse the connection string to extract credentials and project ref
// Format: postgresql://[user].[ref]:[password]@[host]:[port]/[db]...
const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL!;
let connectionString = dbUrl;

try {
  const url = new URL(dbUrl);
  // If we are using the pooler host (aws-1-...), try to switch to the direct db host
  if (url.hostname.includes('pooler.supabase.com')) {
    const parts = url.username.split('.');
    if (parts.length === 2) {
      const [user, ref] = parts;
      // Construct standard direct URL: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
      connectionString = `postgresql://${user}:${url.password}@db.${ref}.supabase.co:5432${url.pathname}`;
      console.log('Switched to constructed direct connection string');
    }
  }
} catch (e) {
  console.warn('Failed to parse connection string, using original:', e);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Allow self-signed certs
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