#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const targets = [
  ".agent/modes/system-architect.md",
  ".agent/skills/system-architect/SKILL.md",
];

for (const path of targets) {
  const content = readFileSync(path, "utf8");
  const normalized = content
    .replaceAll("pnpm build + biome check", "pnpm/corepack verification checks")
    .replaceAll("pnpm build`, `pnpm exec biome check .`", "pnpm build`, `pnpm exec biome check .` (fallback: `corepack pnpm build`, `corepack pnpm exec biome check .`)");

  if (normalized !== content) {
    writeFileSync(path, normalized, "utf8");
  }
}

console.log("auto-fix-toolchain completed");
