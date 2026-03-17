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
      mode: "setup-wizard",
      priority: "start-here",
      order: 1,
      firstAction: "Open the UI and create the first local admin account when the wizard appears.",
      notes: "Best first check for a beginner because it confirms the stack is reachable in the browser. No static username/password is stored in .env.",
    },
    {
      id: "lago",
      name: "Lago",
      url: serviceUrl("lago"),
      mode: "signup",
      priority: "later",
      order: 8,
      firstAction: "Open the browser UI and create the first owner account if you want billing flows right now.",
      notes: "Use the signup flow in the browser. Signup is enabled in the local compose file and no seeded owner account is injected from .env.",
    },
    {
      id: "snipe-it",
      name: "Snipe-IT",
      url: serviceUrl("snipe-it"),
      mode: "setup-wizard",
      priority: "start-here",
      order: 2,
      firstAction: "Complete the setup wizard and create the first admin account.",
      notes: "Open the setup wizard in the browser and create the first admin account. Database wiring is already preconfigured by Docker.",
    },
    {
      id: "calcom",
      name: "Cal.com",
      url: serviceUrl("calcom"),
      mode: "setup-wizard",
      priority: "start-here",
      order: 3,
      firstAction: "Follow the setup flow and create the first owner account.",
      notes: "The current local runtime opens the setup flow. Create the first owner account in the browser.",
    },
    {
      id: "twenty",
      name: "Twenty CRM",
      url: serviceUrl("twenty"),
      mode: "signup",
      priority: "start-here",
      order: 4,
      firstAction: "Open the UI and create the first workspace owner account.",
      notes: "Create the first workspace owner in the browser. App secrets are in .env but they are not browser login credentials.",
    },
    {
      id: "documenso",
      name: "Documenso",
      url: serviceUrl("documenso"),
      mode: "signup",
      priority: "start-here",
      order: 5,
      firstAction: "Use the sign-in page to create the first local user account if signup is enabled, or the first invited user if the app asks for one.",
      notes: "The current runtime lands on the sign-in screen. NEXTAUTH secrets are backend-only and not used as a browser password.",
    },
    {
      id: "zitadel",
      name: "Zitadel",
      url: serviceUrl("zitadel"),
      mode: "manual",
      priority: "advanced",
      order: 10,
      firstAction: "Treat this as advanced IAM bootstrap. Do it after the easier apps are already working.",
      notes: "Use the management console bootstrap flow. The masterkey in .env is an infrastructure secret, not a browser username/password.",
    },
    {
      id: "novu",
      name: "Novu Dashboard",
      url: serviceUrl("novu"),
      mode: "signup",
      priority: "later",
      order: 9,
      firstAction: "Open the dashboard and create the first organization owner when you are ready to configure notifications.",
      notes: "Create the first local organization owner in the dashboard. JWT and store encryption values from .env are backend-only secrets.",
    },
    {
      id: "n8n",
      name: "n8n",
      url: serviceUrl("n8n"),
      mode: "setup-wizard",
      priority: "start-here",
      order: 6,
      firstAction: "Complete the owner setup in the browser if prompted.",
      notes: "Good beginner automation entry point. This checkout does not inject a static app login for n8n.",
    },
    {
      id: "medusa",
      name: "Medusa Admin",
      url: serviceUrl("medusa"),
      mode: "manual",
      priority: "advanced",
      order: 11,
      firstAction: "Leave this for later unless you explicitly need commerce admin bootstrap.",
      notes: "Admin user bootstrap is not automated in this checkout. The Medusa JWT and cookie secrets in .env are backend-only and do not create a browser login by themselves.",
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
  ];
}
