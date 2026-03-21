#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const command = process.argv[2] || 'status';
const port = Number(process.env.PREVIEW_PORT || 3000);

function findPidByPort(targetPort) {
  if (process.platform !== 'win32') {
    return null;
  }

  const result = spawnSync('cmd.exe', ['/d', '/s', '/c', `netstat -ano | findstr :${targetPort}`], {
    encoding: 'utf8',
  });

  if (result.status !== 0 || !result.stdout.trim()) {
    return null;
  }

  const line = result.stdout
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry.includes(`:${targetPort}`) && entry.includes('LISTENING'));

  if (!line) {
    return null;
  }

  const parts = line.split(/\s+/);
  const pid = Number.parseInt(parts[parts.length - 1] || '', 10);

  return Number.isFinite(pid) ? pid : null;
}

function status() {
  const pid = findPidByPort(port);
  if (!pid) {
    console.log(`Preview is stopped on port ${port}.`);
    return;
  }

  console.log(`Preview is running on http://127.0.0.1:${port} (pid ${pid}).`);
}

function stop() {
  const pid = findPidByPort(port);
  if (!pid) {
    console.log(`Preview is already stopped on port ${port}.`);
    return;
  }

  if (process.platform === 'win32') {
    spawnSync('powershell.exe', ['-NoProfile', '-Command', `Stop-Process -Id ${pid} -Force`], {
      stdio: 'ignore',
    });
  } else {
    process.kill(pid, 'SIGTERM');
  }

  console.log(`Stopped preview on port ${port} (pid ${pid}).`);
}

if (command === 'status') {
  status();
} else if (command === 'stop') {
  stop();
} else {
  console.error(`Unknown preview port command: ${command}`);
  process.exit(1);
}
