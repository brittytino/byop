import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Add it to .env.local or .env.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const requiredTables = ["users", "portfolios", "projects"];

try {
  const rows = await sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
  `;

  const existingTables = new Set(rows.map((row) => row.table_name));
  const missing = requiredTables.filter((table) => !existingTables.has(table));

  if (missing.length > 0) {
    console.error("Missing required tables:", missing.join(", "));
    console.error("Run npm run db:setup to create schema.");
    process.exit(1);
  }

  console.log("Schema check passed. Required tables exist:", requiredTables.join(", "));
} catch (error) {
  console.error("Database check failed", error);
  process.exit(1);
}
