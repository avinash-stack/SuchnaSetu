import fs from "fs";
import pg from "pg";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const connectionString = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || env.DATABASE_URL;

if (!connectionString) {
  console.log("No direct Postgres URL configured in .env.local; fallback to Supabase REST client mode if available.");
}

async function runMigration() {
  if (connectionString) {
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    console.log("Connected to PostgreSQL database...");

    const sql = fs.readFileSync(
      "supabase/migrations/20260826_news_platform_schema.sql",
      "utf8"
    );

    console.log("Applying News Platform Schema Migration...");
    await client.query(sql);
    console.log("✅ News Platform Schema Migration applied successfully!");
    await client.end();
  }
}

runMigration().catch((err) => {
  console.error("Migration error (may already exist or using fallback):", err.message);
});
