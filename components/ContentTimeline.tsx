import React from 'react';
import { motion } from 'framer-motion';

interface TimelineEvent {
    date: string;
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
}

interface ContentTimelineProps {
    events: TimelineEvent[];
    orientation?: 'vertical' | 'alternating';
}

export const ContentTimeline: React.FC<ContentTimelineProps> = ({
    events,
    orientation = 'alternating'
}) => {
    if (orientation === 'vertical') {
        return (
            <div className="relative">
                {/* Central Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

                <div className="space-y-8">
                    {events.map((event, i) => (
                        <motion.div
                            key={event.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-16"
                        >
                            {/* Dot */}
                            <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-cyan-500 border-4 border-white shadow" />

                            {/* Content */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <span className="text-sm text-cyan-600 font-medium">{event.date}</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-1">{event.title}</h3>
                                <p className="text-slate-600 mt-2">{event.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // Alternating layout
    return (
        <div className="relative">
            {/* Central Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />

            <div className="space-y-12">
                {events.map((event, i) => (
                    <motion.div
                        key={event.title}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        viewport={{ once: true }}
                        className={`relative flex items-center ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                        {/* Content Card */}
                        <div className="w-5/12">
                            <div className={`bg-white rounded-xl p-6 shadow-sm ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                <span className="text-sm text-cyan-600 font-medium">{event.date}</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-1">{event.title}</h3>
                                <p className="text-slate-600 mt-2">{event.description}</p>
                            </div>
                        </div>

                        {/* Center Dot */}
                        <div className="w-2/12 flex justify-center">
                            <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-white shadow-lg z-10" />
                        </div>

                        {/* Spacer */}
                        <div className="w-5/12" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Company History Example
export const CompanyTimeline: React.FC = () => {
    const events: TimelineEvent[] = [
        { date: '2023', title: 'Hylono Founded', description: 'Started with a mission to democratize bio-optimization technology across Europe.' },
        { date: 'Q2 2023', title: 'First HBOT Line', description: 'Launched our first line of professional hyperbaric chambers.' },
        { date: 'Q4 2023', title: 'PEMF Integration', description: 'Expanded product range to include PEMF therapy devices.' },
        { date: 'Q1 2024', title: 'EU Expansion', description: 'Opened distribution in Germany, Austria, and Czech Republic.' },
        { date: 'Q3 2024', title: 'Red Light & Hydrogen', description: 'Added photobiomodulation panels and hydrogen generators.' },
        { date: '2025', title: 'R&D Center', description: 'Established dedicated research facility in Warsaw.' },
        { date: '2026', title: 'Today', description: 'Serving 500+ clinics and thousands of home users across Europe.' },
    ];

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Our Journey</h2>
                <p className="text-center text-slate-600 mb-12">Building the future of wellness technology</p>
                <ContentTimeline events={events} orientation="alternating" />
            </div>
        </section>
    );
};
