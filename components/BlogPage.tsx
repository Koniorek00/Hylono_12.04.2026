import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Calendar, Clock, ArrowRight, Tag, Search, Filter,
    Bookmark, BookmarkCheck, TrendingUp, Sparkles, Shield,
    Grid, List, SlidersHorizontal, X, ChevronDown, Star,
    Microscope, FileText, Eye, MessageCircle, Zap, Edit3, Plus
} from 'lucide-react';
import { SmartText } from './SmartText';
import { BLOG_POSTS, BlogPost, RESEARCH_STUDIES } from '../constants/content';

// Lazy load heavy components
const ArticleReader = React.lazy(() => import('./blog/ArticleReader').then(m => ({ default: m.ArticleReader })));
const BlogEditor = React.lazy(() => import('./blog/BlogEditor').then(m => ({ default: m.BlogEditor })));

// === TYPES ===
type ViewType = 'grid' | 'list' | 'compact';
type SortOption = 'latest' | 'popular' | 'readTime';

interface ReadingListItem {
    id: number;
    addedAt: string;
}

// === FEATURED ARTICLE CARD ===
const FeaturedArticleCard: React.FC<{ post: BlogPost; onClick: () => void }> = ({ post, onClick }) => (
    <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="relative rounded-3xl overflow-hidden cursor-pointer group"
    >
        <div className={`h-80 md:h-96 bg-gradient-to-br ${post.image} p-8 flex flex-col justify-end`}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-bold text-white uppercase tracking-wider">
                        Featured
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-bold text-white/80">
                        {post.category}
                    </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {post.title}
                </h2>

                <p className="text-white/70 text-sm md:text-base mb-4 line-clamp-2">
                    <SmartText>{post.excerpt}</SmartText>
                </p>

                <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                        <Clock size={14} /> {post.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={14} /> {post.date}
                    </span>
                    {post.trace_id && (
                        <span className="flex items-center gap-1 text-emerald-400">
                            <Shield size={14} /> Evidence Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Hover Arrow */}
            <motion.div
                className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
            >
                <ArrowRight size={20} />
            </motion.div>
        </div>
    </motion.article>
);

// === ARTICLE CARD ===
interface ArticleCardProps {
    post: BlogPost;
    viewType: ViewType;
    isBookmarked: boolean;
    onToggleBookmark: () => void;
    onClick: () => void;
    index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
    post, viewType, isBookmarked, onToggleBookmark, onClick, index
}) => {
    // Grid view
    if (viewType === 'grid') {
        return (
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-cyan-100 transition-all group cursor-pointer"
            >
                <div onClick={onClick}>
                    <div className={`h-40 bg-gradient-to-br ${post.image} relative`}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all"
                        >
                            {isBookmarked ? (
                                <BookmarkCheck size={16} className="text-cyan-600" />
                            ) : (
                                <Bookmark size={16} className="text-slate-400" />
                            )}
                        </button>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${post.category === 'HBOT' ? 'bg-cyan-100 text-cyan-700' :
                                post.category === 'PEMF' ? 'bg-purple-100 text-purple-700' :
                                    post.category === 'RLT' ? 'bg-red-100 text-red-700' :
                                        post.category === 'Hydrogen' ? 'bg-sky-100 text-sky-700' :
                                            'bg-slate-100 text-slate-700'
                                }`}>
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock size={12} /> {post.readTime}
                            </span>
                        </div>

                        <h3 className="font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
                            {post.title}
                        </h3>

                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                            <SmartText>{post.excerpt}</SmartText>
                        </p>

                        {post.trace_id && (
                            <div className="flex items-center gap-2 mb-4 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                                <Shield size={12} className="text-emerald-500" />
                                <span className="text-[10px] font-mono font-bold text-emerald-700">
                                    {post.trace_id}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar size={12} /> {post.date}
                            </span>
                            <span className="text-xs font-bold text-cyan-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read <ArrowRight size={12} />
                            </span>
                        </div>
                    </div>
                </div>
            </motion.article>
        );
    }

    // List view
    if (viewType === 'list') {
        return (
            <motion.article
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={onClick}
                className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-6 hover:shadow-lg hover:border-cyan-100 transition-all group cursor-pointer"
            >
                <div className={`w-48 h-32 rounded-xl bg-gradient-to-br ${post.image} flex-shrink-0`} />

                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${post.category === 'HBOT' ? 'bg-cyan-100 text-cyan-700' :
                            post.category === 'PEMF' ? 'bg-purple-100 text-purple-700' :
                                post.category === 'RLT' ? 'bg-red-100 text-red-700' :
                                    post.category === 'Hydrogen' ? 'bg-sky-100 text-sky-700' :
                                        'bg-slate-100 text-slate-700'
                            }`}>
                            {post.category}
                        </span>
                        {post.trace_id && (
                            <span className="flex items-center gap-1 text-emerald-600 text-xs">
                                <Shield size={12} /> Verified
                            </span>
                        )}
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                        {post.title}
                    </h3>

                    <p className="text-sm text-slate-500 flex-1">
                        <SmartText>{post.excerpt}</SmartText>
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye size={12} /> {Math.floor(Math.random() * 500) + 100}
                        </span>
                    </div>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
                    className="self-start p-2 hover:bg-slate-100 rounded-lg transition-all"
                >
                    {isBookmarked ? (
                        <BookmarkCheck size={18} className="text-cyan-600" />
                    ) : (
                        <Bookmark size={18} className="text-slate-400" />
                    )}
                </button>
            </motion.article>
        );
    }

    // Compact view
    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.02 }}
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all cursor-pointer group"
        >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${post.image} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate group-hover:text-cyan-600 transition-colors">
                    {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-cyan-600 transition-colors" />
        </motion.article>
    );
};

// === MAIN BLOG PAGE ===
interface BlogPageProps {
    onNavigate?: (page: string, tech?: string, mode?: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
    // State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewType, setViewType] = useState<ViewType>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [readingList, setReadingList] = useState<ReadingListItem[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [showEditor, setShowEditor] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Categories
    const categories = ['All', 'HBOT', 'PEMF', 'RLT', 'Hydrogen', 'Protocols'];

    // Load reading list from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('hylono_reading_list');
        if (saved) setReadingList(JSON.parse(saved));
    }, []);

    // Save reading list to localStorage
    useEffect(() => {
        localStorage.setItem('hylono_reading_list', JSON.stringify(readingList));
    }, [readingList]);

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        let posts = [...BLOG_POSTS];

        // Category filter
        if (selectedCategory && selectedCategory !== 'All') {
            posts = posts.filter(p => p.category === selectedCategory);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.excerpt.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case 'popular':
                // Simulated popularity (in production, would use actual metrics)
                posts.sort(() => Math.random() - 0.5);
                break;
            case 'readTime':
                posts.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
                break;
            default: // latest
                posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        return posts;
    }, [selectedCategory, searchQuery, sortBy]);

    // Toggle bookmark
    const toggleBookmark = useCallback((postId: number) => {
        setReadingList(list => {
            const exists = list.find(item => item.id === postId);
            if (exists) {
                return list.filter(item => item.id !== postId);
            }
            return [...list, { id: postId, addedAt: new Date().toISOString() }];
        });
    }, []);

    // Check if bookmarked
    const isBookmarked = useCallback((postId: number) => {
        return readingList.some(item => item.id === postId);
    }, [readingList]);

    // Navigate articles in reader
    const handleNavigateArticle = useCallback((direction: 'prev' | 'next') => {
        if (!selectedPost) return;
        const currentIndex = filteredPosts.findIndex(p => p.id === selectedPost.id);
        if (direction === 'prev' && currentIndex > 0) {
            setSelectedPost(filteredPosts[currentIndex - 1]);
        } else if (direction === 'next' && currentIndex < filteredPosts.length - 1) {
            setSelectedPost(filteredPosts[currentIndex + 1]);
        }
    }, [selectedPost, filteredPosts]);

    // Featured post (first post or first with trace_id)
    const featuredPost = BLOG_POSTS.find(p => p.trace_id) || BLOG_POSTS[0];

    // === RENDER ===
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={14} />
                        Knowledge Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Bio-Optimization Insights
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Evidence-based articles, research summaries, and protocol guides for your regeneration journey
                    </p>
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search articles, topics, or keywords..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-300 focus:ring-4 focus:ring-cyan-50 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full"
                                >
                                    <X size={14} className="text-slate-400" />
                                </button>
                            )}
                        </div>

                        {/* View Type Toggle */}
                        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                            {[
                                { type: 'grid' as ViewType, icon: <Grid size={16} /> },
                                { type: 'list' as ViewType, icon: <List size={16} /> },
                                { type: 'compact' as ViewType, icon: <FileText size={16} /> }
                            ].map(item => (
                                <button
                                    key={item.type}
                                    onClick={() => setViewType(item.type)}
                                    className={`p-2 rounded-lg transition-all ${viewType === item.type
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-300 transition-colors"
                        >
                            <option value="latest">Latest</option>
                            <option value="popular">Popular</option>
                            <option value="readTime">Quick Reads</option>
                        </select>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                }`}
                        >
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>

                        {/* Write Button (for writers) */}
                        <button
                            onClick={() => setShowEditor(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                        >
                            <Edit3 size={16} />
                            Write
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 mt-4 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-3">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${(!selectedCategory && cat === 'All') || selectedCategory === cat
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}

                                        <div className="flex-1" />

                                        {/* Reading List Count */}
                                        {readingList.length > 0 && (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl text-amber-700 text-xs font-bold">
                                                <Bookmark size={14} />
                                                {readingList.length} saved
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Featured Article */}
                {!searchQuery && !selectedCategory && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <FeaturedArticleCard
                            post={featuredPost}
                            onClick={() => setSelectedPost(featuredPost)}
                        />
                    </motion.div>
                )}

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    {[
                        { label: 'Total Articles', value: BLOG_POSTS.length, icon: <FileText size={18} /> },
                        { label: 'Research Backed', value: BLOG_POSTS.filter(p => p.trace_id).length, icon: <Shield size={18} /> },
                        { label: 'Related Studies', value: RESEARCH_STUDIES.length, icon: <Microscope size={18} /> },
                        { label: 'Your Saved', value: readingList.length, icon: <Bookmark size={18} /> }
                    ].map((stat, i) => (
                        <div key={stat.label} className="p-4 bg-white rounded-xl border border-slate-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Articles Grid */}
                <div className={`${viewType === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' :
                    viewType === 'list' ? 'flex flex-col gap-4' :
                        'grid md:grid-cols-2 gap-3'
                    }`}>
                    {filteredPosts.map((post, i) => (
                        <ArticleCard
                            key={post.id}
                            post={post}
                            viewType={viewType}
                            isBookmarked={isBookmarked(post.id)}
                            onToggleBookmark={() => toggleBookmark(post.id)}
                            onClick={() => setSelectedPost(post)}
                            index={i}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Search size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}

                {/* @ Mention Hint */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                            <Zap size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 mb-1">Smart References</h3>
                            <p className="text-sm text-slate-600">
                                Articles can link to devices (<code className="px-1.5 py-0.5 bg-white rounded text-cyan-600 font-mono text-xs">@machine:HBOT</code>),
                                research (<code className="px-1.5 py-0.5 bg-white rounded text-cyan-600 font-mono text-xs">@research:VO2-Study</code>),
                                and protocols (<code className="px-1.5 py-0.5 bg-white rounded text-cyan-600 font-mono text-xs">@protocol:Superhuman</code>).
                                Hover over linked references in articles to see instant previews.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Article Reader Modal */}
            <React.Suspense fallback={null}>
                <AnimatePresence>
                    {selectedPost && (
                        <ArticleReader
                            post={selectedPost}
                            onClose={() => setSelectedPost(null)}
                            onNavigate={handleNavigateArticle}
                            canNavigate={{
                                prev: filteredPosts.findIndex(p => p.id === selectedPost.id) > 0,
                                next: filteredPosts.findIndex(p => p.id === selectedPost.id) < filteredPosts.length - 1
                            }}
                        />
                    )}
                </AnimatePresence>
            </React.Suspense>

            {/* Blog Editor Modal */}
            <React.Suspense fallback={null}>
                <AnimatePresence>
                    {showEditor && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
                            onClick={() => setShowEditor(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="w-full max-w-4xl my-8"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => setShowEditor(false)}
                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <BlogEditor />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </React.Suspense>
        </div>
    );
};
