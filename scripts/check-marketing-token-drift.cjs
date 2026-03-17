#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();

const TARGET_PATHS = [
  'components/home',
  'components/TestimonialsPage.tsx',
  'components/Home.tsx',
  'components/TechDetail.tsx',
];

const FILE_EXTENSIONS = new Set(['.ts', '.tsx']);

const VIOLATION_PATTERNS = [
  {
    key: 'hex-color-literal',
    regex: /#[0-9a-fA-F]{3,8}/g,
    reason: 'Hardcoded hex colors bypass shared palette tokens',
  },
  {
    key: 'rgba-color-literal',
    regex: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g,
    reason: 'Hardcoded rgb/rgba colors bypass shared palette tokens',
  },
];

/** @param {string} currentPath */
function collectFiles(currentPath) {
  const absolutePath = path.join(projectRoot, currentPath);
  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) {
    return FILE_EXTENSIONS.has(path.extname(absolutePath)) ? [absolutePath] : [];
  }

  const nested = fs.readdirSync(absolutePath, { withFileTypes: true });
  return nested.flatMap((entry) => {
    const nestedRelativePath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(nestedRelativePath);
    }
    if (FILE_EXTENSIONS.has(path.extname(entry.name))) {
      return [path.join(projectRoot, nestedRelativePath)];
    }
    return [];
  });
}

const files = TARGET_PATHS.flatMap((entry) => collectFiles(entry));
const violations = [];

for (const filePath of files) {
  const source = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const pattern of VIOLATION_PATTERNS) {
      const matches = line.match(pattern.regex);
      if (!matches) {
        continue;
      }

      for (const match of matches) {
        violations.push({
          file: relativePath,
          line: index + 1,
          rule: pattern.key,
          match,
          reason: pattern.reason,
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error('Marketing token drift check failed.');
  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line} [${violation.rule}] ${violation.reason} → ${violation.match}`,
    );
  }
  process.exit(1);
}

console.log(`Marketing token drift check passed for ${files.length} files.`);
