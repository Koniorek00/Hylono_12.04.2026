import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Star, User, ThumbsUp, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// Star Rating Component
export const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 16 }) => (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`} role="img">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={size}
                aria-hidden="true"
                className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
            />
        ))}
    </div>
);

// Single Review Card
export const ReviewCard: React.FC<{
    name: string;
    rating: number;
    date: string;
    text: string;
    verified?: boolean;
    helpful?: number;
}> = ({ name, rating, date, text, verified, helpful }) => (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-slate-400" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{name}</span>
                        {verified && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                                Verified Purchase
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-slate-400">{date}</span>
                </div>
            </div>
            <StarRating rating={rating} />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{text}</p>
        {helpful !== undefined && (
            <span className="flex items-center gap-2 text-xs text-slate-400">
                <ThumbsUp size={14} aria-hidden="true" /> {helpful} found this helpful
            </span>
        )}
    </div>
);

// Reviews Section for Product Pages
export const ReviewsSection: React.FC<{
    productName?: string;
    minReviewCount?: number;
    belowThresholdMessage?: string;
}> = ({
    productName = 'Product',
    minReviewCount = 0,
    belowThresholdMessage,
}) => {
    const reviews = [
        { name: 'Dr. Anna K.', rating: 5, date: 'January 2026', text: 'Exceptional quality hyperbaric chamber. Our clinic has seen remarkable results with patients. The build quality is outstanding and the pressure consistency is perfect.', verified: true, helpful: 24 },
        { name: 'Marcus W.', rating: 5, date: 'December 2025', text: 'After extensive research, I chose Hylono for my home HBOT setup. The customer support was incredible - they helped me through every step of installation.', verified: true, helpful: 18 },
        { name: 'SportMed Clinic', rating: 4, date: 'November 2025', text: 'Great equipment for sports recovery. The PEMF integration works seamlessly. Only giving 4 stars because delivery took slightly longer than expected.', verified: true, helpful: 12 },
    ];

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const showAggregateRating = reviews.length >= minReviewCount;
    const guidanceCards = [
        {
            title: 'Route guidance',
            text:
                belowThresholdMessage ??
                `${productName} pages prioritize setup clarity, support paths, and policy visibility over synthetic review widgets.`,
        },
        {
            title: 'Policy access',
            text: 'Shipping, returns, warranty, and contact routes stay directly linked so commercial details remain visible.',
        },
        {
            title: 'Next step',
            text: 'Use the rental and contact routes to compare ownership options before moving toward checkout.',
        },
    ];

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {showAggregateRating ? 'Customer Reviews' : 'Planning & Support'}
                        </h2>
                        {showAggregateRating ? (
                            <div className="flex items-center gap-3">
                                <StarRating rating={Math.round(avgRating)} size={20} />
                                <span className="text-slate-600">{avgRating.toFixed(1)} out of 5 ({reviews.length} reviews)</span>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-slate-600 text-sm">Support-first product guidance</p>
                                <p className="text-xs text-slate-500">
                                    {belowThresholdMessage ??
                                        'This route keeps policy, evidence, and support details visible instead of relying on synthetic review volume.'}
                                </p>
                            </div>
                        )}
                    </div>
                    {showAggregateRating ? (
                        <Link href="/contact?intent=review" className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
                            Write a Review
                        </Link>
                    ) : (
                        <Link href="/contact" className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
                            Contact Support
                        </Link>
                    )}
                </div>

                {showAggregateRating ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard key={`${review.name}-${review.date}`} {...review} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {guidanceCards.map((card) => (
                            <div key={card.title} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{card.title}</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{card.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// Testimonial Carousel for Home Page
export const TestimonialCarousel: React.FC = () => {
    const [current, setCurrent] = useState(0);

    const testimonials = [
        { name: 'Dr. Elena Kowalski', role: 'Sports Performance Director', company: 'Warsaw Athletic Center', text: 'Hylono transformed our recovery protocols. Our athletes are performing at unprecedented levels with 40% faster recovery times.', image: 'from-cyan-500 to-blue-500' },
        { name: 'Prof. Michael Chen', role: 'Integrative Wellness', company: 'BioHarmony Clinic', text: 'The quality and precision of Hylono equipment is unmatched. Finally, technology that meets professional-grade standards at accessible prices.', image: 'from-purple-500 to-pink-500' },
        { name: 'Katarzyna Nowak', role: 'CEO', company: 'Wellness Retreats EU', text: 'We equipped all 5 of our wellness centers with Hylono systems. Guest satisfaction increased 300% and our ROI was achieved in 8 months.', image: 'from-emerald-500 to-teal-500' },
    ];

    const currentTestimonial = testimonials[current] ?? testimonials[0];
    if (!currentTestimonial) {
        return null;
    }

    const next = () => setCurrent((c) => (c + 1) % testimonials.length);
    const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <Quote className="mx-auto text-cyan-400 mb-4" size={40} />
                    <h2 className="text-3xl font-bold text-white">Trusted by Professionals</h2>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="text-center"
                        >
                            <p className="text-xl text-white/90 leading-relaxed mb-8 italic">
                                "{currentTestimonial.text}"
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${currentTestimonial.image}`} />
                                <div className="text-left">
                                    <p className="font-bold text-white">{currentTestimonial.name}</p>
                                    <p className="text-sm text-slate-400">{currentTestimonial.role}</p>
                                    <p className="text-xs text-cyan-400">{currentTestimonial.company}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={prev} aria-label="Previous testimonial" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <ChevronLeft className="text-white" size={20} aria-hidden="true" />
                        </button>
                        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonials">
                            {testimonials.map((testimonial, i) => (
                                <button
                                    key={testimonial.name}
                                    role="tab"
                                    aria-selected={i === current}
                                    aria-label={`Testimonial from ${testimonial.name}`}
                                    onClick={() => setCurrent(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-cyan-400 w-6' : 'bg-white/30'}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} aria-label="Next testimonial" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                            <ChevronRight className="text-white" size={20} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
