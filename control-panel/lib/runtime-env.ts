import fs from "node:fs";
import path from "node:path";

let cachedRuntimeEnv: Record<string, string> | null = null;

function parseEnvFile(raw: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key) {
      result[key] = value;
    }
  }

  return result;
}

export function getRuntimeEnv(): Record<string, string> {
  if (cachedRuntimeEnv) {
    return cachedRuntimeEnv;
  }

  const rootDir = path.resolve(process.cwd(), "..");
  const candidates = [
    path.join(rootDir, ".env"),
    path.join(rootDir, ".env.local"),
    path.join(rootDir, ".env.example"),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) {
      continue;
    }

    cachedRuntimeEnv = parseEnvFile(fs.readFileSync(candidate, "utf-8"));
    return cachedRuntimeEnv;
  }

  cachedRuntimeEnv = {};
  return cachedRuntimeEnv;
}
