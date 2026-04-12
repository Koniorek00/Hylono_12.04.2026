import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  formatPln,
  getHydrogenPremiumPath,
  hydrogenPremiumLineMeta,
  hydrogenPremiumPageBySlug,
  hydrogenPremiumPages,
  type HydrogenPremiumPageRecord,
  type HydrogenPremiumSlug,
} from '@/content/hydrogen-premium-2026';
import { siteOwnership } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import {
  SCHEMA_DATE_MODIFIED,
  createBreadcrumbSchema,
  createFaqSchema,
  createProductSchema,
  createWebPageSchema,
} from '@/lib/seo-schema';
import StructuredData from '@/src/components/StructuredData';
import { HydrogenPremiumConfigurator } from './HydrogenPremiumConfigurator';
import {
  buildApplications,
  buildBundles,
  buildEvidenceItems,
  buildFaqItems,
  getDeliveryCards,
  getExpectedResults,
  getMetadataDescription,
  getPricingCards,
  getPriceRangeLabel,
  getProtocolFitCards,
  getRouteCards,
  getSafetyCards,
  getScienceCards,
  getScores,
  getStepPlan,
  pairingCards,
  slugifyModel,
} from './hydrogenPremiumPageContent';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const LAST_UPDATED = 'April 11, 2026';

function SectionHeading({
  kicker,
  title,
  description,
  accent,
}: {
  kicker: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em]" style={{ color: accent }}>
        {kicker}
      </p>
      <h2
        className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl"
        style={{ fontFamily: 'var(--font-syncopate), sans-serif' }}
      >
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-white/72 md:text-base">{description}</p>
    </div>
  );
}

function SurfaceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/44">
        {title}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/72">{body}</p>
    </div>
  );
}

function MetricBar({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  accent: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-1 text-xs leading-6 text-white/56">{hint}</p>
        </div>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: accent }} />
      </div>
    </div>
  );
}

function ProductSpecCard({
  page,
  variant,
  accent,
}: {
  page: HydrogenPremiumPageRecord;
  variant: HydrogenPremiumPageRecord['variants'][number];
  accent: string;
}) {
  return (
    <article id={`variant-${slugifyModel(variant.model)}`} className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: accent }}>
        {variant.model}
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <p className="text-sm text-white/46">
            {variant.hydrogen.includes('ppb') ? 'Hydrogen concentration' : 'Hydrogen output'}
          </p>
          <p className="text-2xl font-semibold text-white">{variant.hydrogen}</p>
        </div>
        <div>
          <p className="text-sm text-white/46">
            {variant.oxygen ? 'Oxygen output' : page.lineId === 'water' ? 'Format' : 'Gas profile'}
          </p>
          <p className="text-xl font-semibold text-white">
            {variant.oxygen ?? (page.lineId === 'water' ? 'Hydrogen water system' : 'Pure hydrogen')}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-white/46">Dimensions</p>
            <p className="text-base font-semibold text-white">{variant.dimensions}</p>
          </div>
          <div>
            <p className="text-sm text-white/46">Weight</p>
            <p className="text-base font-semibold text-white">{variant.weight}</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4">
          <p className="text-sm text-white/46">Current price</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatPln(variant.grossPrice)}</p>
          <p className="text-sm text-white/56">{formatPln(variant.netPrice)} net</p>
        </div>
      </div>
    </article>
  );
}

export function buildHydrogenPremiumMetadata(slug: HydrogenPremiumSlug): Metadata {
  const page = hydrogenPremiumPageBySlug[slug];

  return createPageMetadata({
    title: `${page.title} | Hylono Molecular Hydrogen 2026`,
    description: getMetadataDescription(page),
    path: getHydrogenPremiumPath(slug),
    ogImagePath: page.image,
    ogImageAlt: page.imageAlt,
  });
}

export function HydrogenPremiumPage({ slug }: { slug: HydrogenPremiumSlug }) {
  const page = hydrogenPremiumPageBySlug[slug];
  if (!page) notFound();

  const line = hydrogenPremiumLineMeta[page.lineId];
  const siblings = hydrogenPremiumPages.filter((item) => item.lineId === page.lineId && item.slug !== page.slug);
  const siblingLinks = siblings.map((sibling) => ({
    title: sibling.title,
    description: sibling.catalogSummary,
    href: getHydrogenPremiumPath(sibling.slug),
  }));
  const pricingCards = getPricingCards(page);
  const routeCards = getRouteCards(page);
  const protocolFitCards = getProtocolFitCards(page, line.subtitle, line.rangeLabel);
  const scienceCards = getScienceCards(page);
  const deliveryCards = getDeliveryCards(page);
  const safetyCards = getSafetyCards(page, line.subtitle);
  const applications = buildApplications(page);
  const evidenceItems = buildEvidenceItems(page);
  const bundles = buildBundles(page);
  const faqItems = buildFaqItems(page);
  const stepPlan = getStepPlan(page);
  const expectedResults = getExpectedResults(page);
  const scores = getScores(page);
  const firstVariant = page.variants[0];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Hydrogen', path: '/product/hydrogen' },
    { name: page.title, path: getHydrogenPremiumPath(page.slug) },
  ]);

  const webPageSchema = {
    ...createWebPageSchema({
      name: `Hylono Molecular Hydrogen ${page.title}`,
      description: getMetadataDescription(page),
      path: getHydrogenPremiumPath(page.slug),
      dateModified: SCHEMA_DATE_MODIFIED,
      imageUrl: page.image,
    }),
    '@type': 'ItemPage',
    inLanguage: 'en',
  };

  const productSchema =
    page.variants.length === 1
      ? {
          ...createProductSchema({
            name: `Hylono Molecular Hydrogen ${page.title}`,
            description: getMetadataDescription(page),
            path: getHydrogenPremiumPath(page.slug),
            price: firstVariant?.grossPrice,
            priceCurrency: 'PLN',
            availability: 'https://schema.org/InStock',
            imageUrl: page.image,
          }),
          inLanguage: 'en',
          model: firstVariant?.model,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'ProductGroup',
          '@id': `${SITE_URL}${getHydrogenPremiumPath(page.slug)}#product-group`,
          name: `Hylono Molecular Hydrogen ${page.title}`,
          description: getMetadataDescription(page),
          inLanguage: 'en',
          url: `${SITE_URL}${getHydrogenPremiumPath(page.slug)}`,
          hasVariant: page.variants.map((variant) => ({
            '@type': 'Product',
            '@id': `${SITE_URL}${getHydrogenPremiumPath(page.slug)}#${slugifyModel(variant.model)}`,
            name: `Hylono ${variant.model}`,
            model: variant.model,
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}${getHydrogenPremiumPath(page.slug)}#${slugifyModel(variant.model)}`,
              priceCurrency: 'PLN',
              price: variant.grossPrice,
              validFrom: SCHEMA_DATE_MODIFIED,
              availability: 'https://schema.org/InStock',
            },
          })),
        };

  return (
    <>
      <Suspense fallback={null}>
        <StructuredData id={`jsonld-${page.slug}-page`} data={webPageSchema} />
        <StructuredData id={`jsonld-${page.slug}-product`} data={productSchema} />
        <StructuredData id={`jsonld-${page.slug}-breadcrumb`} data={breadcrumbSchema} />
        <StructuredData
          id={`jsonld-${page.slug}-faq`}
          data={createFaqSchema(
            faqItems.map((item) => ({ question: item.question, answer: item.answer })),
            getHydrogenPremiumPath(page.slug),
            `${page.title} FAQ`,
          )}
        />
      </Suspense>

      <main id="main-content" className="bg-[#06080c] text-white">
        <section
          className="relative overflow-hidden border-b border-white/10"
          style={{
            background: `radial-gradient(circle at top right, ${line.glow}, transparent 34%), linear-gradient(135deg, ${line.dark} 0%, #07141e 58%, #04070c 100%)`,
          }}
        >
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 md:px-8 md:pb-24 md:pt-10">
            <div className="text-xs uppercase tracking-[0.24em] text-white/48">
              <Link href="/">Home</Link> / <Link href="/store">Store</Link> / <Link href="/product/hydrogen">Hydrogen</Link> / <span className="text-white">{page.title}</span>
            </div>
            <div className="mt-8 grid gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/48">
                  01 Hero
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.36em]" style={{ color: line.accent }}>
                  {line.order} {line.title}
                </p>
                <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] md:text-6xl" style={{ fontFamily: 'var(--font-syncopate), sans-serif' }}>{page.title}</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78 md:text-xl">{page.catalogSummary}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 md:text-base">{page.heroSummary}</p>
                <div className="mt-7 flex flex-wrap gap-3">{page.routeBadges.map((badge) => <span key={`${page.slug}-${badge}`} className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ borderColor: `${line.accent}55`, color: line.accent, backgroundColor: `${line.accent}12` }}>{badge}</span>)}</div>
                <div className="mt-9 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5 backdrop-blur"><p className="text-[11px] uppercase tracking-[0.24em] text-white/48">Pricing range</p><p className="mt-3 text-2xl font-semibold text-white">{getPriceRangeLabel(page)}</p></div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5 backdrop-blur"><p className="text-[11px] uppercase tracking-[0.24em] text-white/48">Output scale</p><p className="mt-3 text-2xl font-semibold text-white">{line.rangeLabel}</p></div>
                  <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5 backdrop-blur"><p className="text-[11px] uppercase tracking-[0.24em] text-white/48">Ecosystem fit</p><p className="mt-3 text-2xl font-semibold text-white">HBOT + RLT + PEMF</p></div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="#select-configuration" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition-transform hover:-translate-y-0.5" style={{ backgroundColor: line.accent }}>Select configuration</Link>
                  <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/[0.05]">Request guidance</Link>
                  <Link href="/product/hydrogen" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-white/[0.05]">Open H2 reference page</Link>
                </div>
                <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-black/20 p-5 backdrop-blur"><div className="flex flex-wrap items-center gap-4 text-sm text-white/70"><span style={{ color: line.accent }}>Ownership / freshness</span><span>{siteOwnership.editorial.team}</span><span>{siteOwnership.research.team}</span><span>{siteOwnership.commerce.team}</span><span>{LAST_UPDATED}</span></div></div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 rounded-[2.5rem] blur-3xl" style={{ backgroundColor: `${line.accent}22` }} />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-[4/4] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#07131d_0%,#091925_100%)]"><Image src={page.image} alt={page.imageAlt} fill priority sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 42vw, 100vw" className="object-contain p-8" /></div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">{page.variants.map((variant) => <div key={`${page.slug}-${variant.model}`} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4"><p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: line.accent }}>{variant.model}</p><p className="mt-3 text-xl font-semibold text-white">{variant.hydrogen}</p><p className="mt-2 text-sm text-white/58">{variant.oxygen ?? (page.lineId === 'water' ? 'Hydrogen water route' : 'Pure hydrogen')}</p></div>)}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="border-b border-white/8 bg-[#06080c] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="02 Pricing & Access Options" title="Pricing, access logic, and ownership context" description="This section combines verified pricing facts with the real Hylono decision flow: advisory fit, rental planning, and long-term ownership inside a broader system." accent={line.accent} /><div className="mt-10 grid gap-5 lg:grid-cols-4">{pricingCards.map((card) => <SurfaceCard key={`${page.slug}-${card.title}`} title={card.title} body={card.body} />)}</div></div></section>

        <HydrogenPremiumConfigurator accent={line.accent} lineOrder={line.order} lineTitle={line.title} lineSubtitle={line.subtitle} rangeLabel={line.rangeLabel} pageTitle={page.title} useCaseLabel={page.useCaseLabel} variants={page.variants} siblingLinks={siblingLinks} />

        <section className="border-b border-white/8 bg-[#0b0f15] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="03 Browse the Route" title="Where this page sits inside the Hylono path" description="Every model page still needs to push the user forward: into the broader hydrogen reference page, cited research, relevant protocols, and the commercial next step." accent={line.accent} /><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{routeCards.map((card) => <Link key={`${page.slug}-${card.title}`} href={card.href} className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/24 hover:bg-white/[0.05]"><p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: line.accent }}>Route</p><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm leading-7 text-white/64">{card.description}</p></Link>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#06080c] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="04 Protocol Fit" title="Where this configuration makes sense in practice" description="Hylono buyers are not looking for a random device. They are looking for the right place for a configuration inside a real weekly routine, room, and stack." accent={line.accent} /><div className="mt-10 grid gap-5 lg:grid-cols-3">{protocolFitCards.map((card) => <SurfaceCard key={`${page.slug}-${card.title}`} title={card.title} body={card.body} />)}</div></div></section>

        <section className="border-b border-white/8 bg-[#0b0f15] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="05 SimpleScience / The Science of Small" title="Why hydrogen belongs in this architecture" description="The real advantage is not marketing weight. It is the precision of a small molecule, the repeatability of the ritual, and the way the right configuration reduces protocol friction." accent={line.accent} /><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{scienceCards.map((card) => <div key={`${page.slug}-${card.title}`} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: line.accent }}>SimpleScience</p><h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm leading-7 text-white/66">{card.description}</p></div>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#06080c] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="06 Key Specifications" title="Verified model data and pricing" description="Exact model codes, hydrogen output, dimensions, and pricing stay visible here so the page does not drift into vague premium language with no factual layer underneath." accent={line.accent} /><div className="mt-10 grid gap-5 lg:grid-cols-3">{page.variants.map((variant) => <ProductSpecCard key={`${page.slug}-${variant.model}`} page={page} variant={variant} accent={line.accent} />)}</div>{siblings.length > 0 ? <div className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: line.accent }}>More pages in {line.title}</p><div className="mt-8 grid gap-4 lg:grid-cols-3">{siblings.map((sibling) => <Link key={`${page.slug}-${sibling.slug}`} href={getHydrogenPremiumPath(sibling.slug)} className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5 transition-colors hover:border-white/24 hover:bg-white/[0.05]"><h4 className="text-xl font-semibold text-white">{sibling.title}</h4><p className="mt-3 text-sm leading-7 text-white/66">{sibling.catalogSummary}</p></Link>)}</div></div> : null}</div></section>

        <section className="border-b border-white/8 bg-[#0b0f15] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="07 Complete System / Four Ways to Receive" title="How hydrogen enters the Hylono ecosystem" description="Hydrogen is not one single ritual. It can enter through inhalation, dissolved-water access, immersion, showering, or a mobile format depending on the model family." accent={line.accent} /><div className="mt-10 grid gap-5 lg:grid-cols-4">{deliveryCards.map((card) => <Link key={`${page.slug}-${card.title}`} href={card.href} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/24 hover:bg-white/[0.05]"><h3 className="text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm leading-7 text-white/66">{card.description}</p></Link>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#06080c] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="08 Safety & Contraindications" title="Operational safety, handling, and conservative boundaries" description="The page stays tied to verified product guidance. Where public details stay silent, the route says so rather than inventing unsupported medical certainty." accent={line.accent} /><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{safetyCards.map((card) => <div key={`${page.slug}-${card.title}`} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"><h3 className="text-xl font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm leading-7 text-white/66">{card.description}</p></div>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#0b0f15] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="09 Scientific Evidence" title="The evidence layer supporting this category" description="Only cited evidence that is already surfaced inside Hylono appears here, with limitation language kept visible alongside the positive findings." accent={line.accent} /><div className="mt-10 grid gap-5 xl:grid-cols-3">{evidenceItems.map((item) => <article key={item.id} className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: line.accent }}>{item.studyType}</p><h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/66">{item.publication}, {item.year} • {item.authors}</p><p className="mt-4 text-sm leading-7 text-white/70">{item.resultSummary}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex text-sm font-semibold" style={{ color: line.accent }}>Open study</a></article>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#06080c] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="10 Research-Backed Applications" title="Where buyers usually want guidance" description="These are not fixed-result claims or medical claims. They are the topical directions around which Hylono builds the condition -> research -> product -> protocol -> contact journey." accent={line.accent} /><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{applications.map((application) => <Link key={`${page.slug}-${application.title}`} href={application.href} className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/24 hover:bg-white/[0.05]"><h3 className="text-xl font-semibold text-white">{application.title}</h3><p className="mt-3 text-sm leading-7 text-white/66">{application.description}</p></Link>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#0b0f15] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="11 Step-by-Step + Expected Results" title="How to implement the system without adding chaos" description="Order matters. First stabilise the ritual, then decide whether the stack needs more intensity, more complexity, or a different access route." accent={line.accent} /><div className="mt-10 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><div className="grid gap-5">{stepPlan.map((step, index) => <div key={`${page.slug}-${step}`} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: line.accent }}>Step {index + 1}</p><p className="mt-4 text-sm leading-7 text-white/66">{step}</p></div>)}</div><div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: line.accent }}>Expected results</p><ul className="mt-6 space-y-4">{expectedResults.map((item) => <li key={`${page.slug}-${item}`} className="rounded-[1.4rem] border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white/72">{item}</li>)}</ul></div></div></div></section>

        <section className="border-b border-white/8 bg-[#06080c] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="12 Performance Profile" title="Scale, readiness, and system fit" description="This is not a medical benchmark. It is a practical reading of how the device sits inside its own line and inside the wider Hylono ecosystem." accent={line.accent} /><div className="mt-10 grid gap-5 xl:grid-cols-2">{scores.map((score) => <MetricBar key={`${page.slug}-${score.label}`} label={score.label} value={score.value} hint={score.hint} accent={line.accent} />)}</div></div></section>

        <section className="border-b border-white/8 bg-[#0b0f15] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="13 Synergies / Pairs Well With" title="What this configuration pairs with best" description="The strongest hydrogen pages do not pretend the device is a whole ecosystem by itself. They show exactly where it belongs beside the rest of the stack." accent={line.accent} /><div className="mt-10 grid gap-5 xl:grid-cols-3">{pairingCards.map((pairing) => <Link key={`${page.slug}-${pairing.title}`} href={pairing.href} className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/24 hover:bg-white/[0.05]"><h3 className="text-xl font-semibold text-white">{pairing.title}</h3><p className="mt-3 text-sm leading-7 text-white/66">{pairing.description}</p></Link>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#06080c] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="14 Curated Packages / Bundles" title="Protocols and packages where this model belongs naturally" description="Each package connects the hardware to evidence, routines, and the next user decision without turning the page into abstract bundle language." accent={line.accent} /><div className="mt-10 grid gap-5 xl:grid-cols-3">{bundles.map((bundle) => <Link key={`${page.slug}-${bundle.title}`} href={bundle.href} className="rounded-[1.9rem] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/24 hover:bg-white/[0.05]"><h3 className="text-xl font-semibold text-white">{bundle.title}</h3><p className="mt-3 text-sm leading-7 text-white/66">{bundle.description}</p></Link>)}</div></div></section>

        <section className="border-b border-white/8 bg-[#0b0f15] py-18"><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="15 FAQ" title="What buyers usually need clarified before deciding" description="The FAQ keeps the answers grounded in the product guidance that is already visible on the page, then adds only the context needed for a clean buying decision." accent={line.accent} /><div className="mt-10 grid gap-5 xl:grid-cols-2">{faqItems.map((item) => <details key={`${page.slug}-${item.question}`} className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"><summary className="cursor-pointer list-none text-lg font-semibold text-white">{item.question}</summary><p className="mt-4 text-sm leading-7 text-white/70">{item.answer}</p></details>)}</div></div></section>

        <section className="relative overflow-hidden py-20" style={{ background: `radial-gradient(circle at top left, ${line.glow}, transparent 36%), linear-gradient(135deg, #0d1320 0%, ${line.dark} 100%)` }}><div className="mx-auto max-w-7xl px-6 md:px-8"><SectionHeading kicker="16 Next Steps / Final CTA" title="Move from configuration browsing to a real decision" description="The page should not end as a static specification sheet. The user needs a next move: compare the right configuration, discuss buyout or rental, and place the model correctly inside the wider Hylono stack." accent={line.accent} /><div className="mt-10 grid gap-6 xl:grid-cols-[1fr_0.92fr]"><div className="rounded-[2.1rem] border border-white/12 bg-black/20 p-7 backdrop-blur"><h3 className="text-3xl font-semibold text-white">Compare, ask about buyout, or move into consultation</h3><p className="mt-4 max-w-3xl text-sm leading-7 text-white/68">If the current configuration feels too calm, too advanced, or difficult to place beside HBOT, RLT, or PEMF, the next step is to size the protocol and the room correctly before committing.</p><div className="mt-8 flex flex-wrap gap-4"><Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950" style={{ backgroundColor: line.accent }}>Request model guidance</Link><Link href="/rental" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-white">Review rental access</Link><Link href="/product/hydrogen" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold uppercase tracking-[0.24em] text-white">Return to hydrogen hub</Link></div></div><div className="grid gap-5"><SurfaceCard title="Trust after purchase" body="The visible trust layer stays practical: warranty context, public policy links, advisory support, and a clear route back to human contact." /><SurfaceCard title="Plan with confidence" body="Shipping, returns, and warranty stay one click away so the commercial terms remain easy to review before purchase." /><div className="grid gap-4 sm:grid-cols-3"><Link href="/shipping" className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white/84">Shipping</Link><Link href="/returns" className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white/84">Returns</Link><Link href="/warranty" className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm font-semibold text-white/84">Warranty</Link></div></div></div></div></section>
      </main>
    </>
  );
}
