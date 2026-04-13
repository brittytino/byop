import fs from "node:fs";
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

const schemaPath = path.join(rootDir, "db", "schema.sql");

if (!fs.existsSync(schemaPath)) {
  console.error(`Schema file not found at ${schemaPath}`);
  process.exit(1);
}

const schemaText = fs.readFileSync(schemaPath, "utf8");
const statements = schemaText
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

if (statements.length === 0) {
  console.error("No SQL statements found in db/schema.sql");
  process.exit(1);
}

const sql = neon(databaseUrl);

try {
  for (const statement of statements) {
    await sql(statement);
  }

  console.log("Database setup completed successfully.");
  console.log("Run npm run db:check to verify required tables.");
} catch (error) {
  console.error("Failed to apply schema.sql", error);
  process.exit(1);
}
