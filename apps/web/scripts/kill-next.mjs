import { execSync } from "child_process";

try {
  execSync('pkill -f "next dev" 2>/dev/null; pkill -f "next-server" 2>/dev/null; true', {
    shell: "/bin/bash",
    stdio: "ignore",
  });
  execSync('lsof -ti:3000,3001 2>/dev/null | xargs -r kill -9 2>/dev/null; true', {
    shell: "/bin/bash",
    stdio: "ignore",
  });
} catch {
  // no running processes
}
