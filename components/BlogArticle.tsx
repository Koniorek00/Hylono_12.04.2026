import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Bookmark, ChevronRight } from 'lucide-react';
import { SmartText } from './SmartText';
import { ArticleStructuredData, BreadcrumbStructuredData } from './StructuredData';
import { ProductMention } from './content/ProductMention';
import { ProtocolMention } from './content/ProtocolMention';
import { BuilderCTA } from './content/BuilderCTA';
import { AdvisorCTA } from './content/AdvisorCTA';
import { BLOG_POSTS, BlogPost } from '../constants/content';
import { blogCategoryCommerceMap } from '../content/batch3';
import { sanitizeArticleContent } from '../utils/sanitization';
import { isFeatureEnabled } from '../utils/featureFlags';
import { TechType } from '../types';

interface BlogArticleProps {
    slug: string;
    onBack: () => void;
    onNavigate: (page: string, tech?: TechType, mode?: string) => void;
}

// Generate slug from title
const generateSlug = (title: string): string => {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Find article by slug
const getArticleBySlug = (slug: string): BlogPost | undefined => {
    return BLOG_POSTS.find(post => generateSlug(post.title) === slug);
};

export const BlogArticle: React.FC<BlogArticleProps> = ({ slug, onBack, onNavigate }) => {
    const article = getArticleBySlug(slug);
    const contentCommerceEnabled = isFeatureEnabled('feature_content_commerce');

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                    <p className="text-slate-500 mb-8">The article you're looking for doesn't exist.</p>
                    <button
                        onClick={() => onNavigate('blog')}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
                    >
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    // Extended content placeholder (in real app, this would come from CMS)
    const fullContent = `
        <p class="lead">This comprehensive guide explores the science, benefits, and practical applications of ${article.category} technology in bio-optimization.</p>
        
        <h2>Understanding the Science</h2>
        <p>${typeof article.excerpt === 'string' ? article.excerpt : article.excerpt}</p>
        
        <h2>Key Benefits</h2>
        <ul>
            <li>Enhanced cellular function and regeneration</li>
            <li>Improved energy levels and mental clarity</li>
            <li>Accelerated recovery and reduced inflammation</li>
            <li>Support for long-term health optimization</li>
        </ul>
        
        <h2>How to Get Started</h2>
        <p>Begin your journey with Hylono's professional-grade equipment, designed for both home and clinical use. Our systems are backed by rigorous safety standards and supported by our expert team.</p>
        
        <h2>Conclusion</h2>
        <p>Bio-optimization technology represents a paradigm shift in personal health management. With proper guidance and quality equipment, anyone can begin reaping the benefits of these cutting-edge modalities.</p>
    `;

    const articleData = {
        id: String(article.id),
        title: article.title,
        excerpt: typeof article.excerpt === 'string' ? article.excerpt : '',
        date: article.date,
        category: article.category,
        readTime: article.readTime
    };

    const commerceMapping = blogCategoryCommerceMap[article.category] ?? blogCategoryCommerceMap.Protocols;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* JSON-LD Structured Data */}
            <ArticleStructuredData article={articleData} />
            <BreadcrumbStructuredData items={[
                { name: 'Home', url: 'https://hylono.com/' },
                { name: 'Blog', url: 'https://hylono.com/blog' },
                { name: article.title, url: `https://hylono.com/blog/${slug}` }
            ]} />

            {/* Hero */}
            <div className={`relative h-64 md:h-80 bg-gradient-to-br ${article.image}`}>
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-4xl mx-auto px-6 pb-8 w-full">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={onBack}
                            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm font-medium">Back to Blog</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Article Header */}
                    <div className="p-8 md:p-12 border-b border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                <Tag size={12} /> {article.category}
                            </span>
                            <span className="flex items-center gap-2 text-xs text-slate-400">
                                <Calendar size={12} /> {article.date}
                            </span>
                            <span className="flex items-center gap-2 text-xs text-slate-400">
                                <Clock size={12} /> {article.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            {article.title}
                        </h1>

                        {article.trace_id && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-tight">
                                    Evidence-Backed: Trace ID {article.trace_id}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Article Body */}
                    <div className="p-8 md:p-12">
                        <div
                            className="prose prose-lg prose-slate max-w-none
                                prose-headings:font-bold prose-headings:text-slate-900
                                prose-p:text-slate-600 prose-p:leading-relaxed
                                prose-li:text-slate-600
                                prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-slate-900"
                            dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(fullContent) }}
                        />
                    </div>

                    {/* Article Footer */}
                    <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-400 transition-colors">
                                    <Share2 size={16} /> Share
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-slate-400 transition-colors">
                                    <Bookmark size={16} /> Save
                                </button>
                            </div>
                            <button
                                onClick={() => onNavigate('blog')}
                                className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors"
                            >
                                More Articles <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </motion.article>

                {/* Related Articles */}
                <div className="py-16">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Related Articles</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {BLOG_POSTS.filter(p => p.id !== article.id && p.category === article.category)
                            .slice(0, 2)
                            .map(post => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                                    onClick={() => onNavigate(`blog/${generateSlug(post.title)}`)}
                                >
                                    <div className={`h-32 bg-gradient-to-br ${post.image}`} />
                                    <div className="p-5">
                                        <h4 className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors mb-2">
                                            {post.title}
                                        </h4>
                                        <span className="text-xs text-slate-400">{post.readTime}</span>
                                    </div>
                                </motion.div>
                            ))}
                    </div>

                {contentCommerceEnabled && (
                    <div className="pb-16">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                            <h3 className="text-xl font-bold text-slate-900">Related products &amp; protocols</h3>
                            <p className="text-sm text-slate-600 mt-2">
                                Based on this topic, these options may support your routine and implementation plan.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-3">
                                    {commerceMapping.relatedProducts.map((productId) => (
                                        <ProductMention
                                            key={`product-${article.id}-${productId}`}
                                            productId={productId}
                                            context="article"
                                        />
                                    ))}
                                    {commerceMapping.relatedProtocols.map((protocolSlug) => (
                                        <ProtocolMention
                                            key={`protocol-${article.id}-${protocolSlug}`}
                                            protocolSlug={protocolSlug}
                                        />
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <BuilderCTA goal={commerceMapping.goal} />
                                    <AdvisorCTA />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

// Export slug generator for use in router
export { generateSlug, getArticleBySlug };
