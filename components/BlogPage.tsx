'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { ArrowRight, Calendar, Clock, Microscope, Route, Search, X } from 'lucide-react';
import { conditionGoals } from '@/content/conditions';
import { siteEntity, siteOwnership } from '@/content/site-entity';
import { SCHEMA_DATE_MODIFIED } from '@/lib/seo-schema';
import { PageOwnership } from '@/components/content/PageOwnership';
import { toBlogSlug } from '@/lib/blog';
import { BLOG_POSTS, type BlogConditionSlug, type BlogPost } from '../constants/content';

type SortOption = 'latest' | 'readTime';

const BLOG_CATEGORY_TO_ROUTE_LABEL: Record<BlogPost['category'], string> = {
    HBOT: 'Open the HBOT hub',
    PEMF: 'Open the PEMF hub',
    RLT: 'Open the red-light hub',
    Hydrogen: 'Open the hydrogen hub',
    Protocols: 'Browse protocols',
};

const CONDITION_LABELS = conditionGoals.reduce<Record<BlogConditionSlug, string>>((acc, goal) => {
    acc[goal.slug] = goal.title;
    return acc;
}, {} as Record<BlogConditionSlug, string>);

const HUB_ENTRY_PATHS = [
    {
        href: '/research',
        kicker: 'Need citations?',
        title: 'Open the research hub',
        description:
            'Read source studies, limitation notes, and modality summaries when the evidence question comes first.',
    },
    {
        href: '/conditions',
        kicker: 'Goal first',
        title: 'Start with condition guidance',
        description:
            'Use recovery, sleep, stress, comfort, or vitality pages when the right modality is still unclear.',
    },
    {
        href: '/store',
        kicker: 'Comparing equipment?',
        title: 'Move to the product hubs',
        description:
            'Open the category hub when you already know the modality family and need product-level context.',
    },
    {
        href: '/contact',
        kicker: 'Need a human next step?',
        title: 'Ask Hylono for planning help',
        description:
            'Use contact when the right path depends on scheduling, tolerance, or multi-modality planning.',
    },
] as const;

const categoryBadgeClass = (category: BlogPost['category']): string => {
    switch (category) {
        case 'HBOT':
            return 'bg-cyan-100 text-cyan-700';
        case 'PEMF':
            return 'bg-fuchsia-100 text-fuchsia-700';
        case 'RLT':
            return 'bg-red-100 text-red-700';
        case 'Hydrogen':
            return 'bg-sky-100 text-sky-700';
        case 'Protocols':
            return 'bg-slate-200 text-slate-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
};

const articleHref = (post: BlogPost): string => `/blog/${toBlogSlug(post.title)}`;

const formatReviewDate = (): string =>
    new Date(`${SCHEMA_DATE_MODIFIED}T00:00:00Z`).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

const getSupportLink = (post: BlogPost): { href: string; label: string } => {
    if (post.evidenceIds.length > 0) {
        return { href: '/research', label: 'Open cited research' };
    }

    const firstCondition = post.relatedConditionSlugs[0];
    if (firstCondition) {
        return {
            href: `/conditions/${firstCondition}`,
            label: `See ${CONDITION_LABELS[firstCondition]} guidance`,
        };
    }

    if (post.relatedProductRoute) {
        return {
            href: `/product/${post.relatedProductRoute}`,
            label: BLOG_CATEGORY_TO_ROUTE_LABEL[post.category],
        };
    }

    return { href: '/protocols', label: 'Browse protocols' };
};

const FeaturedArticleCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    const supportLink = getSupportLink(post);

    return (
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className={`relative min-h-[24rem] bg-gradient-to-br ${post.image} p-8 md:p-10`}>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-end gap-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
                            {post.articleType}
                        </span>
                        <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-white/85">
                            {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/85">
                            {post.evidenceIds.length > 0 ? <Microscope size={12} /> : <Route size={12} />}
                            {post.evidenceIds.length > 0 ? 'Evidence linked' : 'Goal-routing guide'}
                        </span>
                    </div>

                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                            {post.title}
                        </h2>
                        <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
                            {post.excerpt}
                        </p>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                            {post.answerSummary}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
                        <span className="inline-flex items-center gap-2">
                            <Clock size={14} />
                            {post.readTime}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Calendar size={14} />
                            {post.date}
                        </span>
                        {post.relatedConditionSlugs.slice(0, 2).map((slug) => (
                            <span key={slug} className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/85">
                                {CONDITION_LABELS[slug]}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href={articleHref(post)}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
                        >
                            Read the article
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href={supportLink.href}
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
                        >
                            {supportLink.label}
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};

const ArticleCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    const supportLink = getSupportLink(post);

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className={`h-40 bg-gradient-to-br ${post.image}`} />

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${categoryBadgeClass(post.category)}`}>
                        {post.category}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                        {post.articleType}
                    </span>
                    {post.evidenceIds.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <Microscope size={12} />
                            Evidence linked
                        </span>
                    ) : null}
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-950">
                    <Link href={articleHref(post)} className="transition-colors hover:text-cyan-700">
                        {post.title}
                    </Link>
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{post.answerSummary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {post.relatedConditionSlugs.slice(0, 2).map((slug) => (
                        <span key={slug} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            {CONDITION_LABELS[slug]}
                        </span>
                    ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                        <Clock size={14} />
                        {post.readTime}
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <Calendar size={14} />
                        {post.date}
                    </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                    <Link
                        href={articleHref(post)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                    >
                        Read article
                        <ArrowRight size={15} />
                    </Link>
                    <Link
                        href={supportLink.href}
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                    >
                        {supportLink.label}
                    </Link>
                </div>
            </div>
        </article>
    );
};

export const BlogPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<BlogPost['category'] | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('latest');

    const categories: Array<BlogPost['category'] | 'All'> = ['All', 'HBOT', 'PEMF', 'RLT', 'Hydrogen', 'Protocols'];

    const guideCount = BLOG_POSTS.length;
    const evidenceLinkedCount = BLOG_POSTS.filter((post) => post.evidenceIds.length > 0).length;
    const coveredConditionCount = new Set(BLOG_POSTS.flatMap((post) => post.relatedConditionSlugs)).size;
    const displayReviewDate = formatReviewDate();

    const filteredPosts = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        const posts = BLOG_POSTS.filter((post) => {
            if (selectedCategory !== 'All' && post.category !== selectedCategory) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            return (
                post.title.toLowerCase().includes(normalizedQuery) ||
                post.excerpt.toLowerCase().includes(normalizedQuery) ||
                post.category.toLowerCase().includes(normalizedQuery) ||
                post.answerSummary.toLowerCase().includes(normalizedQuery) ||
                post.audience.toLowerCase().includes(normalizedQuery) ||
                post.keyTakeaways.join(' ').toLowerCase().includes(normalizedQuery) ||
                post.relatedConditionSlugs.join(' ').toLowerCase().includes(normalizedQuery)
            );
        });

        if (sortBy === 'readTime') {
            return [...posts].sort((a, b) => parseInt(a.readTime, 10) - parseInt(b.readTime, 10));
        }

        return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchQuery, selectedCategory, sortBy]);

    const showFeatured = selectedCategory === 'All' && searchQuery.trim().length === 0;
    const featuredPost = showFeatured
        ? BLOG_POSTS.find((post) => post.evidenceIds.length > 0) ?? BLOG_POSTS[0] ?? null
        : null;

    return (
        <main className="min-h-screen bg-slate-50 pb-24 pt-10 text-slate-900">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6">
                <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.85fr)] lg:items-start">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                        <div className="inline-flex items-center rounded-full bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-800">
                            Science and guide hub
                        </div>

                        <h1 id="blog-hero-headline" className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                            Find the article that matches your next Hylono question
                        </h1>

                        <p id="blog-hero-description" className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                            Use the blog when you want a shorter, plain-language article before
                            jumping into cited research, condition pages, product hubs, or protocol
                            planning. This route is for orientation and decision support, not for
                            inflated claims.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <a
                                href="#blog-article-grid"
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                            >
                                Browse the article index
                                <ArrowRight size={16} />
                            </a>
                            <Link
                                href="/research"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950"
                            >
                                Go straight to research
                            </Link>
                        </div>

                        <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="font-semibold text-slate-950">{guideCount}</span> current
                                articles
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="font-semibold text-slate-950">{evidenceLinkedCount}</span>{' '}
                                evidence-linked notes
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <span className="font-semibold text-slate-950">{coveredConditionCount}</span>{' '}
                                connected condition paths
                            </div>
                        </div>
                    </div>

                    <PageOwnership
                        title="Editorial and review context"
                        description="This hub is reviewed to keep the article layer connected to the Hylono topic graph, visible trust pages, and conservative evidence handling."
                        items={[
                            {
                                label: siteOwnership.editorial.label,
                                value: siteOwnership.editorial.team,
                                detail: 'Owns article quality, clarity, and route-level guidance.',
                            },
                            {
                                label: siteOwnership.research.label,
                                value: siteOwnership.research.team,
                                detail: 'Reviews evidence-linked pages and conservative wording.',
                            },
                            {
                                label: 'Last reviewed',
                                value: displayReviewDate,
                                detail: 'Educational content on Hylono is reviewed for planning use, not as personalized medical advice.',
                            },
                            {
                                label: 'Support coverage',
                                value: `${siteEntity.serviceArea} | ${siteEntity.supportHours}`,
                                detail: `Need a guided next step? Use ${siteEntity.contactEmail} or the contact route.`,
                            },
                        ]}
                        actions={[
                            { href: '/about', label: 'About Hylono' },
                            { href: '/help', label: 'Support hub' },
                            { href: '/contact', label: 'Contact Hylono' },
                        ]}
                    />
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Start with the right path
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                            Use the hub that answers the real question first
                        </h2>
                        <p className="mt-3 text-base leading-7 text-slate-700">
                            The blog is strongest when it routes you quickly. If your question is
                            really about evidence, conditions, products, or support, jump to the
                            stronger page type instead of forcing an article to do everything.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {HUB_ENTRY_PATHS.map((path) => (
                            <article
                                key={path.href}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {path.kicker}
                                </p>
                                <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">
                                    {path.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {path.description}
                                </p>
                                <Link
                                    href={path.href}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                                >
                                    Open this path
                                    <ArrowRight size={15} />
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_13rem]">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search articles, goals, or article intent"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-12 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-300"
                            />
                            {searchQuery ? (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            ) : null}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as SortOption)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-cyan-300"
                            aria-label="Sort articles"
                        >
                            <option value="latest">Latest first</option>
                            <option value="readTime">Quick reads</option>
                        </select>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;

                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${isActive
                                        ? 'bg-slate-950 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {featuredPost ? <FeaturedArticleCard post={featuredPost} /> : null}

                <section id="blog-article-grid" className="scroll-mt-24">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-950">
                                Article index
                            </h2>
                            <p className="text-sm text-slate-600">
                                Showing {filteredPosts.length} of {BLOG_POSTS.length} articles. Each
                                card links to a stronger next internal path.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <ArticleCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>

                {filteredPosts.length === 0 ? (
                    <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
                        <h3 className="text-xl font-black tracking-tight text-slate-950">
                            No article matches that search
                        </h3>
                        <p className="mt-2 text-slate-600">
                            Reset the filters or move straight to research, conditions, or support.
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                    setSortBy('latest');
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-white transition-colors hover:bg-slate-800"
                            >
                                Reset filters
                            </button>
                            <Link href="/research" className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">
                                Open research
                            </Link>
                            <Link href="/conditions" className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">
                                Browse conditions
                            </Link>
                            <Link href="/contact" className="text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950">
                                Ask Hylono
                            </Link>
                        </div>
                    </section>
                ) : null}
            </div>
        </main>
    );
};
