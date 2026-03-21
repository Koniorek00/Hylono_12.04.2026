import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const OUTPUT_ROOT = path.join(REPO_ROOT, "output");
const LAUNCHER_FILES = [
  path.join(REPO_ROOT, "start-dev.bat"),
  path.join(REPO_ROOT, "scripts", "launch-local-stack.ps1"),
  path.join(REPO_ROOT, "scripts", "smoke-local-stack.ps1"),
];
const DOCUMENSO_CERT_PATH = path.join(OUTPUT_ROOT, "documenso-signing", "certificate.p12");
const NOVU_BOOTSTRAP_PATH = path.join(OUTPUT_ROOT, "novu-bootstrap", "operator-bootstrap-state.json");
const N8N_LATEST_BACKUP_PATH = path.join(OUTPUT_ROOT, "n8n-backups", "phase2-local-latest");
const SNIPEIT_BOOTSTRAP_PATH = path.join(OUTPUT_ROOT, "snipeit-bootstrap", "operator-baseline-state.json");
const MEDUSA_BOOTSTRAP_PATH = path.join(OUTPUT_ROOT, "medusa-bootstrap", "operator-baseline-state.json");
const CALCOM_BOOTSTRAP_PATH = path.join(OUTPUT_ROOT, "calcom-bootstrap", "operator-baseline-state.json");
const ENV_PATH = path.join(REPO_ROOT, ".env");
const ENV_LOCAL_PATH = path.join(REPO_ROOT, ".env.local");

export type BootstrapStatus = "complete" | "partial" | "manual" | "unknown";

export interface BootstrapStat {
  exists: boolean;
  path: string;
  label: string;
  evidence: string;
  status: BootstrapStatus;
  meta: string[];
}

export interface OperatorBootstrapNotification {
  email: string;
  notifiedAt: string;
  previouslyExisted: boolean;
  role: string;
}

export interface BootstrapSnapshot {
  launcher: BootstrapStat;
  documensoCertificate: BootstrapStat;
  novuBootstrap: BootstrapStat;
  n8nBackup: BootstrapStat;
  snipeitBaseline: BootstrapStat;
  medusaCatalog: BootstrapStat;
  calcomBaseline: BootstrapStat;
  mailProvider: BootstrapStat;
  operatorNotifications: OperatorBootstrapNotification[];
}

interface NovuBootstrapState {
  notifications?: Record<string, OperatorBootstrapNotification>;
}

interface SnipeitBootstrapState {
  counts?: {
    locations?: number;
    manufacturers?: number;
    categories?: number;
    models?: number;
    assets?: number;
  };
  asset?: {
    tag?: string;
  };
}

interface MedusaBootstrapState {
  canonicalProduct?: {
    title?: string;
    handle?: string;
    status?: string;
    exists?: boolean;
  };
  counts?: {
    products?: number;
    regions?: number;
    stockLocations?: number;
    publishableKeys?: number;
    adminUsers?: number;
  };
}

interface CalcomBootstrapState {
  operator?: {
    email?: string;
    username?: string;
  };
  schedule?: {
    id?: number;
    name?: string;
    availabilityWindows?: Array<unknown>;
  };
  eventTypes?: Array<{
    title?: string;
    hidden?: boolean;
    publicPath?: string | null;
  }>;
}

function fileExists(filePath: string) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function safeReadJson<T>(filePath: string): T | null {
  try {
    if (!fileExists(filePath)) {
      return null;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeStat(filePath: string): fs.Stats | null {
  try {
    if (!fileExists(filePath)) {
      return null;
    }

    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

function readEnvMap() {
  const entries = new Map<string, string>();

  for (const filePath of [ENV_PATH, ENV_LOCAL_PATH]) {
    if (!fileExists(filePath)) {
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex <= 0) {
        continue;
      }

      entries.set(trimmed.slice(0, separatorIndex).trim(), trimmed.slice(separatorIndex + 1).trim());
    }
  }

  return entries;
}

function formatDate(value: Date | number | null | undefined) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function getLauncherStat(): BootstrapStat {
  const launcherExists = LAUNCHER_FILES.every(fileExists);
  return {
    exists: launcherExists,
    path: LAUNCHER_FILES[0],
    label: "Desktop launcher baseline",
    evidence: launcherExists
      ? "The launcher and replay scripts are present in the repo and ready to restore the local operator stack."
      : "One or more launcher scripts are missing from the local checkout.",
    status: launcherExists ? "complete" : "partial",
    meta: LAUNCHER_FILES.map((filePath) => path.relative(REPO_ROOT, filePath)),
  };
}

function getDocumensoCertificateStat(): BootstrapStat {
  const stats = safeStat(DOCUMENSO_CERT_PATH);
  return {
    exists: Boolean(stats),
    path: DOCUMENSO_CERT_PATH,
    label: "Documenso signing certificate",
    evidence: stats
      ? "A local signing certificate is already generated for the Documenso bootstrap."
      : "No local signing certificate was found yet.",
    status: stats ? "complete" : "manual",
    meta: stats
      ? [
          `${Math.round(stats.size)} bytes`,
          stats.mtime ? `updated ${formatDate(stats.mtime)}` : "",
        ].filter((value): value is string => Boolean(value))
      : ["Generate via scripts/generate-documenso-signing-certificate.ps1"],
  };
}

function getNovuBootstrapStat(): BootstrapStat & { notifications: OperatorBootstrapNotification[] } {
  const state = safeReadJson<NovuBootstrapState>(NOVU_BOOTSTRAP_PATH);
  const notifications = state?.notifications ? Object.values(state.notifications) : [];
  return {
    exists: notifications.length > 0,
    path: NOVU_BOOTSTRAP_PATH,
    label: "Novu operator bootstrap",
    evidence:
      notifications.length > 0
        ? `The local bootstrap state already recorded ${notifications.length} seeded operator recipient(s).`
        : "No seeded Novu operator recipients were found in the local bootstrap state.",
    status: notifications.length > 0 ? "complete" : "manual",
    meta: notifications.length > 0 ? notifications.map((item) => `${item.role}: ${item.email}`) : [],
    notifications: notifications.sort((left, right) => left.role.localeCompare(right.role)),
  };
}

function getN8nBackupStat(): BootstrapStat {
  const backupStat = safeStat(N8N_LATEST_BACKUP_PATH);
  let fileCount = 0;
  let snapshotFiles: string[] = [];

  if (backupStat?.isDirectory()) {
    try {
      snapshotFiles = fs
        .readdirSync(N8N_LATEST_BACKUP_PATH)
        .filter((entry) => entry.endsWith(".json"))
        .sort((left, right) => left.localeCompare(right));
      fileCount = snapshotFiles.length;
    } catch {
      snapshotFiles = [];
      fileCount = 0;
    }
  }

  return {
    exists: Boolean(backupStat) && fileCount > 0,
    path: N8N_LATEST_BACKUP_PATH,
    label: "n8n phase 2 backup snapshot",
    evidence:
      fileCount > 0
        ? `The latest local n8n backup snapshot contains ${fileCount} workflow export(s), including the current Phase 2 intake bundle.`
        : "The latest local n8n backup snapshot is missing or empty.",
    status: fileCount > 0 ? "complete" : "partial",
    meta:
      fileCount > 0
        ? [
            `${fileCount} workflow export(s)`,
            snapshotFiles.slice(0, 3).join(", "),
          ].filter((value): value is string => Boolean(value))
        : ["Re-run the n8n reconcile seed."],
  };
}

function getSnipeitBaselineStat(): BootstrapStat {
  const state = safeReadJson<SnipeitBootstrapState>(SNIPEIT_BOOTSTRAP_PATH);
  const counts = state?.counts;
  const hasBaseline = Boolean(
    counts &&
      (counts.locations ?? 0) > 0 &&
      (counts.manufacturers ?? 0) > 0 &&
      (counts.categories ?? 0) > 0 &&
      (counts.models ?? 0) > 0 &&
      (counts.assets ?? 0) > 0
  );

  return {
    exists: hasBaseline,
    path: SNIPEIT_BOOTSTRAP_PATH,
    label: "Snipe-IT operator baseline",
    evidence: hasBaseline
      ? `The seeded Snipe-IT operator inventory baseline is present, including asset ${state?.asset?.tag ?? "HBOT-001"}.`
      : "No Snipe-IT operator baseline state was found yet.",
    status: hasBaseline ? "complete" : "manual",
    meta: counts
      ? [
          `locations ${counts.locations ?? 0}`,
          `manufacturers ${counts.manufacturers ?? 0}`,
          `categories ${counts.categories ?? 0}`,
          `models ${counts.models ?? 0}`,
          `assets ${counts.assets ?? 0}`,
        ]
      : ["Seed via scripts/seed-snipeit-operator-baseline.ps1"],
  };
}

function getMedusaCatalogStat(): BootstrapStat {
  const state = safeReadJson<MedusaBootstrapState>(MEDUSA_BOOTSTRAP_PATH);
  const canonicalProduct = state?.canonicalProduct;
  const counts = state?.counts;
  const hasBaseline = Boolean(canonicalProduct?.exists);

  return {
    exists: hasBaseline,
    path: MEDUSA_BOOTSTRAP_PATH,
    label: "Medusa catalog baseline",
    evidence: hasBaseline
      ? `The Medusa operator catalog baseline is present, including canonical product ${canonicalProduct?.title ?? "unknown"}.`
      : "No Medusa catalog baseline state was found yet.",
    status: hasBaseline ? "complete" : "manual",
    meta: counts
      ? [
          `products ${counts.products ?? 0}`,
          `regions ${counts.regions ?? 0}`,
          `stock locations ${counts.stockLocations ?? 0}`,
          `publishable keys ${counts.publishableKeys ?? 0}`,
          `admin users ${counts.adminUsers ?? 0}`,
        ]
      : ["Seed via scripts/seed-medusa-local-catalog.ps1"],
  };
}

function getCalcomBaselineStat(): BootstrapStat {
  const state = safeReadJson<CalcomBootstrapState>(CALCOM_BOOTSTRAP_PATH);
  const publicEvents =
    state?.eventTypes?.filter((entry) => entry.hidden === false && Boolean(entry.publicPath)) ?? [];
  const hasBaseline = Boolean(state?.schedule?.id) && publicEvents.length > 0;

  return {
    exists: hasBaseline,
    path: CALCOM_BOOTSTRAP_PATH,
    label: "Cal.com operator baseline",
    evidence: hasBaseline
      ? `The Cal.com operator baseline is present with schedule ${state?.schedule?.name ?? "unknown"} and ${publicEvents.length} public event types.`
      : "No Cal.com operator baseline state was found yet.",
    status: hasBaseline ? "complete" : "manual",
    meta: [
      state?.operator?.username ? `operator ${state.operator.username}` : null,
      state?.schedule?.id ? `schedule ${state.schedule.id}` : null,
      state?.eventTypes ? `event types ${state.eventTypes.length}` : null,
      publicEvents.length > 0 ? `public events ${publicEvents.length}` : null,
    ].filter((value): value is string => Boolean(value)),
  };
}

function getMailProviderStat(): BootstrapStat {
  const envMap = readEnvMap();
  const profile = envMap.get("MAIL_PROVIDER_PROFILE") || "local-safe";
  const appMode = envMap.get("MAIL_APP_MODE") || "console";
  const novuEmailMode = envMap.get("NOVU_EMAIL_MODE") || "in-app";
  const hasNovuSecret = Boolean(envMap.get("NOVU_API_SECRET"));
  const hasResend = Boolean(envMap.get("RESEND_API_KEY"));
  const hasSmtp =
    Boolean(envMap.get("SMTP_HOST")) &&
    Boolean(envMap.get("SMTP_PORT")) &&
    Boolean(envMap.get("SMTP_USER")) &&
    Boolean(envMap.get("SMTP_PASSWORD"));
  const hasNovuSmtp =
    Boolean(envMap.get("NOVU_SMTP_HOST")) &&
    Boolean(envMap.get("NOVU_SMTP_PORT")) &&
    Boolean(envMap.get("NOVU_SMTP_USER")) &&
    Boolean(envMap.get("NOVU_SMTP_PASSWORD"));

  const status: BootstrapStatus =
    profile === "local-safe"
      ? hasNovuSecret
        ? "complete"
        : "partial"
      : profile === "resend-novu"
        ? hasNovuSecret && hasResend && (novuEmailMode === "in-app" || hasNovuSmtp)
          ? "complete"
          : "manual"
        : profile === "shared-smtp"
          ? hasNovuSecret && hasSmtp && (novuEmailMode === "in-app" || hasNovuSmtp)
            ? "complete"
            : "manual"
          : "manual";

  return {
    exists: status === "complete",
    path: ENV_LOCAL_PATH,
    label: "Mail provider profile",
    evidence:
      status === "complete"
        ? `The current local mail profile is ${profile} with app mode ${appMode} and Novu email mode ${novuEmailMode}.`
        : `The current mail profile is ${profile}, but it still needs an operator decision or missing provider credentials.`,
    status,
    meta: [`profile ${profile}`, `app ${appMode}`, `novu ${novuEmailMode}`],
  };
}

export function getBootstrapSnapshot(): BootstrapSnapshot {
  const novu = getNovuBootstrapStat();

  return {
    launcher: getLauncherStat(),
    documensoCertificate: getDocumensoCertificateStat(),
    novuBootstrap: {
      exists: novu.exists,
      path: novu.path,
      label: novu.label,
      evidence: novu.evidence,
      status: novu.status,
      meta: novu.meta,
    },
    n8nBackup: getN8nBackupStat(),
    snipeitBaseline: getSnipeitBaselineStat(),
    medusaCatalog: getMedusaCatalogStat(),
    calcomBaseline: getCalcomBaselineStat(),
    mailProvider: getMailProviderStat(),
    operatorNotifications: novu.notifications,
  };
}
