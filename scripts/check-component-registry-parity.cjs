#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const registryPath = path.join(projectRoot, '.agent', 'registry', 'components.md');

if (!fs.existsSync(registryPath)) {
  console.error('Missing registry file: .agent/registry/components.md');
  process.exit(1);
}

const registryContent = fs.readFileSync(registryPath, 'utf8');
const lines = registryContent.split(/\r?\n/);

/** @type {Array<{component: string; componentPath: string; runtime: string}>} */
const rows = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) {
    continue;
  }

  if (trimmed.includes('---') || trimmed.includes('Component | Path | Server/Client')) {
    continue;
  }

  const columns = trimmed
    .split('|')
    .slice(1, -1)
    .map((column) => column.trim());

  if (columns.length < 3) {
    continue;
  }

  const [component, componentPath, runtime] = columns;

  if (!component || !componentPath || (runtime !== 'Client' && runtime !== 'Server')) {
    continue;
  }

  rows.push({ component, componentPath, runtime });
}

const mismatches = [];
let checked = 0;

/** @param {string} componentPath */
const isClientHeuristicPath = (componentPath) => {
  const normalized = componentPath.replace(/\\/g, '/');
  return (
    normalized.includes('/hooks/') ||
    normalized.endsWith('Client.tsx') ||
    normalized.endsWith('Client.ts')
  );
};

for (const row of rows) {
  const absolutePath = path.join(projectRoot, row.componentPath);
  if (!fs.existsSync(absolutePath)) {
    mismatches.push(`${row.component}: file missing (${row.componentPath})`);
    continue;
  }

  if (!/\.(ts|tsx|js|jsx)$/.test(row.componentPath)) {
    continue;
  }

  const source = fs.readFileSync(absolutePath, 'utf8');
  const header = source.split(/\r?\n/).slice(0, 30).join('\n');
  const hasUseClientDirective = /^\s*['"]use client['"];?/m.test(header);

  checked += 1;

  if (row.runtime === 'Client' && !hasUseClientDirective && !isClientHeuristicPath(row.componentPath)) {
    mismatches.push(
      `${row.component}: registry says Client but no explicit client marker found (${row.componentPath})`,
    );
  }

  if (row.runtime === 'Server' && hasUseClientDirective) {
    mismatches.push(
      `${row.component}: registry says Server but file is client-marked (${row.componentPath})`,
    );
  }
}

if (mismatches.length > 0) {
  console.error('Component registry parity check failed:');
  for (const mismatch of mismatches) {
    console.error(`- ${mismatch}`);
  }
  process.exit(1);
}

console.log(`Component registry parity verified across ${checked} source entries.`);