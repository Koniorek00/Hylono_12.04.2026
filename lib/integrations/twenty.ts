import { fetchWithTimeout } from '@/app/api/_shared/http';
import { env } from '@/lib/env';

const DEFAULT_TWENTY_API_BASE_URL = 'http://localhost:8107';
const LIST_LIMIT = 100;

const COMMON_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'icloud.com',
  'interia.pl',
  'o2.pl',
  'outlook.com',
  'proton.me',
  'protonmail.com',
  'wp.pl',
  'yahoo.com',
]);

interface TwentyNameValue {
  firstName: string;
  lastName: string;
}

interface TwentyEmailValue {
  primaryEmail: string;
  additionalEmails: string[];
}

interface TwentyPhoneValue {
  primaryPhoneNumber: string;
  primaryPhoneCountryCode: string;
  primaryPhoneCallingCode: string;
  additionalPhones: string[];
}

interface TwentyPersonRecord {
  id: string;
  name?: TwentyNameValue;
  emails?: TwentyEmailValue;
  phones?: TwentyPhoneValue;
  city?: string;
  companyId?: string | null;
}

interface TwentyCompanyRecord {
  id: string;
  name: string;
  domainName?: {
    primaryLinkUrl?: string;
  };
}

interface TwentyPeopleListResponse {
  data?: {
    people?: TwentyPersonRecord[];
  };
}

interface TwentyCompaniesListResponse {
  data?: {
    companies?: TwentyCompanyRecord[];
  };
}

interface TwentyCreatePersonResponse {
  data?: {
    createPerson?: TwentyPersonRecord;
  };
}

interface TwentyUpdatePersonResponse {
  data?: {
    updatePerson?: TwentyPersonRecord;
  };
}

interface TwentyCreateCompanyResponse {
  data?: {
    createCompany?: TwentyCompanyRecord;
  };
}

interface TwentyOpportunityRecord {
  id: string;
  name: string;
}

interface TwentyTaskRecord {
  id: string;
  title: string;
}

interface TwentyOpportunitiesListResponse {
  data?: {
    opportunities?: TwentyOpportunityRecord[];
  };
}

interface TwentyTasksListResponse {
  data?: {
    tasks?: TwentyTaskRecord[];
  };
}

interface TwentyCreateOpportunityResponse {
  data?: {
    createOpportunity?: TwentyOpportunityRecord;
  };
}

interface TwentyCreateTaskResponse {
  data?: {
    createTask?: TwentyTaskRecord;
  };
}

export interface TwentyPersonSyncInput {
  email: string;
  source: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  companyName?: string;
}

interface TwentyPersonSyncResult {
  personId?: string;
  companyId?: string;
  email: string;
}

interface TwentyOpportunityInput {
  name: string;
  amountMicros: number;
  currencyCode: string;
  stage?: string;
  companyId?: string;
  pointOfContactId?: string;
}

interface TwentyTaskInput {
  title: string;
  bodyText: string;
  status?: string;
}

export interface TwentyFollowUpSyncInput extends TwentyPersonSyncInput {
  taskTitle: string;
  taskBodyText: string;
  taskStatus?: string;
  opportunity?: {
    name: string;
    amountMicros: number;
    currencyCode: string;
    stage?: string;
  };
}

function isTwentyConfigured(): boolean {
  return Boolean(env.TWENTY_API_KEY);
}

function getTwentyBaseUrl(): string {
  return env.TWENTY_API_BASE_URL ?? DEFAULT_TWENTY_API_BASE_URL;
}

function buildUrl(path: string): string {
  const normalizedBaseUrl = getTwentyBaseUrl().replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${normalizedBaseUrl}/${normalizedPath}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function fallbackNameFromEmail(email: string): string {
  return normalizeEmail(email).split('@')[0] ?? 'Hylono';
}

function splitName(input: TwentyPersonSyncInput): TwentyNameValue {
  if (input.fullName?.trim()) {
    const parts = normalizeText(input.fullName).split(' ');
    const firstName = parts[0] ?? fallbackNameFromEmail(input.email);
    if (parts.length === 1) {
      return { firstName, lastName: '' };
    }

    return {
      firstName,
      lastName: parts.slice(1).join(' '),
    };
  }

  if (input.firstName?.trim() || input.lastName?.trim()) {
    return {
      firstName: normalizeText(input.firstName ?? '') || fallbackNameFromEmail(input.email),
      lastName: normalizeText(input.lastName ?? ''),
    };
  }

  return {
    firstName: fallbackNameFromEmail(input.email),
    lastName: '',
  };
}

function buildPhoneValue(phone?: string): TwentyPhoneValue | undefined {
  if (!phone?.trim()) {
    return undefined;
  }

  const compact = phone.trim().replace(/[^\d+]/g, '');
  let primaryPhoneCountryCode = '';
  let primaryPhoneCallingCode = '';
  let primaryPhoneNumber = compact.replace(/^\+/, '');

  if (compact.startsWith('+48')) {
    primaryPhoneCountryCode = 'PL';
    primaryPhoneCallingCode = '+48';
    primaryPhoneNumber = compact.slice(3);
  } else if (compact.startsWith('+1')) {
    primaryPhoneCountryCode = 'US';
    primaryPhoneCallingCode = '+1';
    primaryPhoneNumber = compact.slice(2);
  }

  return {
    primaryPhoneNumber,
    primaryPhoneCountryCode,
    primaryPhoneCallingCode,
    additionalPhones: [],
  };
}

function buildCompanyDomain(email: string): string | undefined {
  const domain = normalizeEmail(email).split('@')[1];

  if (!domain || COMMON_EMAIL_DOMAINS.has(domain)) {
    return undefined;
  }

  return domain;
}

async function requestTwenty<T>(path: string, init?: RequestInit): Promise<T | undefined> {
  if (!env.TWENTY_API_KEY) {
    return undefined;
  }

  try {
    const response = await fetchWithTimeout(buildUrl(path), {
      ...init,
      headers: {
        Authorization: `Bearer ${env.TWENTY_API_KEY}`,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn('[twenty] Request returned non-2xx', {
        path,
        status: response.status,
        body: body.slice(0, 400),
      });
      return undefined;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('[twenty] Request failed', { path, error });
    return undefined;
  }
}

async function listPeople(): Promise<TwentyPersonRecord[]> {
  const response = await requestTwenty<TwentyPeopleListResponse>(
    `rest/people?limit=${LIST_LIMIT}`
  );

  return response?.data?.people ?? [];
}

async function listCompanies(): Promise<TwentyCompanyRecord[]> {
  const response = await requestTwenty<TwentyCompaniesListResponse>(
    `rest/companies?limit=${LIST_LIMIT}`
  );

  return response?.data?.companies ?? [];
}

async function ensureCompanyId(companyName: string, email: string): Promise<string | undefined> {
  const normalizedCompanyName = normalizeText(companyName);

  if (!normalizedCompanyName) {
    return undefined;
  }

  const companies = await listCompanies();
  const existing = companies.find(
    (company) => normalizeText(company.name).toLowerCase() === normalizedCompanyName.toLowerCase()
  );

  if (existing) {
    return existing.id;
  }

  const domain = buildCompanyDomain(email);
  const response = await requestTwenty<TwentyCreateCompanyResponse>('rest/companies', {
    method: 'POST',
    body: JSON.stringify({
      name: normalizedCompanyName,
      ...(domain
        ? {
            domainName: {
              primaryLinkUrl: domain,
              primaryLinkLabel: '',
              secondaryLinks: [],
            },
          }
        : {}),
    }),
  });

  return response?.data?.createCompany?.id;
}

async function listOpportunities(): Promise<TwentyOpportunityRecord[]> {
  const response = await requestTwenty<TwentyOpportunitiesListResponse>(
    `rest/opportunities?limit=${LIST_LIMIT}`
  );

  return response?.data?.opportunities ?? [];
}

async function listTasks(): Promise<TwentyTaskRecord[]> {
  const response = await requestTwenty<TwentyTasksListResponse>(`rest/tasks?limit=${LIST_LIMIT}`);

  return response?.data?.tasks ?? [];
}

async function ensureOpportunity(input: TwentyOpportunityInput): Promise<string | undefined> {
  if (!isTwentyConfigured()) {
    return undefined;
  }

  const normalizedName = normalizeText(input.name);
  if (!normalizedName || input.amountMicros <= 0) {
    return undefined;
  }

  const opportunities = await listOpportunities();
  const existing = opportunities.find(
    (opportunity) => normalizeText(opportunity.name).toLowerCase() === normalizedName.toLowerCase()
  );

  if (existing) {
    return existing.id;
  }

  const response = await requestTwenty<TwentyCreateOpportunityResponse>('rest/opportunities', {
    method: 'POST',
    body: JSON.stringify({
      name: normalizedName,
      amount: {
        amountMicros: input.amountMicros,
        currencyCode: input.currencyCode,
      },
      stage: input.stage ?? 'NEW',
      ...(input.companyId ? { companyId: input.companyId } : {}),
      ...(input.pointOfContactId ? { pointOfContactId: input.pointOfContactId } : {}),
    }),
  });

  return response?.data?.createOpportunity?.id;
}

async function ensureTask(input: TwentyTaskInput): Promise<string | undefined> {
  if (!isTwentyConfigured()) {
    return undefined;
  }

  const normalizedTitle = normalizeText(input.title);
  if (!normalizedTitle) {
    return undefined;
  }

  const tasks = await listTasks();
  const existing = tasks.find(
    (task) => normalizeText(task.title).toLowerCase() === normalizedTitle.toLowerCase()
  );

  if (existing) {
    return existing.id;
  }

  const response = await requestTwenty<TwentyCreateTaskResponse>('rest/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title: normalizedTitle,
      bodyV2: {
        blocknote: JSON.stringify({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: input.bodyText,
                },
              ],
            },
          ],
        }),
        markdown: input.bodyText,
      },
      status: input.status ?? 'TODO',
    }),
  });

  return response?.data?.createTask?.id;
}

async function upsertPersonToTwenty(
  input: TwentyPersonSyncInput
): Promise<TwentyPersonSyncResult> {
  if (!isTwentyConfigured()) {
    return {
      email: normalizeEmail(input.email),
    };
  }

  const email = normalizeEmail(input.email);
  const name = splitName(input);
  const phone = buildPhoneValue(input.phone);
  const city = input.city ? normalizeText(input.city) : undefined;
  const companyId = input.companyName
    ? await ensureCompanyId(input.companyName, email)
    : undefined;

  const people = await listPeople();
  const existing = people.find(
    (person) => normalizeEmail(person.emails?.primaryEmail ?? '') === email
  );

  const personPayload = {
    name,
    emails: {
      primaryEmail: email,
      additionalEmails: [],
    },
    ...(phone ? { phones: phone } : {}),
    ...(city ? { city } : {}),
    ...(companyId ? { companyId } : {}),
  };

  if (existing) {
    await requestTwenty<TwentyUpdatePersonResponse>(`rest/people/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(personPayload),
    });

    return {
      personId: existing.id,
      companyId,
      email,
    };
  }

  const response = await requestTwenty<TwentyCreatePersonResponse>('rest/people', {
    method: 'POST',
    body: JSON.stringify(personPayload),
  });

  console.info('[twenty] Synced intake person', {
    email,
    source: input.source,
  });

  return {
    personId: response?.data?.createPerson?.id,
    companyId,
    email,
  };
}

export async function syncPersonToTwenty(input: TwentyPersonSyncInput): Promise<void> {
  await upsertPersonToTwenty(input);
}

export async function syncPersonAndFollowUpToTwenty(
  input: TwentyFollowUpSyncInput
): Promise<void> {
  if (!isTwentyConfigured()) {
    return;
  }

  const syncResult = await upsertPersonToTwenty(input);

  if (input.opportunity) {
    await ensureOpportunity({
      name: input.opportunity.name,
      amountMicros: input.opportunity.amountMicros,
      currencyCode: input.opportunity.currencyCode,
      stage: input.opportunity.stage,
      companyId: syncResult.companyId,
      pointOfContactId: syncResult.personId,
    });
  }

  await ensureTask({
    title: input.taskTitle,
    bodyText: input.taskBodyText,
    status: input.taskStatus,
  });
}
