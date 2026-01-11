import 'dotenv/config';

// Simplified config for drizzle-kit v0.18.1
// Full configuration with dialect and dbCredentials would be:
// - dialect/driver: 'pg' or 'postgresql'
// - dbCredentials: { connectionString: process.env.DATABASE_URL }
// However, this older version has different API requirements
export default {
  out: './drizzle',
  schema: './db/schema.ts',
};
