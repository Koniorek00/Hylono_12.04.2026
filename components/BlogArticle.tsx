import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock, ExternalLink, Microscope, Route } from 'lucide-react';
import { conditionGoals } from '@/content/conditions';
import { evidenceById } from '@/content/evidence';
import { protocolBySlug } from '@/content/protocols';
import { siteEntity, siteOwnership } from '@/content/site-entity';
import { SCHEMA_DATE_MODIFIED } from '@/lib/seo-schema';
import { toBlogSlug } from '@/lib/blog';
import { PageOwnership } from '@/components/content/PageOwnership';
import { BLOG_POSTS, type BlogConditionSlug, type BlogPost } from '../constants/content';

const CONDITION_LABELS = conditionGoals.reduce<Record<BlogConditionSlug, string>>((acc, goal) => {
    acc[goal.slug] = goal.title;
    return acc;
}, {} as Record<BlogConditionSlug, string>);

const PRODUCT_LINKS: Record<Exclude<BlogPost['relatedProductRoute'], null>, { href: string; label: string; description: string }> = {
    hbot: {
        href: '/product/hbot',
        label: 'HBOT hub',
        description: 'Compare the HBOT category, support context, and next-step commercial path.',
    },
    pemf: {
        href: '/product/pemf',
        label: 'PEMF hub',
        description: 'Review PEMF category fit and move from orientation into product-level context.',
    },
    rlt: {
        href: '/product/rlt',
        label: 'Red-light hub',
        description: 'Compare the red-light category once the modality itself is likely relevant.',
    },
    hydrogen: {
        href: '/product/hydrogen',
        label: 'Hydrogen hub',
        description: 'Open the hydrogen category hub for equipment context and planning details.',
    },
};

const formatReviewDate = (): string =>
    new Date(`${SCHEMA_DATE_MODIFIED}T00:00:00Z`).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

const sharesContext = (left: BlogPost, right: BlogPost): boolean =>
    left.category === right.category ||
    left.relatedConditionSlugs.some((slug) => right.relatedConditionSlugs.includes(slug));

export function BlogArticle({ article }: { article: BlogPost }) {
    const evidenceItems = article.evidenceIds
        .map((id) => evidenceById[id])
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
    const displayReviewDate = formatReviewDate();
    const relatedPosts = BLOG_POSTS.filter((post) => post.id !== article.id && sharesContext(article, post)).slice(0, 3);
    const relatedProtocols = article.relatedProtocolSlugs
        .map((slug) => protocolBySlug[slug])
        .filter((protocol): protocol is NonNullable<typeof protocol> => Boolean(protocol));
    const relatedConditions = article.relatedConditionSlugs.map((slug) => ({
        href: `/conditions/${slug}`,
        label: `${CONDITION_LABELS[slug]} guide`,
        description: `See how ${CONDITION_LABELS[slug].toLowerCase()} questions connect into the wider Hylono path.`,
    }));
    const relatedProduct = article.relatedProductRoute ? PRODUCT_LINKS[article.relatedProductRoute] : null;
    const nextStepCards = [
        ...relatedConditions.slice(0, 2),
        ...(relatedProduct ? [relatedProduct] : []),
        ...relatedProtocols.slice(0, 2).map((protocol) => ({
            href: `/protocols/${protocol.slug}`,
            label: protocol.title,
            description: protocol.shortDescription,
        })),
        {
            href: '/research',
            label: 'Research hub',
            description: 'Open the cited-study library when you need source context and limitations.',
        },
        {
            href: '/contact',
            label: 'Contact Hylono',
            description: 'Use support when your next step depends on schedule, fit, or stack planning.',
        },
    ].filter((item, index, array) => array.findIndex((candidate) => candidate.href === item.href) === index);

    return (
        <main className="min-h-screen bg-slate-50 pb-24 pt-10 text-slate-900">
            <div className="mx-auto max-w-6xl px-6">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
                >
                    <ArrowLeft size={16} />
                    Back to blog
                </Link>

                <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.85fr)] lg:items-start">
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className={`relative overflow-hidden bg-gradient-to-br ${article.image} px-8 py-10 md:px-10 md:py-12`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent" />

                            <div className="relative z-10 max-w-4xl">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                                        {article.articleType}
                                    </span>
                                    <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-white/85">
                                        {article.category}
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85">
                                        {evidenceItems.length > 0 ? <Microscope size={12} /> : <Route size={12} />}
                                        {evidenceItems.length > 0 ? `${evidenceItems.length} cited records` : 'Planning article'}
                                    </span>
                                </div>

                                <h1
                                    id="article-reader-title"
                                    className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white md:text-5xl"
                                >
                                    {article.title}
                                </h1>

                                <p
                                    id="article-reader-excerpt"
                                    className="mt-5 max-w-3xl text-lg leading-8 text-white/80"
                                >
                                    {article.excerpt}
                                </p>

                                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70">
                                    {article.answerSummary}
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/75">
                                    <span className="inline-flex items-center gap-2">
                                        <Calendar size={14} />
                                        {article.date}
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <Clock size={14} />
                                        {article.readTime}
                                    </span>
                                    <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/85">
                                        Audience: {article.audience}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 p-8 md:p-10">
                            <div className="grid gap-4 md:grid-cols-3">
                                {article.keyTakeaways.map((takeaway) => (
                                    <div key={takeaway} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <p className="text-sm leading-7 text-slate-700">{takeaway}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <PageOwnership
                        title="Article review context"
                        description="This page is intended to help a visitor move from a shorter article read into the stronger Hylono route for research, products, protocols, or support."
                        items={[
                            {
                                label: siteOwnership.editorial.label,
                                value: siteOwnership.editorial.team,
                                detail: 'Owns article scope, messaging clarity, and visible route fit.',
                            },
                            {
                                label: siteOwnership.research.label,
                                value: siteOwnership.research.team,
                                detail: evidenceItems.length > 0
                                    ? 'Reviews cited-study alignment and conservative wording on evidence-linked articles.'
                                    : 'Reviews conservative wording and keeps planning guidance inside the site evidence posture.',
                            },
                            {
                                label: 'Last reviewed',
                                value: displayReviewDate,
                                detail: 'Use this page for planning and orientation, not as personalized professional advice.',
                            },
                            {
                                label: 'Support coverage',
                                value: `${siteEntity.serviceArea} | ${siteEntity.supportHours}`,
                                detail: `Need direct help? ${siteEntity.contactEmail} routes visitors into planning support.`,
                            },
                        ]}
                        actions={[
                            { href: '/about', label: 'About Hylono' },
                            { href: '/help', label: 'Support hub' },
                            { href: '/contact', label: 'Contact Hylono' },
                        ]}
                    />
                </section>

                <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.7fr)]">
                    <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                        <div className="space-y-12">
                            {article.sections.map((section) => (
                                <section key={section.heading}>
                                    <h2 className="text-3xl font-black tracking-tight text-slate-950">
                                        {section.heading}
                                    </h2>
                                    <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">
                                        {section.paragraphs.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                    {section.bullets?.length ? (
                                        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                                            {section.bullets.map((bullet) => (
                                                <li
                                                    key={bullet}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                                >
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </section>
                            ))}
                        </div>
                    </article>

                    <div className="space-y-6">
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Scope and limitations
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                                What this page should not do
                            </h2>
                            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                                {article.limitations.map((limitation) => (
                                    <li key={limitation} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        {limitation}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Best next route
                            </p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                                Move to the stronger page type fast
                            </h2>
                            <div className="mt-5 space-y-4">
                                {nextStepCards.map((card) => (
                                    <Link
                                        key={card.href}
                                        href={card.href}
                                        className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 hover:bg-slate-100"
                                    >
                                        <p className="font-semibold text-slate-950">{card.label}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {card.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Evidence and sourcing
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                        {evidenceItems.length > 0 ? 'Canonical records used on this page' : 'No direct citations on this page yet'}
                    </h2>

                    {evidenceItems.length > 0 ? (
                        <>
                            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
                                These records come from the canonical evidence library and should be
                                read together with their population, endpoint, and limitation
                                context.
                            </p>
                            <div className="mt-8 grid gap-5 lg:grid-cols-2">
                                {evidenceItems.map((evidence) => (
                                    <article
                                        key={evidence.id}
                                        className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                                                {evidence.primaryModality}
                                            </span>
                                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                                                {evidence.studyType}
                                            </span>
                                            <span className="text-xs font-medium text-slate-500">{evidence.year}</span>
                                        </div>

                                        <h3 className="mt-4 text-xl font-black leading-8 text-slate-950">
                                            {evidence.title}
                                        </h3>
                                        <p className="mt-3 text-sm text-slate-500">
                                            {evidence.authors} | {evidence.publication}
                                        </p>
                                        <p className="mt-4 text-sm leading-7 text-slate-700">
                                            {evidence.resultSummary}
                                        </p>

                                        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
                                            <a
                                                href={evidence.sourceUrl}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="inline-flex items-center gap-2 text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
                                            >
                                                Open source record
                                                <ExternalLink size={14} />
                                            </a>
                                            <Link
                                                href="/research"
                                                className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
                                            >
                                                Compare in research hub
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                                <p className="text-sm leading-7 text-slate-700">
                                    This article is intentionally positioned as a planning and
                                    routing surface. It helps clarify the question, but it should
                                    not pretend to be a complete evidence review when the canonical
                                    evidence library for this topic is not surfaced here yet.
                                </p>
                                <p className="mt-4 text-sm leading-7 text-slate-700">
                                    If you need stronger source context before acting, open the
                                    research hub, a condition guide, or contact Hylono for a
                                    narrower recommendation path.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-white p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Stronger next step
                                </p>
                                <div className="mt-4 flex flex-col gap-3 text-sm font-semibold">
                                    <Link href="/research" className="underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">
                                        Open research
                                    </Link>
                                    <Link href="/conditions" className="underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">
                                        Browse conditions
                                    </Link>
                                    <Link href="/contact" className="underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">
                                        Ask Hylono
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                Keep reading
                            </p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                                Related articles
                            </h2>
                        </div>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                        >
                            Browse the full index
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {relatedPosts.map((post) => (
                            <article
                                key={post.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                            >
                                <div className={`h-28 bg-gradient-to-br ${post.image}`} />
                                <div className="p-5">
                                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                                        {post.articleType}
                                    </span>
                                    <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
                                        <Link
                                            href={`/blog/${toBlogSlug(post.title)}`}
                                            className="transition-colors hover:text-cyan-700"
                                        >
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {post.answerSummary}
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {post.relatedConditionSlugs.slice(0, 2).map((slug) => (
                                            <span key={slug} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                                                {CONDITION_LABELS[slug]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
