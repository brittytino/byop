import { neon } from "@neondatabase/serverless";

type TableRow = {
  table_name: string;
};

const REQUIRED_TABLES = ["users", "portfolios", "projects"] as const;

let dbClient: ReturnType<typeof neon> | null = null;
let schemaCheckPromise: Promise<void> | null = null;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured. Add it to .env.local or your deployment environment."
    );
  }

  return databaseUrl;
}

export function getDbClient() {
  if (!dbClient) {
    dbClient = neon(getDatabaseUrl());
  }

  return dbClient;
}

async function validateSchema() {
  const client = getDbClient();
  const rows = (await client`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
  `) as TableRow[];

  const existingTables = new Set(rows.map((row) => row.table_name));
  const missingTables = REQUIRED_TABLES.filter((table) => !existingTables.has(table));

  if (missingTables.length > 0) {
    console.error("[db] Missing required tables.", {
      missingTables,
      hint: "Run `npm run db:setup` or execute db/schema.sql in Neon SQL editor."
    });

    throw new Error(
      `Database schema incomplete. Missing tables: ${missingTables.join(", ")}. Run db/schema.sql first.`
    );
  }
}

export async function ensureSchemaReady() {
  if (process.env.SKIP_DB_SCHEMA_CHECK === "true") {
    return;
  }

  if (!schemaCheckPromise) {
    schemaCheckPromise = validateSchema().catch((error) => {
      schemaCheckPromise = null;
      throw error;
    });
  }

  await schemaCheckPromise;
}

export async function sql<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  await ensureSchemaReady();
  const client = getDbClient();
  return (await client(strings, ...values)) as T[];
}
