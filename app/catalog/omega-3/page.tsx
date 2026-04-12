import type { Metadata } from 'next';
import Image from 'next/image';
import {
  formatPln,
  omega3CatalogMeta,
  omega3CatalogRows,
  omega3CatalogSections,
  type Omega3CatalogSection,
  type Omega3CatalogTile,
  type Omega3CatalogVariant,
} from '@/content/catalogs/omega3';
import { siteOwnership } from '@/content/site-entity';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/seo-metadata';
import { ORGANIZATION_ID, createBreadcrumbSchema, createCollectionPageSchema } from '@/lib/seo-schema';
import { StaticStructuredData } from '@/src/components/StaticStructuredData';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const CATALOG_PATH = '/catalog/omega-3';
const CATALOG_DATE = omega3CatalogMeta.editionDate;

// [DECISION: SSG because this route is a fixed sales-collateral catalogue whose content is updated editorially rather than per-request. It remains noindex,follow because it functions as a premium catalogue sheet, not a canonical search landing page.]

export const metadata: Metadata = createPageMetadata({
  title: 'Technologia Molekularna Omega-3 2026 | Katalog urządzeń wodorowych',
  description: omega3CatalogMeta.subtitle,
  path: CATALOG_PATH,
  forceNoIndex: true,
  ogImagePath: omega3CatalogMeta.hero.image,
  ogImageAlt: omega3CatalogMeta.hero.imageAlt,
});

function SectionAccent({
  index,
  label,
  range,
}: {
  index: string;
  label: string;
  range: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-slate-200 pb-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-cyan-700">{index}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">{label}</h2>
      </div>
      <div className="hidden text-right md:block">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">Zakres linii</p>
        <p className="mt-1 text-sm text-slate-600">{range}</p>
      </div>
    </div>
  );
}

function DetailList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="list-disc pl-1 marker:text-cyan-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function VariantPanel({ variant }: { variant: Omega3CatalogVariant }) {
  return (
    <article className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-[32rem]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Model</p>
          <h4 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{variant.model}</h4>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-800">{variant.lead}</p>
        </div>
        <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50 px-4 py-3 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Cennik 2026</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{formatPln(variant.pricing.grossPrice)}</p>
          <p className="text-xs font-medium text-slate-500">{formatPln(variant.pricing.netPrice)} netto</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {variant.specs.map((item) => (
          <div
            key={`${variant.id}-${item.label}`}
            className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_99.9%)] px-4 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">{variant.description}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <DetailList title="Korzyści w rytuale" items={variant.benefits} />
        <DetailList title="Wyróżnia model" items={variant.differentiators} />
      </div>

      <div className="mt-4 grid gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-4 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Przepływ / stężenie</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{variant.shortFlow}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Wymiary</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{variant.dimensions}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Waga</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{variant.weight}</p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-500">{variant.story}</p>
    </article>
  );
}

function ProductClusterCard({
  tile,
  featured = false,
}: {
  tile: Omega3CatalogTile;
  featured?: boolean;
}) {
  const imagePaneClass = featured
    ? 'relative min-h-[22rem] bg-slate-950'
    : 'relative min-h-[16rem] bg-slate-950';

  const contentClass = featured ? 'p-6 md:p-8 lg:p-10' : 'p-5 md:p-6';

  return (
    <article
      className={`overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)] ${
        featured ? '' : 'shadow-[0_14px_45px_rgba(15,23,42,0.05)]'
      }`}
    >
      <div className={featured ? 'grid gap-0 lg:grid-cols-[0.96fr_1.04fr]' : 'grid gap-0 lg:grid-cols-[0.82fr_1.18fr]'}>
        <div className={imagePaneClass}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.18),transparent_35%),linear-gradient(135deg,#0f172a_0%,#10263f_48%,#09111f_99.9%)]" />
          <div className="absolute inset-0 bg-[length:99.9%_24px] bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.08)_1px,transparent_2px)] opacity-20" />
          <div className="absolute left-5 top-5 z-10 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-100 backdrop-blur">
            {tile.label}
          </div>
          <div className="relative h-full p-5 md:p-6">
            <div className="relative h-full min-h-[15rem] overflow-hidden rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,#fbfdff_0%,#edf4ff_99.9%)] shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
              <Image
                src={tile.image}
                alt={tile.imageAlt}
                fill
                sizes={featured ? '(min-width: 1024px) 44vw, 100vw' : '(min-width: 1024px) 34vw, 100vw'}
                className="object-contain p-5"
              />
            </div>
          </div>
        </div>

        <div className={contentClass}>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-700">{tile.family}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{tile.label}</h3>
              <p className="mt-3 text-base font-medium leading-7 text-slate-800">{tile.lead}</p>
            </div>

            <p className="text-sm leading-7 text-slate-600">{tile.summary}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              {tile.quickFacts.map((fact) => (
                <div
                  key={`${tile.id}-${fact}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-medium text-slate-700"
                >
                  {fact}
                </div>
              ))}
            </div>

            <div className="rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_99.9%)] px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Storytelling</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{tile.story}</p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <DetailList title="Kluczowe korzyści" items={tile.benefits} />
              <DetailList title="Wyróżniki linii" items={tile.highlights} />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Warianty i specyfikacje</p>
              <div className={`grid gap-4 ${tile.variants.length > 1 ? 'xl:grid-cols-2' : ''}`}>
                {tile.variants.map((variant) => (
                  <VariantPanel key={variant.id} variant={variant} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CatalogSection({ section }: { section: Omega3CatalogSection }) {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <SectionAccent index={section.kicker} label={section.title} range={section.rangeLabel} />
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 md:text-base">{section.summary}</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
          <ProductClusterCard tile={section.featured} featured />
          <div className="space-y-5">
            {section.siblings.map((tile) => (
              <ProductClusterCard key={tile.id} tile={tile} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Omega3CatalogPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog/omega-3' },
  ]);

  const catalogCollectionSchema = createCollectionPageSchema({
    name: omega3CatalogMeta.title,
    description: omega3CatalogMeta.subtitle,
    path: CATALOG_PATH,
    dateModified: CATALOG_DATE,
    imageUrl: `${SITE_URL}${omega3CatalogMeta.hero.image}`,
  });

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}${CATALOG_PATH}#catalog-list`,
    name: omega3CatalogMeta.title,
    description: omega3CatalogMeta.subtitle,
    url: `${SITE_URL}${CATALOG_PATH}`,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: omega3CatalogRows.length,
    isPartOf: { '@id': `${SITE_URL}${CATALOG_PATH}` },
    publisher: { '@id': ORGANIZATION_ID() },
    itemListElement: omega3CatalogRows.map((row, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: row.model,
      url: `${SITE_URL}${CATALOG_PATH}#${row.id}`,
      item: {
        '@type': 'Product',
        '@id': `${SITE_URL}${CATALOG_PATH}#${row.id}`,
        name: row.model,
        category: row.family,
        description: row.summary,
        image: `${SITE_URL}${row.image}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PLN',
          price: row.grossPrice,
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}${CATALOG_PATH}#${row.id}`,
          seller: { '@id': ORGANIZATION_ID() },
        },
      },
    })),
  };

  return (
    <div className="catalog-print bg-[linear-gradient(180deg,#f7fbff_0%,#edf5ff_26%,#ffffff_99.9%)] text-slate-950">
      <StaticStructuredData data={breadcrumbSchema} />
      <StaticStructuredData data={catalogCollectionSchema} />
      <StaticStructuredData data={itemListSchema} />

      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,rgba(8,15,28,0.98)_0%,rgba(14,23,40,0.96)_48%,rgba(15,23,42,0.88)_99.9%)]" />
        <div className="absolute inset-0 bg-[length:99.9%_22px] bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.08)_1px,transparent_2px)] opacity-20" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-20">
          <div className="space-y-6 text-white">
            <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-100 backdrop-blur">
              Edycja katalogowa {CATALOG_DATE}
            </div>
            <div className="max-w-4xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.44em] text-cyan-200/90">Molekularna Omega-3</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">{omega3CatalogMeta.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">{omega3CatalogMeta.subtitle}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {omega3CatalogMeta.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[1.4rem] border border-white/12 bg-white/7 px-4 py-4 text-sm leading-7 text-slate-100 backdrop-blur"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-cyan-300/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/18 bg-white/90 shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
              <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,#fbfdff_0%,#edf4ff_99.9%)]">
                <Image
                  src={omega3CatalogMeta.hero.image}
                  alt={omega3CatalogMeta.hero.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-contain p-8"
                />
              </div>
              <div className="grid gap-0 border-t border-slate-200 sm:grid-cols-2">
                <div className="border-r border-slate-200 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Cover family</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{omega3CatalogMeta.hero.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{omega3CatalogMeta.hero.family}</p>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Od</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatPln(omega3CatalogMeta.hero.priceFrom)}</p>
                  <p className="mt-1 text-sm text-slate-500">brutto w katalogu Omega-3 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.06)] md:grid-cols-[1.3fr_0.7fr] md:p-8">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-700">Nota redakcyjna</p>
            <p className="max-w-4xl text-sm leading-7 text-slate-600 md:text-base">{omega3CatalogMeta.disclaimer}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Redakcja</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{siteOwnership.editorial.team}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Weryfikacja</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{siteOwnership.research.team}</p>
            </div>
          </div>
        </div>
      </section>

      {omega3CatalogSections.map((section) => (
        <CatalogSection key={section.id} section={section} />
      ))}

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-200 px-6 py-5 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-700">05 · Matryca modeli i cen</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Wszystkie modele w jednym zestawieniu 2026
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 md:text-base">
              Tabela końcowa zamyka katalog jako czysty arkusz ofertowy: pomaga szybko porównać linię, segment, kluczowy parametr oraz aktualną cenę netto i brutto.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Model</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Linia</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Typ</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Skrót specyfikacji</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Netto</th>
                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.3em]">Brutto</th>
                </tr>
              </thead>
              <tbody>
                {omega3CatalogRows.map((row, index) => (
                  <tr key={row.id} id={row.id} className={index % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                    <td className="px-5 py-4 align-top font-semibold text-slate-950">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-700">{row.model}</div>
                    </td>
                    <td className="px-5 py-4 align-top text-slate-700">{row.line}</td>
                    <td className="px-5 py-4 align-top text-slate-600">{row.family}</td>
                    <td className="px-5 py-4 align-top text-slate-600">{row.briefSpec}</td>
                    <td className="px-5 py-4 align-top font-semibold text-slate-800">{formatPln(row.netPrice)}</td>
                    <td className="px-5 py-4 align-top font-semibold text-slate-950">{formatPln(row.grossPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div className="grid gap-8 rounded-[2.25rem] border border-slate-200 bg-[linear-gradient(135deg,#09111f_0%,#10263f_60%,#09111f_99.9%)] p-7 text-white shadow-[0_24px_90px_rgba(15,23,42,0.24)] md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-300">Contact sheet</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Karta kontaktowa do rozmów premium i ofert 2026</h2>
            <p className="text-sm leading-7 text-slate-300 md:text-base">
              Telefon {omega3CatalogMeta.contact.phone} · {omega3CatalogMeta.contact.email} · {omega3CatalogMeta.contact.address}
            </p>
            <p className="text-sm leading-7 text-slate-300 md:text-base">
              Użyj tego katalogu jako materiału do rozmowy doradczej, porównania rodzin urządzeń i przygotowania dopasowanej oferty dla domu, gabinetu lub strefy wellness.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/12 bg-white/8 px-5 py-4 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-300">Edycja</p>
              <p className="mt-2 text-lg font-semibold text-white">{CATALOG_DATE}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/12 bg-white/8 px-5 py-4 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-300">Zakres</p>
              <p className="mt-2 text-lg font-semibold text-white">4 linie · 22 modele</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
