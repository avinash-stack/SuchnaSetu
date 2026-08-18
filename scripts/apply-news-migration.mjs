import fs from "fs";
import pg from "pg";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const connectionString = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing database connection string in .env.local");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  await client.connect();
  console.log("Connected to PostgreSQL database...");

  const sql = fs.readFileSync(
    "supabase/migrations/20260820000000_news_sources_and_sync.sql",
    "utf8"
  );

  console.log("Applying News Sources & Schema Migration...");
  await client.query(sql);
  console.log("✅ News Sources & Schema Migration applied successfully!");

  await client.end();
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
