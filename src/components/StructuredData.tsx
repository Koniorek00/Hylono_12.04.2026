import { headers } from 'next/headers';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface StructuredDataProps {
  data: JsonObject | JsonArray;
  id?: string;
}

const safeJsonStringify = (value: JsonObject | JsonArray): string =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const extractNonce = (cspHeader: string | null): string | null => {
  if (!cspHeader) {
    return null;
  }

  const nonceMatch = cspHeader.match(/'nonce-([^']+)'/);
  return nonceMatch?.[1] ?? null;
};

export default async function StructuredData({ data, id }: StructuredDataProps) {
  const requestHeaders = await headers();
  const nonceFromHeader = requestHeaders.get('x-nonce');
  const nonce = nonceFromHeader ?? extractNonce(requestHeaders.get('content-security-policy'));

  return (
    <script
      id={id}
      suppressHydrationWarning
      nonce={nonce ?? undefined}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(data) }}
    />
  );
}