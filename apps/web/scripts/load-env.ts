import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Load .env then .env.local (same precedence as Next.js for local scripts). */
export function loadEnvFiles() {
  for (const fileName of [".env", ".env.local"]) {
    const filePath = resolve(process.cwd(), fileName);
    if (!existsSync(filePath)) continue;

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
      if (!process.env[key]?.trim()) {
        process.env[key] = value;
      }
    }
  }
}
