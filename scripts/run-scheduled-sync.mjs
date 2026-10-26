#!/usr/bin/env node

/**
 * SuchnaSetu Ingestion Runner (Node.js / GitHub Actions Entry Point)
 * 
 * Executes scheduled and dispatched data synchronization directly on the GitHub Actions runner.
 * Offloads compute-heavy scraping and AI enrichment completely off Cloudflare Workers.
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsRunner = path.resolve(__dirname, "run-scheduled-sync.ts");

const args = [tsRunner, ...process.argv.slice(2)];

const isWin = process.platform === "win32";
const executable = isWin ? "npx.cmd" : "npx";

const child = spawn(executable, ["tsx", ...args], {
  stdio: "inherit",
  env: process.env,
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});

child.on("error", (err) => {
  console.error("❌ Failed to launch tsx sync runner:", err);
  process.exit(1);
});
