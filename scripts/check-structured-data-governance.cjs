#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const canonicalStructuredDataPath = path.join(projectRoot, 'src/components/StructuredData.tsx');
const appDir = path.join(projectRoot, 'app');

const fail = (message) => {
  console.error(`Structured data governance check failed: ${message}`);
  process.exit(1);
};

const walk = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      return [fullPath];
    }

    return [];
  });
};

if (!fs.existsSync(canonicalStructuredDataPath)) {
  fail('Missing canonical server JSON-LD component at src/components/StructuredData.tsx.');
}

const canonicalSource = fs.readFileSync(canonicalStructuredDataPath, 'utf8');
if (!canonicalSource.includes('await headers()')) {
  fail('Canonical StructuredData component must await headers() to support nonce propagation.');
}

if (!canonicalSource.includes('safeJsonStringify')) {
  fail('Canonical StructuredData component must centralize JSON serialization via safeJsonStringify.');
}

if (!(canonicalSource.includes('replace(/</g') && canonicalSource.includes('\\u003c'))) {
  fail('Canonical StructuredData component must escape "<" in JSON payloads.');
}

const appFiles = walk(appDir);
const violations = [];
let structuredDataUsageCount = 0;

const importStatementPattern = /from\s+['"]([^'"]+)['"]/g;

for (const filePath of appFiles) {
  const source = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');

  const imports = [...source.matchAll(importStatementPattern)].map((match) => match[1] ?? '');

  const legacyImports = imports.filter(
    (specifier) =>
      specifier.endsWith('/components/StructuredData') &&
      !specifier.endsWith('/src/components/StructuredData')
  );

  if (legacyImports.length > 0) {
    violations.push(`${relativePath}: imports legacy components/StructuredData entrypoint.`);
  }

  const canonicalImports = imports.filter((specifier) =>
    specifier.endsWith('/src/components/StructuredData')
  );
  structuredDataUsageCount += canonicalImports.length;

  if (source.includes('type="application/ld+json"') && !source.includes('<StructuredData')) {
    violations.push(`${relativePath}: defines inline ld+json script instead of centralized StructuredData component.`);
  }
}

if (structuredDataUsageCount === 0) {
  fail('No app routes are using the canonical StructuredData server component.');
}

if (violations.length > 0) {
  fail(`\n- ${violations.join('\n- ')}`);
}

console.log(`Structured data governance check passed (${structuredDataUsageCount} route modules use canonical component).`);
