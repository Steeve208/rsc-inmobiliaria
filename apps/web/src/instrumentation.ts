export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { logProductionEnvWarnings } = await import("@/lib/env/production-config");
    logProductionEnvWarnings("startup");
  }
}
