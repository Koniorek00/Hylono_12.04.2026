import { getServices } from "@/lib/manifest";
import { getRuntimeEnv } from "@/lib/runtime-env";

export type FirstLoginMode = "env-ready" | "setup-wizard" | "signup" | "manual";
export type OnboardingPriority = "start-here" | "later" | "advanced";

export interface FirstLoginEntry {
  id: string;
  name: string;
  url?: string;
  mode: FirstLoginMode;
  priority: OnboardingPriority;
  order: number;
  firstAction: string;
  usernameLabel?: string;
  usernameValue?: string;
  passwordLabel?: string;
  passwordValue?: string;
  notes: string;
}

export interface OperatorCredentialEntry {
  id: string;
  name: string;
  endpoint: string;
  usernameLabel?: string;
  usernameValue?: string;
  passwordLabel?: string;
  passwordValue?: string;
  commandLabel?: string;
  command?: string;
  notes: string;
}

function serviceUrl(id: string): string | undefined {
  return getServices().find((service) => service.id === id)?.uiUrl;
}

export function getFirstLoginEntries(): FirstLoginEntry[] {
  const env = getRuntimeEnv();

  return [
    {
      id: "minio",
      name: "MinIO Console",
      url: serviceUrl("minio"),
      mode: "env-ready",
      priority: "later",
      order: 7,
      firstAction: "Sign in only if you need object storage administration.",
      usernameLabel: "Username",
      usernameValue: env.MINIO_ROOT_USER,
      passwordLabel: "Password",
      passwordValue: env.MINIO_ROOT_PASSWORD,
      notes: "Ready-to-use local admin login. This is the one browser-facing service in the stack with fixed credentials from .env.",
    },
    {
      id: "uptime-kuma",
      name: "Uptime Kuma",
      url: serviceUrl("uptime-kuma"),
      mode: "env-ready",
      priority: "start-here",
      order: 1,
      firstAction: "Open the UI and sign in with the local operator account to inspect monitors, incidents, and status pages.",
      usernameLabel: "Username",
      usernameValue: "Hylono",
      passwordLabel: "Password",
      passwordValue: "HylonoKuma123!",
      notes: "Local Uptime Kuma now has a predictable operator login, a seeded monitor set for the browser-facing services in this stack, and a published status page at http://localhost:3002/status/hylono-local.",
    },
    {
      id: "lago",
      name: "Lago",
      url: serviceUrl("lago"),
      mode: "env-ready",
      priority: "later",
      order: 8,
      firstAction: "Open the browser UI and sign in with the local operator account to inspect the seeded demo customer, billable metric, and plan before changing billing configuration.",
      usernameLabel: "Email",
      usernameValue: "wiktormyszor@proton.me",
      passwordLabel: "Password",
      passwordValue: "HylonoLagoAdmin123!",
      notes: "Local Lago now has a predictable operator login that lands on the real analytics dashboard. The current local runtime also includes a deterministic demo organization, customer, billable metric, and plan baseline for billing checks.",
    },
    {
      id: "snipe-it",
      name: "Snipe-IT",
      url: serviceUrl("snipe-it"),
      mode: "env-ready",
      priority: "start-here",
      order: 2,
      firstAction: "Open the login screen and sign in with the local operator account to manage inventory, people, and admin settings.",
      usernameLabel: "Username",
      usernameValue: "Koniorek",
      passwordLabel: "Password",
      passwordValue: "HylonoSnipe123!",
      notes: "Local Snipe-IT now has an activated operator account that lands on the dashboard. The setup wizard is no longer required in this stack.",
    },
    {
      id: "calcom",
      name: "Cal.com",
      url: serviceUrl("calcom"),
      mode: "env-ready",
      priority: "start-here",
      order: 3,
      firstAction: "Open the event types view and sign in with the local operator account to review the default schedule, weekday availability, and seeded event pages.",
      usernameLabel: "Email",
      usernameValue: "wiktormyszor@proton.me",
      passwordLabel: "Password",
      passwordValue: "HylonoCalAdmin123!",
      notes: "Local Cal.com now has a predictable operator login, a default operator schedule, weekday availability, three seeded baseline event types, and a public booking page under /hylono. External calendar connections and outbound booking webhooks still remain manual.",
    },
    {
      id: "twenty",
      name: "Twenty CRM",
      url: serviceUrl("twenty"),
      mode: "env-ready",
      priority: "start-here",
      order: 4,
      firstAction: "Open the UI and sign in with the local operator account, then manage people, companies, and deals from the seeded workspace.",
      usernameLabel: "Email",
      usernameValue: "wiktormyszor@proton.me",
      passwordLabel: "Password",
      passwordValue: "HylonoTwenty123!",
      notes: "Local Twenty now has a predictable operator login, a seeded Hylono Operations workspace layer with canonical operator contacts, queue opportunities, and follow-up tasks, plus an API key that the web app uses for local CRM sync.",
    },
    {
      id: "documenso",
      name: "Documenso",
      url: serviceUrl("documenso"),
      mode: "env-ready",
      priority: "start-here",
      order: 5,
      firstAction: "Open the documents workspace and sign in with the local operator account to manage templates, inbox, and document drafts.",
      usernameLabel: "Email",
      usernameValue: "wiktormyszor@proton.me",
      passwordLabel: "Password",
      passwordValue: "HylonoDocAdmin123!",
      notes: "Local Documenso now has working backend auth, a dedicated secondary encryption key, a local signing certificate, and a verified operator account that lands in the documents workspace without email delivery.",
    },
    {
      id: "zitadel",
      name: "Zitadel",
      url: `${serviceUrl("zitadel")}?login_hint=root@zitadel.localhost`,
      mode: "env-ready",
      priority: "advanced",
      order: 10,
      firstAction: "Open the console, keep the prefilled login hint, and sign in with the seeded local root admin account.",
      usernameLabel: "Username",
      usernameValue: "root@zitadel.localhost",
      passwordLabel: "Password",
      passwordValue: env.ZITADEL_BOOTSTRAP_PASSWORD || "Check .env",
      notes: "Local Zitadel now runs with the self-hosted login v2 flow and a seeded root admin. The bootstrap password is read from .env instead of being hardcoded in compose.",
    },
    {
      id: "novu",
      name: "Novu Dashboard",
      url: serviceUrl("novu"),
      mode: "env-ready",
      priority: "later",
      order: 9,
      firstAction: "Open the dashboard and sign in with the local operator account to inspect subscribers, workflows, and delivery setup.",
      usernameLabel: "Email",
      usernameValue: "wiktormyszor@proton.me",
      passwordLabel: "Password",
      passwordValue: "HylonoNovu123!",
      notes: "Local Novu now has a predictable operator login, a published in-app workflow, a Development API secret, and canonical operator subscribers for ops, support, and contact. The Hylono web app uses it for subscriber sync plus live intake notifications.",
    },
    {
      id: "n8n",
      name: "n8n",
      url: serviceUrl("n8n"),
      mode: "env-ready",
      priority: "start-here",
      order: 6,
      firstAction: "Open the browser UI and sign in with the local operator account to manage workflows and executions.",
      usernameLabel: "Email",
      usernameValue: "wiktormyszor@proton.me",
      passwordLabel: "Password",
      passwordValue: "HylonoN8N123!",
      notes: "Local n8n now has a predictable operator login, the five versioned intake workflows organized into the Core folder, and tags for the local Phase 2 intake slice.",
    },
    {
      id: "medusa",
      name: "Medusa Admin",
      url: serviceUrl("medusa"),
      mode: "env-ready",
      priority: "later",
      order: 11,
      firstAction: "Open the Medusa login screen and sign in with the seeded local admin user to inspect the baseline catalog, regions, stock locations, and publishable storefront key.",
      usernameLabel: "Email",
      usernameValue: "admin@hylono.local",
      passwordLabel: "Password",
      passwordValue: "Admin123!",
      notes: "Local admin assets are bundled correctly, a seeded browser admin user exists, and the current local runtime includes a starter catalog, multiple regions, stock locations, and a publishable storefront key. Backend JWT and cookie secrets in .env remain infrastructure-only.",
    },
  ];
}

export function getOperatorCredentialEntries(): OperatorCredentialEntry[] {
  const env = getRuntimeEnv();

  return [
    {
      id: "postgres-root",
      name: "PostgreSQL root access",
      endpoint: "localhost:5432",
      usernameLabel: "Username",
      usernameValue: "postgres",
      passwordLabel: "Password",
      passwordValue: env.POSTGRES_ROOT_PASSWORD,
      commandLabel: "Open psql shell",
      command: "docker exec -it hylono-postgres psql -U postgres",
      notes: "Use with psql, app connection strings, or docker exec. This is not a browser login.",
    },
    {
      id: "redis-root",
      name: "Redis root access",
      endpoint: "localhost:6379",
      passwordLabel: "Password",
      passwordValue: env.REDIS_PASSWORD,
      commandLabel: "Open redis-cli",
      command: `docker exec -it hylono-redis redis-cli -a ${env.REDIS_PASSWORD}`,
      notes: "Use with redis-cli or application clients. Redis does not expose a normal browser UI.",
    },
    {
      id: "mongo-root",
      name: "MongoDB root access",
      endpoint: "localhost:27017",
      usernameLabel: "Username",
      usernameValue: "hylono",
      passwordLabel: "Password",
      passwordValue: env.MONGO_ROOT_PASSWORD,
      commandLabel: "Open mongosh",
      command: `docker exec -it hylono-mongo mongosh -u hylono -p ${env.MONGO_ROOT_PASSWORD} --authenticationDatabase admin`,
      notes: "Use with mongosh or Mongo clients. Opening :27017 in a browser is expected to produce a protocol mismatch message.",
    },
    {
      id: "minio-api",
      name: "MinIO S3 API access",
      endpoint: "localhost:9000",
      usernameLabel: "Access key",
      usernameValue: env.MINIO_ROOT_USER,
      passwordLabel: "Secret key",
      passwordValue: env.MINIO_ROOT_PASSWORD,
      commandLabel: "Example mc alias command",
      command: `mc alias set local http://localhost:9000 ${env.MINIO_ROOT_USER} ${env.MINIO_ROOT_PASSWORD}`,
      notes: "Use for S3-compatible clients and for Novu object storage integration.",
    },
    {
      id: "snipeit-db",
      name: "Snipe-IT MariaDB user",
      endpoint: "docker: hylono-snipe-it-db:3306",
      usernameLabel: "Username",
      usernameValue: "snipeit",
      passwordLabel: "Password",
      passwordValue: env.SNIPEIT_DB_PASSWORD,
      commandLabel: "Open MariaDB shell",
      command: `docker exec -it hylono-snipe-it-db mariadb -usnipeit -p${env.SNIPEIT_DB_PASSWORD} snipeit_db`,
      notes: "Used by Snipe-IT inside Docker. Host port is not published by default.",
    },
    {
      id: "twenty-api",
      name: "Twenty CRM REST API",
      endpoint: env.TWENTY_API_BASE_URL || "http://localhost:8107/rest",
      passwordLabel: "Bearer API key",
      passwordValue: env.TWENTY_API_KEY,
      commandLabel: "List local people",
      command: env.TWENTY_API_KEY
        ? `Invoke-RestMethod -Headers @{ Authorization = 'Bearer ${env.TWENTY_API_KEY}' } -Uri '${env.TWENTY_API_BASE_URL || "http://localhost:8107"}/rest/people?limit=10'`
        : undefined,
      notes: "Used by the local Hylono web app to sync contact, booking, newsletter, and checkout identities into Twenty.",
    },
    {
      id: "medusa-store-api",
      name: "Medusa Store API",
      endpoint: "http://localhost:8100/store",
      commandLabel: "Read the latest publishable key",
      command:
        "docker exec -i hylono-postgres psql -U postgres -d medusa_db -At -c \"select token from api_key where type = 'publishable' order by created_at desc limit 1;\"",
      notes: "Use the publishable API key for local storefront probes and smoke checks. The launcher keeps the local demo catalog seeded, but this key still remains the correct storefront auth primitive.",
    },
    {
      id: "lago-api",
      name: "Lago REST API",
      endpoint: "http://localhost:18102/api/v1",
      commandLabel: "Read the latest Lago API token",
      command:
        "docker exec -i hylono-postgres psql -U postgres -d lago_db -At -c \"select value from api_keys order by created_at desc limit 1;\"",
      notes: "Use the Lago API token for local billing automation and smoke checks. The launcher seeds the demo customer, metric, and plan, but the token remains the proper operator auth for further API work.",
    },
    {
      id: "novu-api",
      name: "Novu Development API",
      endpoint: env.NOVU_API_BASE_URL || "http://localhost:18110",
      passwordLabel: "API secret",
      passwordValue: env.NOVU_API_SECRET,
      commandLabel: "Trigger local workflow smoke test",
      command: env.NOVU_API_SECRET
        ? `$body = @{ name = '${env.NOVU_WORKFLOW_ID || "powiadomienia"}'; to = @{ subscriberId = 'hylono-smoke-test' }; payload = @{ title = 'Smoke test'; message = 'Novu local workflow smoke test'; source = 'operator:smoke-test' } } | ConvertTo-Json -Depth 5; Invoke-RestMethod -Method Post -Headers @{ Authorization = 'ApiKey ${env.NOVU_API_SECRET}'; 'Content-Type' = 'application/json' } -Body $body -Uri '${env.NOVU_API_BASE_URL || "http://localhost:18110"}/v1/events/trigger'`
        : undefined,
      notes: "Used by the local Hylono web app to keep Novu subscriber profiles in sync and to trigger the published local intake workflow for contact, booking, newsletter, and checkout events.",
    },
  ];
}
