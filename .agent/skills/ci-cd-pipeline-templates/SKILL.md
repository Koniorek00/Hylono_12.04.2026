# SKILL: CI/CD Pipeline Templates (pnpm + Next.js)
**Used by**: devops-deploy

## CI Principles
- Use pnpm consistently across pipeline steps
- Build/test gates before deployment
- Keep staging and production parity
- Keep rollback path documented and fast

## GitHub Actions Baseline
```yaml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec biome check .
      - run: pnpm test
      - run: pnpm build
```

## Deployment Checklist
- `pnpm build` passes
- `pnpm test` passes
- Biome check passes
- Required env vars set in target environment
- DB migrations applied safely
- Health checks pass post-deploy

## Secrets + Compliance
- Never commit secrets
- Use platform secret managers only
- Redact PII from monitoring payloads
- Keep EU-region data/compliance constraints intact

## Rollback Rule
- Rollback target under 5 minutes
- Keep last known good release available
- Record incident summary after rollback
