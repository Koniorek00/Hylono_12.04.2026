#!/usr/bin/env node

/**
 * Audit tooling guardrail verifier.
 *
 * Ensures mandatory tooling channels required by site-audit governance are enabled:
 * - semgrep-mcp
 * - biomcp
 *
 * This script is intentionally lightweight and deterministic for CI/local parity.
 */

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const mcpPath = path.join(projectRoot, '.mcp.json');

const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exit(1);
};

const pass = (message) => {
  console.log(`✅ ${message}`);
};

if (!fs.existsSync(mcpPath)) {
  fail('Missing .mcp.json required for tooling governance checks.');
}

let parsed;
try {
  const raw = fs.readFileSync(mcpPath, 'utf8');
  parsed = JSON.parse(raw);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown parse error';
  fail(`Unable to parse .mcp.json (${message}).`);
}

const mcpServers = parsed?.mcpServers;
if (!mcpServers || typeof mcpServers !== 'object') {
  fail('Invalid .mcp.json shape: missing mcpServers object.');
}

/** @type {Array<{ key: string; label: string }>} */
const requiredServers = [
  { key: 'semgrep-mcp', label: 'Semgrep MCP' },
  { key: 'biomcp', label: 'BioMCP' },
];

for (const server of requiredServers) {
  const config = mcpServers[server.key];
  if (!config || typeof config !== 'object') {
    fail(`${server.label} entry is missing in .mcp.json.`);
  }

  if (config.disabled !== false) {
    fail(`${server.label} must be enabled (set "disabled": false).`);
  }
}

pass('Mandatory audit tooling MCP channels are enabled (semgrep-mcp, biomcp).');
