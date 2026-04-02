const fs = require("node:fs");
const path = require("node:path");

const from = process.argv[2];
const to = process.argv[3];

if (!from || !to) {
  console.error("Usage: node replace-placeholder.cjs <from> <to>");
  process.exit(1);
}

if (from === to) {
  console.log(`Nothing to replace, the value is already set to ${to}.`);
  process.exit(0);
}

const roots = [
  "/calcom/apps/web/.next",
  "/calcom/apps/web/public",
];

const fromBuf = Buffer.from(from);
const toBuf = Buffer.from(to);

function replaceAll(buffer, search, replacement) {
  const parts = [];
  let start = 0;
  let index = buffer.indexOf(search, start);
  let replacements = 0;

  while (index !== -1) {
    parts.push(buffer.subarray(start, index));
    parts.push(replacement);
    start = index + search.length;
    replacements += 1;
    index = buffer.indexOf(search, start);
  }

  if (replacements === 0) {
    return { buffer, replacements };
  }

  parts.push(buffer.subarray(start));
  return { buffer: Buffer.concat(parts), replacements };
}

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

console.log(`Replacing all statically built instances of ${from} with ${to}.`);

for (const root of roots) {
  for (const file of walk(root)) {
    const original = fs.readFileSync(file);
    if (original.indexOf(fromBuf) === -1) {
      continue;
    }

    const { buffer, replacements } = replaceAll(original, fromBuf, toBuf);
    if (replacements === 0) {
      continue;
    }

    fs.writeFileSync(file, buffer);
    console.log(`Updated ${file} (${replacements} replacements).`);
  }
}
