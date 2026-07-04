#!/usr/bin/env npx tsx
/**
 * Verifica variables de entorno de producción.
 * Uso: npm run env:check
 * Sale con código 1 si faltan variables críticas; 0 si solo hay advertencias opcionales.
 */
import {
  getProductionEnvWarnings,
  isSupabaseStorageConfigured,
} from "../src/lib/env/production-config";

const critical = ["DATABASE_URL", "BETTER_AUTH_SECRET"];

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
