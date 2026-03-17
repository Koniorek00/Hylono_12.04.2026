// StaticStructuredData — synchronous JSON-LD injection for SSG/static routes.
// Use this instead of StructuredData when the route is fully static (SSG) and
// no CSP nonce is required. The script renders in the initial HTML shell.
interface StaticStructuredDataProps {
  data: object;
  id?: string;
}

const safeJsonStringify = (value: object): string =>
  JSON.stringify(value).replace(/</g, '\\u003c');

export function StaticStructuredData({ data, id }: StaticStructuredDataProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(data) }}
    />
  );
}
