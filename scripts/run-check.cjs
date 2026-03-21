#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const commands = [
  {
    command: 'node',
    args: ['scripts/verify-audit-tooling.cjs'],
  },
  {
    command: 'node',
    args: ['scripts/check-page-decisions.cjs'],
  },
  {
    command: 'node',
    args: ['scripts/check-component-registry-parity.cjs'],
  },
  {
    command: 'node',
    args: ['scripts/check-structured-data-governance.cjs'],
  },
  {
    command: 'node',
    args: ['scripts/check-marketing-token-drift.cjs'],
  },
  {
    command: 'biome',
    args: ['check', '.'],
    usePnpmExec: true,
  },
  {
    command: 'next',
    args: ['build'],
    usePnpmExec: true,
    env: {
      NEXT_DIST_DIR: '.next-check',
    },
  },
  {
    command: 'vitest',
    args: ['run'],
    usePnpmExec: true,
  },
];

for (const step of commands) {
  const isWindows = process.platform === 'win32';
  const executable = step.usePnpmExec
    ? (isWindows ? 'cmd.exe' : 'pnpm')
    : step.command;
  const args = step.usePnpmExec
    ? (isWindows
        ? ['/d', '/s', '/c', `pnpm exec ${step.command} ${step.args.join(' ')}`]
        : ['exec', step.command, ...step.args])
    : step.args;

  const result = spawnSync(executable, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...step.env,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
