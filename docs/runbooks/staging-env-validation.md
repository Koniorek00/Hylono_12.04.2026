# Runbook: Staging Env Validation

Use this before copying the local operator stack to a real staging host.

## Command

```powershell
.\scripts\validate-staging-env.ps1 -Path .\.env.staging
```

## What It Checks

- Every key in [`.env.staging.example`](../../.env.staging.example) is present in the candidate file.
- URL values use `https://` and do not point to `localhost`.
- Secret-like values are not left as scaffold placeholders.
- Timeout values are real positive integers instead of blank or zero-like defaults.

## Why This Exists

The staging scaffold already defines the contract for domains, secrets, and integration hooks. This validator catches the usual failure modes before a host ever sees the stack:

- missing values
- placeholder secrets
- local-only URLs
- malformed staging timeout values

## Expected Use

Run it after you populate `.env.staging` and before you provision or cut over DNS.

If it fails, fix the values in the staging env file and run it again until it passes.
