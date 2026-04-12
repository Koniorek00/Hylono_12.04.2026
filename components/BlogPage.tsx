"use client";

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import {
    ArrowRight,
    Calendar,
    Clock,
    Search,
    Shield,
    X
} from 'lucide-react';
import { toBlogSlug } from '@/lib/blog';
import { SmartText } from './SmartText';
import { BLOG_POSTS, type BlogPost } from '../constants/content';

type SortOption = 'latest' | 'readTime';

interface BlogPageProps {
    onNavigate?: (page: string, tech?: string, mode?: string) => void;
}

const BLOG_CATEGORY_TO_ROUTE: Record<BlogPost['category'], string> = {
    HBOT: '/product/hbot',
    PEMF: '/product/pemf',
    RLT: '/product/rlt',
    Hydrogen: '/product/hydrogen',
    Protocols: '/protocols',
};

const BLOG_CATEGORY_TO_ROUTE_LABEL: Record<BlogPost['category'], string> = {
    HBOT: 'See HBOT systems',
    PEMF: 'See PEMF systems',
    RLT: 'See red light systems',
    Hydrogen: 'See hydrogen systems',
    Protocols: 'Browse protocols',
};

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

const FeaturedArticleCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className={`relative min-h-[22rem] bg-gradient-to-br ${post.image} p-8 md:p-10`}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-end gap-5">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
                        Featured guide
                    </span>
                    <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-white/85">
                        {post.category}
                    </span>
                    {post.trace_id && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                            <Shield size={12} />
                            Traceable claim
                        </span>
                    )}
                </div>

                <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        {post.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">
                        <SmartText>{post.excerpt}</SmartText>
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
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href={articleHref(post)}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100"
                    >
                        Read featured guide
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href={BLOG_CATEGORY_TO_ROUTE[post.category]}
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10"
                    >
                        {BLOG_CATEGORY_TO_ROUTE_LABEL[post.category]}
                    </Link>
                </div>
            </div>
        </div>
    </article>
);

const ArticleCard: React.FC<{ post: BlogPost }> = ({ post }) => (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <div className={`h-40 bg-gradient-to-br ${post.image}`} />

        <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${categoryBadgeClass(post.category)}`}>
                    {post.category}
                </span>
                {post.trace_id && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <Shield size={12} />
                        Traceable claim
                    </span>
                )}
            </div>

            <h3 className="text-xl font-bold text-slate-950">
                <Link href={articleHref(post)} className="transition-colors hover:text-cyan-700">
                    {post.title}
                </Link>
            </h3>

            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                <SmartText>{post.excerpt}</SmartText>
            </p>

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
                    href={BLOG_CATEGORY_TO_ROUTE[post.category]}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                >
                    {BLOG_CATEGORY_TO_ROUTE_LABEL[post.category]}
                </Link>
            </div>
        </div>
    </article>
);

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate: _onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState<BlogPost['category'] | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('latest');

    const categories: Array<BlogPost['category'] | 'All'> = ['All', 'HBOT', 'PEMF', 'RLT', 'Hydrogen', 'Protocols'];

    const guideCount = BLOG_POSTS.length;
    const traceableCount = BLOG_POSTS.filter((post) => Boolean(post.trace_id)).length;
    const protocolCount = BLOG_POSTS.filter((post) => post.category === 'Protocols').length;

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
                post.category.toLowerCase().includes(normalizedQuery)
            );
        });

        if (sortBy === 'readTime') {
            return posts.sort((a, b) => parseInt(a.readTime, 10) - parseInt(b.readTime, 10));
        }

        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchQuery, selectedCategory, sortBy]);

    const showFeatured = selectedCategory === 'All' && searchQuery.trim().length === 0;
    const featuredPost = showFeatured
        ? BLOG_POSTS.find((post) => Boolean(post.trace_id)) ?? BLOG_POSTS[0] ?? null
        : null;

    return (
        <div className="min-h-screen bg-slate-50 pb-24 pt-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6">
                <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                    <div className="inline-flex items-center rounded-full bg-cyan-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-800">
                        Guide Index
                    </div>

                    <h1 id="blog-hero-headline" className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                        Wellness Technology Guides
                    </h1>

                    <p id="blog-hero-description" className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                        Read guides and find the next step for HBOT, PEMF, red light, hydrogen, and stacked routines.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <a
                            href="#blog-article-grid"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                            Browse latest guides
                            <ArrowRight size={16} />
                        </a>
                        <Link
                            href="/protocols"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-950"
                        >
                            See protocols
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <span className="font-semibold text-slate-950">{guideCount}</span> current guides
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <span className="font-semibold text-slate-950">{traceableCount}</span> traceable-claim articles
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <span className="font-semibold text-slate-950">{protocolCount}</span> protocol stack guide
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_13rem]">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search articles, topics, or keywords"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-12 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-300"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as SortOption)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-cyan-300"
                            aria-label="Sort guides"
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
                                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-colors ${
                                        isActive
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

                {featuredPost && <FeaturedArticleCard post={featuredPost} />}

                <section id="blog-article-grid" className="scroll-mt-24">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-950">Latest guides</h2>
                            <p className="text-sm text-slate-600">
                                Showing {filteredPosts.length} of {BLOG_POSTS.length} guides.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPosts.map((post) => (
                            <ArticleCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>

                {filteredPosts.length === 0 && (
                    <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-slate-950">No guides match that search</h3>
                        <p className="mt-2 text-slate-600">
                            Clear the search or switch topic tracks to get back to the main guide index.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                                setSortBy('latest');
                            }}
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                            Reset filters
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
};
