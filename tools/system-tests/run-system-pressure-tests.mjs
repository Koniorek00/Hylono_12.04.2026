#!/usr/bin/env node
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";

/** @typedef {{id:string, group:string, status:'PASS'|'WARN'|'FAIL', ms:number, detail:string}} TestResult */

function runCmd(command) {
  const started = performance.now();
  try {
    const output = execSync(command, { stdio: "pipe", encoding: "utf8" });
    return { ok: true, output, ms: performance.now() - started };
  } catch (error) {
    const msg = error instanceof Error ? String(error.message) : "Unknown error";
    const stdout = /** @type {{stdout?: string}} */ (error).stdout ?? "";
    const stderr = /** @type {{stderr?: string}} */ (error).stderr ?? "";
    return { ok: false, output: `${msg}\n${stdout}\n${stderr}`.trim(), ms: performance.now() - started };
  }
}

/** @type {TestResult[]} */
const results = [];

function pushResult(id, group, outcome, detail = "", statusOverride) {
  results.push({
    id,
    group,
    status: statusOverride ?? (outcome.ok ? "PASS" : "FAIL"),
    ms: Math.round(outcome.ms),
    detail: detail || outcome.output.split("\n").slice(0, 2).join(" | "),
  });
}

const smokePnpm = runCmd("where pnpm 2>&1");
pushResult(
  "SMOKE-001",
  "smoke",
  smokePnpm,
  smokePnpm.ok
    ? "direct pnpm resolution"
    : "direct pnpm shim missing (fallback expected)",
  smokePnpm.ok ? "PASS" : "WARN",
);

const smokeCorepack = runCmd("where corepack 2>&1");
pushResult("SMOKE-002", "smoke", smokeCorepack, "corepack resolution");

const fallbackVersion = runCmd("corepack pnpm --version 2>&1");
pushResult("RESILIENCE-001", "resilience", fallbackVersion, "corepack pnpm runtime availability");

const policyBiome = runCmd("corepack pnpm exec biome check . 2>&1");
pushResult("POLICY-001", "policy", policyBiome, "biome check with fallback runtime");

const perfBuild = runCmd("corepack pnpm build 2>&1");
pushResult("PERF-001", "performance", perfBuild, "full build via fallback runtime");

const perfTest = runCmd("corepack pnpm test 2>&1");
pushResult("PERF-002", "performance", perfTest, "test suite via fallback runtime");

mkdirSync("reports", { recursive: true });

const passed = results.filter((r) => r.status === "PASS").length;
const warned = results.filter((r) => r.status === "WARN").length;
const failed = results.filter((r) => r.status === "FAIL").length;
const weighted = passed + warned * 0.7;
const score = Math.max(0, Math.min(100, Math.round((weighted / results.length) * 100)));

const lines = [
  "# System Reliability Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Score: ${score}/100`,
  `Passed: ${passed}/${results.length}`,
  `Warnings: ${warned}`,
  `Failed: ${failed}`,
  "",
  "## Results",
  "",
  "| ID | Group | Status | Duration (ms) | Detail |",
  "|---|---|---|---:|---|",
  ...results.map((r) => `| ${r.id} | ${r.group} | ${r.status} | ${r.ms} | ${r.detail.replaceAll("|", "\\|")} |`),
  "",
  "## Interpretation",
  "",
  failed === 0
    ? warned === 0
      ? "All pressure tests passed. Agent runtime/tool access is fully operational."
      : "No hard failures. Runtime is operational with fallback-based warnings that are acceptable but can be optimized."
    : "Some tests failed. Investigate failed rows and apply remediations before next cycle.",
  "",
  "## Recommended Command",
  "",
  "Use fallback-safe verification when needed:",
  "`corepack pnpm check`",
];

writeFileSync("reports/system-reliability-report.md", `${lines.join("\n")}\n`, "utf8");

if (failed > 0) {
  process.exitCode = 1;
}
