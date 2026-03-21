#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectRoot = process.cwd();
const previewBuildId = path.join(projectRoot, '.next-preview', 'BUILD_ID');
const nextBin = require.resolve('next/dist/bin/next');
const port = String(process.env.PREVIEW_PORT || 3000);

if (!fs.existsSync(previewBuildId)) {
  const buildResult = spawnSync(process.execPath, [path.join(projectRoot, 'scripts', 'preview-build.cjs')], {
    stdio: 'inherit',
    cwd: projectRoot,
    env: process.env,
  });

  if (buildResult.status !== 0) {
    process.exit(buildResult.status ?? 1);
  }
}

const startResult = spawnSync(process.execPath, [nextBin, 'start', '-p', port], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: {
    ...process.env,
    NEXT_DIST_DIR: '.next-preview',
  },
});

process.exit(startResult.status ?? 1);
