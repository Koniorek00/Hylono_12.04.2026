#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const APP_DIR = path.join(process.cwd(), 'app');

/** @param {string} dir */
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name === 'page.tsx') {
      files.push(fullPath);
    }
  }

  return files;
}

const pageFiles = walk(APP_DIR).filter((filePath) => !filePath.includes(`${path.sep}api${path.sep}`));
const missing = [];

for (const pageFile of pageFiles) {
  const content = fs.readFileSync(pageFile, 'utf8');
  if (!content.includes('[DECISION:')) {
    missing.push(path.relative(process.cwd(), pageFile).replace(/\\/g, '/'));
  }
}

if (missing.length > 0) {
  console.error('Missing [DECISION:] annotation in:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log(`Decision annotations verified across ${pageFiles.length} page routes.`);
