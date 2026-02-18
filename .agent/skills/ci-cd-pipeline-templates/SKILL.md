# SKILL: CI/CD Pipeline Templates
**Used by**: devops-deploy

---

## GitHub Actions — Main Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test:unit -- --coverage
      - run: npm run build

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  deploy-staging:
    needs: [quality, e2e]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      # Deploy to staging (Vercel preview or dedicated env)

  deploy-production:
    needs: [quality, e2e]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      # Deploy to production
```

## Environment Strategy
| Environment | Branch | Purpose | Auto-deploy |
|-------------|--------|---------|------------|
| local | any | Development | No |
| preview | any PR | Feature testing | Yes |
| staging | develop | Pre-production | Yes |
| production | main | Live | Yes (after gate) |

## Environment Variables Management
```
# .env.example (committed)
DATABASE_URL=postgresql://user:password@localhost:5432/hylono
STRIPE_SECRET_KEY=sk_test_REPLACE_ME
RESEND_API_KEY=re_REPLACE_ME
NEXTAUTH_SECRET=GENERATE_WITH_OPENSSL_RAND_BASE64_32

# Never commit actual values
# Use platform secrets (Vercel env vars, GitHub secrets)
```

## Deployment Checklist
- [ ] Build passes with zero warnings
- [ ] All tests pass (unit + e2e)
- [ ] TypeScript strict: zero errors
- [ ] Environment variables configured in target environment
- [ ] Database migrations applied before code deploy
- [ ] Health check endpoint returns 200
- [ ] Rollback procedure documented

## Monitoring Setup
```typescript
// Error tracking (Sentry)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Never send PII
  beforeSend: (event) => {
    delete event.user?.email;
    return event;
  }
});
```

## Rollback Procedure
1. Identify bad deploy: Sentry spike, error rate increase, user reports
2. Trigger rollback: `vercel rollback` or redeploy previous commit
3. Target: < 5 minutes from detection to rollback
4. Post-mortem: document in `docs/incidents/`
