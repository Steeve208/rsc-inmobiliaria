#!/usr/bin/env npx tsx
/**
 * Verifica variables de entorno de producción.
 * Uso: npm run env:check
 * Sale con código 1 si faltan variables críticas; 0 si solo hay advertencias opcionales.
 *
 * Carga .env y .env.local (como Next.js) para validar el entorno local / pre-deploy.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  getProductionEnvWarnings,
  isSupabaseStorageConfigured,
} from "../src/lib/env/production-config";

const critical = ["DATABASE_URL", "BETTER_AUTH_SECRET"];

function loadEnvFile(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Do not override vars already provided by the shell / CI / Vercel.
    if (!process.env[key]?.trim()) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

function main() {
  const warnings = getProductionEnvWarnings({ assumeProduction: true });
  const criticalMissing = warnings.filter((w) =>
    critical.some((key) => w.variable.includes(key)),
  );

  console.log("RSC Market — production environment check\n");

  if (warnings.length === 0) {
    console.log("OK — all checked integrations are configured.");
    console.log(`Storage (listing-media): ${isSupabaseStorageConfigured() ? "yes" : "no"}`);
    process.exit(0);
  }

  for (const w of warnings) {
    const level = critical.some((key) => w.variable.includes(key)) ? "CRITICAL" : "WARN";
    console.log(`[${level}] ${w.feature} — ${w.variable}`);
    console.log(`        ${w.message}\n`);
  }

  if (criticalMissing.length > 0) {
    console.error(`${criticalMissing.length} critical variable(s) missing.`);
    process.exit(1);
  }

  console.log(`${warnings.length} optional warning(s). App can start but some features are degraded.`);
  process.exit(0);
}

main();
