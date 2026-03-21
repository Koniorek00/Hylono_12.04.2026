#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const nextBin = require.resolve('next/dist/bin/next');
const result = spawnSync(process.execPath, [nextBin, 'build'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: {
    ...process.env,
    NEXT_DIST_DIR: '.next-preview',
  },
});

process.exit(result.status ?? 1);
