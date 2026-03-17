import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo-metadata';
import { BLOG_POSTS } from '@/constants/content';
import { conditionGoals } from '@/content/conditions';
import { toBlogSlug } from '@/lib/blog';
import { protocols } from '@/content/protocols';
import { createBreadcrumbSchema, createWebPageSchema } from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { TECH_DETAILS } from '@/constants';
import { getTechRouteSlug } from '@/lib/product-routes';

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type SearchResult = {
  description: string;
  href: string;
  title: string;
  type: 'article' | 'condition' | 'product' | 'protocol';
};

const normalizeText = (value: string): string => value.toLowerCase().trim();

const uniqueResults = (results: SearchResult[]): SearchResult[] => {
  const seen = new Set<string>();

  return results.filter((result) => {
    if (seen.has(result.href)) {
      return false;
    }

    seen.add(result.href);
    return true;
  });
};

const getSearchResults = (query: string): SearchResult[] => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return [];
  }

  const articleResults: SearchResult[] = BLOG_POSTS.filter((post) =>
    normalizeText(`${post.title} ${post.excerpt} ${post.category}`).includes(normalizedQuery)
  ).map((post) => ({
    title: post.title,
    description: post.excerpt,
    href: `/blog/${toBlogSlug(post.title)}`,
    type: 'article',
  }));

  const conditionResults: SearchResult[] = conditionGoals.filter((goal) =>
    normalizeText(`${goal.title} ${goal.subtitle} ${goal.description.join(' ')}`).includes(normalizedQuery)
  ).map((goal) => ({
    title: `${goal.title} wellness guide`,
    description: goal.subtitle,
    href: `/conditions/${goal.slug}`,
    type: 'condition',
  }));

  const protocolResults: SearchResult[] = protocols.filter((protocol) =>
    normalizeText(`${protocol.title} ${protocol.shortDescription} ${protocol.goal} ${protocol.targetAudience}`).includes(normalizedQuery)
  ).map((protocol) => ({
    title: protocol.title,
    description: protocol.shortDescription,
    href: `/protocols/${protocol.slug}`,
    type: 'protocol',
  }));

  const productResults: SearchResult[] = Object.values(TECH_DETAILS)
    .filter((tech) =>
      normalizeText(
        `${tech.name} ${tech.friendlyName} ${tech.tagline} ${tech.descriptionStandard}`
      ).includes(normalizedQuery)
    )
    .map((tech) => ({
      title: `Hylono ${tech.name}`,
      description: tech.descriptionStandard,
      href: `/product/${getTechRouteSlug(tech.id)}`,
      type: 'product',
    }));

  return uniqueResults([
    ...productResults,
    ...conditionResults,
    ...protocolResults,
    ...articleResults,
  ]);
};

export const metadata: Metadata = createPageMetadata({
  title: 'Search Hylono',
  description:
    'Search Hylono products, protocols, articles, and condition guides from one internal search page.',
  path: '/search',
  forceNoIndex: true,
});

// [DECISION: SSG because this is a lightweight internal search shell that reads query params and should not be indexed.]
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const results = getSearchResults(query);
  const webPageSchema = createWebPageSchema({
    name: 'Search Hylono',
    description:
      'Search Hylono products, protocols, articles, and condition guides from one internal search page.',
    path: '/search',
  });
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
  ]);

  return (
    <>
      <StructuredData id="jsonld-search-page" data={webPageSchema} />
      <StructuredData id="jsonld-search-breadcrumb" data={breadcrumbSchema} />
      <section className="mx-auto max-w-4xl px-6 py-16 text-slate-900">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Internal search
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Search Hylono</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Search across products, protocols, condition guides, and articles. This page is
            available for site search and structured data, but it is intentionally not indexable.
          </p>
        </header>

        <form action="/search" className="mt-8 flex gap-3">
          <label htmlFor="search-query" className="sr-only">
            Search query
          </label>
          <input
            id="search-query"
            name="q"
            defaultValue={query}
            placeholder="Search products, protocols, or articles"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base"
            type="search"
          />
          <button
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            type="submit"
          >
            Search
          </button>
        </form>

        {query ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">
              {results.length} result{results.length === 1 ? '' : 's'} for "{query}"
            </h2>
            {results.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {results.map((result) => (
                  <li key={result.href} className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      {result.type}
                    </p>
                    <Link className="mt-2 block text-xl font-semibold text-slate-900" href={result.href}>
                      {result.title}
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{result.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                No direct matches were found. Try a product name, goal, protocol theme, or article
                topic.
              </p>
            )}
          </section>
        ) : (
          <section className="mt-10 rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold">Try one of these searches</h2>
            <ul className="mt-4 flex flex-wrap gap-3 text-sm">
              {['HBOT', 'hydrogen', 'recovery', 'sleep', 'protocol'].map((example) => (
                <li key={example}>
                  <Link
                    className="inline-flex rounded-full border border-slate-300 px-3 py-2 text-slate-700"
                    href={`/search?q=${encodeURIComponent(example)}`}
                  >
                    {example}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </>
  );
}
