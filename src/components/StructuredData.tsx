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

export default function StructuredData({ data, id }: StructuredDataProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonStringify(data) }}
    />
  );
}