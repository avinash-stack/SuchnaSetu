import fs from "fs";
import pg from "pg";

const envContent = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val;
  }
});

const connectionString = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || env.DATABASE_URL || process.env.DATABASE_URL;

async function runMigration() {
  if (!connectionString) {
    console.log("ℹ️ No direct Postgres URL configured in .env.local; please apply supabase/migrations/20260926000000_career_resources.sql in the Supabase Dashboard SQL Editor.");
    return;
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log("Connected to PostgreSQL database...");

  const sql = fs.readFileSync(
    "supabase/migrations/20260926000000_career_resources.sql",
    "utf8"
  );

  console.log("Applying Career Resources Schema Migration...");
  await client.query(sql);
  console.log("✅ Career Resources Schema Migration applied successfully!");
  await client.end();
}

runMigration().catch((err) => {
  console.error("Migration error:", err.message);
});
