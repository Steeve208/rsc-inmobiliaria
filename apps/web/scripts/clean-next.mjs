import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const target = path.resolve(".next");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeNextDir() {
  if (!fs.existsSync(target)) {
    console.log("✓ .next already clean");
    return;
  }

  // Best effort on exFAT/NTFS: Node rmSync with retries
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
      if (!fs.existsSync(target)) {
        console.log("✓ .next removed");
        return;
      }
    } catch {
      // fall through to shell rm
    }
    await sleep(300 * attempt);
  }

  // Shell fallback for stubborn external drives
  try {
    execSync(`rm -rf "${target}"`, { stdio: "ignore" });
  } catch {
  }

  if (fs.existsSync(target)) {
    try {
      execSync(`find "${target}" -mindepth 1 -delete && rmdir "${target}"`, {
        stdio: "ignore",
      });
    } catch {
    }
  }

  if (fs.existsSync(target)) {
    throw new Error("Could not fully remove .next — stop all dev servers and retry.");
  }

  console.log("✓ .next removed");
}

removeNextDir().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
