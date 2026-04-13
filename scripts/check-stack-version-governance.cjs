#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const envFiles = ['.env.example', '.env.staging.example'];
const requiredEnvKeys = [
  'REDIS_IMAGE_TAG',
  'MONGO_IMAGE_TAG',
  'UPTIME_KUMA_IMAGE_TAG',
  'CALCOM_IMAGE_TAG',
  'TWENTY_IMAGE_TAG',
  'NOVU_IMAGE_TAG',
  'N8N_IMAGE_TAG',
];

const requiredSnippets = [
  {
    file: 'docker/infrastructure/docker-compose.yml',
    snippet: 'image: redis:${REDIS_IMAGE_TAG:-7.4.8-alpine}',
  },
  {
    file: 'docker/infrastructure/docker-compose.yml',
    snippet: 'image: mongo:${MONGO_IMAGE_TAG:-7.0.31}',
  },
  {
    file: 'docker/infrastructure/docker-compose.yml',
    snippet: 'image: louislam/uptime-kuma:${UPTIME_KUMA_IMAGE_TAG:-2.2.1}',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: calcom.docker.scarf.sh/calcom/cal.com:${CALCOM_IMAGE_TAG:-v6.2.0}',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: twentycrm/twenty:${TWENTY_IMAGE_TAG:-v1.21.0}',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: ghcr.io/novuhq/novu/api:${NOVU_IMAGE_TAG:-3.14.0}',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: ghcr.io/novuhq/novu/worker:${NOVU_IMAGE_TAG:-3.14.0}',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: ghcr.io/novuhq/novu/ws:${NOVU_IMAGE_TAG:-3.14.0}',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: ghcr.io/novuhq/novu/dashboard:${NOVU_IMAGE_TAG:-3.14.0}',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: n8nio/n8n:${N8N_IMAGE_TAG:-2.15.1}',
  },
];

const advisoryImagePatterns = [
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: documenso/documenso:latest',
    message:
      'Documenso is still on :latest. Keep it conditional until version and legal requirements are re-verified.',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: ghcr.io/zitadel/zitadel:latest',
    message:
      'Zitadel is still on :latest. Pin it only after the internal-tools-first identity decision and image-tag verification.',
  },
  {
    file: 'docker/phase-1a/docker-compose.yml',
    snippet: 'image: ghcr.io/zitadel/zitadel-login:latest',
    message:
      'zitadel-login is still on :latest. Keep it out of the default staging wave until the tag and deployment path are verified.',
  },
  {
    file: 'docker/infrastructure/docker-compose.yml',
    snippet: 'image: minio/minio:latest',
    message:
      'MinIO remains intentionally unpinned here because product direction and licensing still require a separate decision.',
  },
];

const errors = [];
const advisories = [];

for (const envFile of envFiles) {
  const content = read(envFile);

  for (const key of requiredEnvKeys) {
    if (!content.includes(`${key}=`)) {
      errors.push(`${envFile} is missing ${key}.`);
    }
  }
}

for (const requirement of requiredSnippets) {
  const content = read(requirement.file);
  if (!content.includes(requirement.snippet)) {
    errors.push(
      `${requirement.file} is missing the pinned image rule: ${requirement.snippet}`
    );
  }
}

for (const advisory of advisoryImagePatterns) {
  const content = read(advisory.file);
  if (content.includes(advisory.snippet)) {
    advisories.push(advisory.message);
  }
}

if (errors.length > 0) {
  console.error('Stack version governance check failed.\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Stack version governance check passed.');

if (advisories.length > 0) {
  console.warn('\nAdvisories:');
  for (const advisory of advisories) {
    console.warn(`- ${advisory}`);
  }
}
