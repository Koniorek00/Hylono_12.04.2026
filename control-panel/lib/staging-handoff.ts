import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const STAGING_TEMPLATE_PATH = path.join(REPO_ROOT, ".env.staging.example");
const STAGING_CANDIDATE_PATH = path.join(REPO_ROOT, ".env.staging");

export type StagingFileStatus = "present" | "missing";

export interface StagingFileCard {
  id: string;
  title: string;
  path: string;
  status: StagingFileStatus;
  purpose: string;
  highlights: string[];
  sizeLabel?: string;
  updatedLabel?: string;
}

export interface StagingHandoffSnapshot {
  fileCards: StagingFileCard[];
  envSummary: StagingEnvSummary;
  launchOrder: string[];
  keepLocal: string[];
  promotionRules: string[];
  acceptanceCriteria: string[];
}

export interface StagingEnvSummary {
  templatePath: string;
  candidatePath: string;
  templateStatus: StagingFileStatus;
  candidateStatus: StagingFileStatus;
  requiredKeyCount: number;
  candidateKeyCount: number;
  missingKeys: string[];
  placeholderKeys: string[];
  urlIssues: string[];
  numericIssues: string[];
  ready: boolean;
}

const FILES = [
  {
    id: "env",
    title: ".env.staging.example",
    relativePath: ".env.staging.example",
    purpose: "Template for staging environment variables and secrets.",
    highlights: ["public URLs", "secret placeholders", "integration hooks"],
  },
  {
    id: "runbook",
    title: "docs/runbooks/local-to-staging.md",
    relativePath: path.join("docs", "runbooks", "local-to-staging.md"),
    purpose: "Promotion rules, launch order, rollback boundaries, and exit criteria.",
    highlights: ["promotion order", "rollback", "exit criteria"],
  },
  {
    id: "checklist",
    title: "docs/runbooks/staging-launch-checklist.md",
    relativePath: path.join("docs", "runbooks", "staging-launch-checklist.md"),
    purpose: "Operator checklist for infrastructure, app layer, and cutover verification.",
    highlights: ["infrastructure", "app layer", "verification"],
  },
  {
    id: "contract",
    title: "deploy/staging/stack-contract.md",
    relativePath: path.join("deploy", "staging", "stack-contract.md"),
    purpose: "URL contract for public surfaces and internal-only boundaries on staging.",
    highlights: ["public URLs", "internal-only", "acceptance criteria"],
  },
] as const;

function formatBytes(value: number) {
  if (value < 1024) {
    return `${value} bytes`;
  }

  const kb = value / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function parseEnvFile(relativePath: string) {
  const result = new Map<string, string>();
  if (!fs.existsSync(relativePath)) {
    return result;
  }

  for (const line of fs.readFileSync(relativePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key) {
      result.set(key, value);
    }
  }

  return result;
}

function isPlaceholderLikeValue(key: string, value: string | undefined) {
  if (!value || !value.trim()) {
    return true;
  }

  const normalized = value.trim();
  if (/^(REPLACE_WITH|CHANGE_ME|TODO|FIXME|YOUR_|<.+>)/.test(normalized)) {
    return true;
  }

  if (normalized === "staging-minio-admin") {
    return true;
  }

  if (/(PASSWORD|SECRET|TOKEN|PASSPHRASE|MASTERKEY|API_KEY|ACCESS_TOKEN_SECRET|LOGIN_TOKEN_SECRET|ENCRYPTION_KEY|RSA_PRIVATE_KEY_BASE64|CRON_API_KEY)/i.test(key)) {
    if (normalized.length < 24) {
      return true;
    }

    if (/(placeholder|sample|example|replace_with|change_me|local-safe|console|in-app)/i.test(normalized)) {
      return true;
    }
  }

  return false;
}

function getUrlIssue(key: string, value: string | undefined) {
  if (!value || !value.trim()) {
    return "missing";
  }

  const normalized = value.trim();
  if (!/^https:\/\//i.test(normalized)) {
    return "must use https://";
  }

  if (/(localhost|127\.0\.0\.1)/i.test(normalized)) {
    return "must not point at localhost";
  }

  return null;
}

function getPositiveIntegerIssue(value: string | undefined) {
  if (!value || !value.trim()) {
    return "missing";
  }

  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return "must be greater than zero";
  }

  return null;
}

function describeFile(relativePath: string, purpose: string, highlights: string[], id: string): StagingFileCard {
  const absolutePath = path.join(REPO_ROOT, relativePath);
  const exists = fs.existsSync(absolutePath);
  const stat = exists ? fs.statSync(absolutePath) : null;

  return {
    id,
    title: relativePath,
    path: absolutePath,
    status: exists ? "present" : "missing",
    purpose,
    highlights,
    sizeLabel: stat ? formatBytes(stat.size) : undefined,
    updatedLabel: stat ? formatDate(stat.mtime) : undefined,
  };
}

export function getStagingHandoffSnapshot(): StagingHandoffSnapshot {
  const fileCards = FILES.map((file) =>
    describeFile(file.relativePath, file.purpose, [...file.highlights], file.id)
  );
  const templateEnv = parseEnvFile(STAGING_TEMPLATE_PATH);
  const candidateEnv = parseEnvFile(STAGING_CANDIDATE_PATH);
  const requiredKeys = [...templateEnv.keys()].sort();
  const missingKeys: string[] = [];
  const placeholderKeys: string[] = [];
  const urlIssues: string[] = [];
  const numericIssues: string[] = [];
  const urlKeyPattern = /(^|_)(URL|BASE_URL|PUBLIC_URL)$/;
  const numericKeyPattern = /TIMEOUT_MS$/i;

  for (const key of requiredKeys) {
    const candidate = candidateEnv.get(key);
    if (!candidate || !candidate.trim()) {
      missingKeys.push(key);
      continue;
    }

    if (urlKeyPattern.test(key)) {
      const issue = getUrlIssue(key, candidate);
      if (issue) {
        urlIssues.push(`${key}: ${issue}`);
      }
    }

    if (numericKeyPattern.test(key)) {
      const issue = getPositiveIntegerIssue(candidate);
      if (issue) {
        numericIssues.push(`${key}: ${issue}`);
      }
    }

    if (isPlaceholderLikeValue(key, candidate)) {
      placeholderKeys.push(key);
    }
  }

  return {
    fileCards,
    envSummary: {
      templatePath: STAGING_TEMPLATE_PATH,
      candidatePath: STAGING_CANDIDATE_PATH,
      templateStatus: fs.existsSync(STAGING_TEMPLATE_PATH) ? "present" : "missing",
      candidateStatus: fs.existsSync(STAGING_CANDIDATE_PATH) ? "present" : "missing",
      requiredKeyCount: requiredKeys.length,
      candidateKeyCount: candidateEnv.size,
      missingKeys,
      placeholderKeys,
      urlIssues,
      numericIssues,
      ready:
        fs.existsSync(STAGING_TEMPLATE_PATH) &&
        fs.existsSync(STAGING_CANDIDATE_PATH) &&
        missingKeys.length === 0 &&
        placeholderKeys.length === 0 &&
        urlIssues.length === 0 &&
        numericIssues.length === 0,
    },
    launchOrder: [
      "Prepare DNS and TLS.",
      "Provision `.env.staging` from the example template and fill every placeholder.",
      "Start infrastructure first.",
      "Start the Phase 1A app layer.",
      "Apply safe staging-only bootstrap data.",
      "Run a full smoke check through the staging proxy.",
      "Cut traffic only after verification is green.",
    ],
    keepLocal: [
      "Desktop launcher and local recovery scripts.",
      "Local operator credentials and test-only secrets.",
      "Any hardcoded `localhost` URLs.",
      "Local test data that should not be visible to real users.",
    ],
    promotionRules: [
      "Do not reuse local `.env` values unchanged.",
      "Do not reuse local operator passwords for public users.",
      "Keep database ports private.",
      "Expose only the browser-facing URLs in the contract.",
      "Treat `n8n`, `Twenty`, and `Novu` as integration backbones, not end-user products.",
    ],
    acceptanceCriteria: [
      "All public URLs resolve on the staging host.",
      "Uptime Kuma reports the browser-facing URLs as healthy.",
      "`n8n` receives the intake webhooks.",
      "`Twenty` receives contacts and follow-ups.",
      "`Novu` syncs subscribers and triggers the published workflow.",
    ],
  };
}
