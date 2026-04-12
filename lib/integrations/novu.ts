import { createHash } from 'node:crypto';
import { fetchWithTimeout } from '@/app/api/_shared/http';
import { env } from '@/lib/env';

const DEFAULT_NOVU_API_BASE_URL = 'http://localhost:18110';
const DEFAULT_NOVU_WORKFLOW_ID = 'powiadomienia';

export interface NovuSubscriberSyncInput {
  email: string;
  source: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  data?: Record<string, unknown>;
}

export interface NovuWorkflowTriggerInput {
  email: string;
  source: string;
  title: string;
  message: string;
  workflowId?: string;
  payload?: Record<string, unknown>;
}

function isNovuConfigured(): boolean {
  return Boolean(env.NOVU_API_SECRET);
}

function getNovuBaseUrl(): string {
  return env.NOVU_API_BASE_URL ?? DEFAULT_NOVU_API_BASE_URL;
}

function getNovuWorkflowId(workflowId?: string): string {
  return workflowId ?? env.NOVU_WORKFLOW_ID ?? DEFAULT_NOVU_WORKFLOW_ID;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone?: string): string | undefined {
  if (!phone?.trim()) {
    return undefined;
  }

  return phone.trim().replace(/\s+/g, ' ');
}

function buildSubscriberId(email: string): string {
  const normalizedEmail = normalizeEmail(email);
  const digest = createHash('sha1').update(normalizedEmail).digest('hex').slice(0, 12);
  return `hylono-${digest}`;
}

export function getNovuSubscriberId(email: string): string {
  return buildSubscriberId(email);
}

function splitName(input: NovuSubscriberSyncInput): {
  firstName?: string;
  lastName?: string;
} {
  if (input.fullName?.trim()) {
    const parts = input.fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0] };
    }

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    };
  }

  return {
    firstName: input.firstName?.trim(),
    lastName: input.lastName?.trim(),
  };
}

export async function syncSubscriberToNovu(
  input: NovuSubscriberSyncInput
): Promise<void> {
  if (!isNovuConfigured()) {
    return;
  }

  const email = normalizeEmail(input.email);
  const { firstName, lastName } = splitName(input);
  const phone = normalizePhone(input.phone);
  const body = {
    subscriberId: buildSubscriberId(email),
    email,
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(phone ? { phone } : {}),
    data: {
      source: input.source,
      syncedFrom: 'hylono-web',
      ...(input.data ?? {}),
    },
  };

  try {
    const response = await fetchWithTimeout(`${getNovuBaseUrl()}/v2/subscribers`, {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${env.NOVU_API_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.warn('[novu] Subscriber sync returned non-2xx', {
        email,
        source: input.source,
        status: response.status,
        body: responseBody.slice(0, 400),
      });
      return;
    }

    console.info('[novu] Synced subscriber', {
      email,
      source: input.source,
    });
  } catch (error) {
    console.error('[novu] Subscriber sync failed', {
      email,
      source: input.source,
      error,
    });
  }
}

export async function triggerNovuWorkflow(
  input: NovuWorkflowTriggerInput
): Promise<void> {
  if (!isNovuConfigured()) {
    return;
  }

  const email = normalizeEmail(input.email);
  const body = {
    name: getNovuWorkflowId(input.workflowId),
    to: {
      subscriberId: buildSubscriberId(email),
    },
    payload: {
      title: input.title,
      message: input.message,
      source: input.source,
      ...(input.payload ?? {}),
    },
  };

  try {
    const response = await fetchWithTimeout(`${getNovuBaseUrl()}/v1/events/trigger`, {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${env.NOVU_API_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!response.ok) {
      const responseBody = await response.text();
      console.warn('[novu] Workflow trigger returned non-2xx', {
        email,
        source: input.source,
        status: response.status,
        body: responseBody.slice(0, 400),
      });
      return;
    }

    console.info('[novu] Triggered workflow', {
      email,
      source: input.source,
      workflowId: body.name,
    });
  } catch (error) {
    console.error('[novu] Workflow trigger failed', {
      email,
      source: input.source,
      workflowId: body.name,
      error,
    });
  }
}

export interface SyncAndNotifySubscriberInput extends NovuSubscriberSyncInput {
  title: string;
  message: string;
  workflowId?: string;
  payload?: Record<string, unknown>;
}

export async function syncAndNotifySubscriberViaNovu(
  input: SyncAndNotifySubscriberInput
): Promise<void> {
  if (!isNovuConfigured()) {
    return;
  }

  await syncSubscriberToNovu(input);
  await triggerNovuWorkflow({
    email: input.email,
    source: input.source,
    title: input.title,
    message: input.message,
    workflowId: input.workflowId,
    payload: input.payload,
  });
}
