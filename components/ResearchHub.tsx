import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ExternalLink, Filter } from 'lucide-react';
import { FeatureGate } from './FeatureGate';
import { researchContent, ResearchModality, ResearchStudyCard } from '../content/research';
import { disclaimers } from '../content/disclaimers';

const LegacyResearchFallback: React.FC = () => (
  <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
    <div className="max-w-5xl mx-auto rounded-3xl border border-slate-100 bg-white p-8">
      <h1 className="text-3xl font-black text-slate-900 mb-3 futuristic-font">Scientific research library</h1>
      <p className="text-slate-600">Enhanced research library is currently disabled.</p>
    </div>
  </div>
);

const modalityToStorePath: Record<ResearchModality, string> = {
  mHBOT: '/store?tech=HBOT',
  H2: '/store?tech=HYDROGEN',
  RLT: '/store?tech=RLT',
  PEMF: '/store?tech=PEMF',
};

const EnhancedResearchHub: React.FC = () => {
  const reduced = useReducedMotion();
  const [technologyFilter, setTechnologyFilter] = useState<(typeof researchContent.technologyFilters)[number]>('All');
  const [studyTypeFilter, setStudyTypeFilter] = useState<(typeof researchContent.studyTypeFilters)[number]>('All');

  const filteredStudies = useMemo(() => {
    return researchContent.studies.filter((study) => {
      const technologyMatches = technologyFilter === 'All' || study.modality === technologyFilter;
      const studyTypeMatches = studyTypeFilter === 'All' || study.studyType === studyTypeFilter;
      return technologyMatches && studyTypeMatches;
    });
  }, [technologyFilter, studyTypeFilter]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-4xl md:text-5xl font-black mb-3 futuristic-font">{researchContent.title}</h1>
            <p className="text-slate-300 max-w-3xl mx-auto">{researchContent.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <label htmlFor="research-technology" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              <Filter size={12} className="inline mr-1" /> Technology
            </label>
            <select
              id="research-technology"
              value={technologyFilter}
              onChange={(event) => setTechnologyFilter(event.target.value as (typeof researchContent.technologyFilters)[number])}
              className="w-full min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              {researchContent.technologyFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <label htmlFor="research-study-type" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              <Filter size={12} className="inline mr-1" /> Study type
            </label>
            <select
              id="research-study-type"
              value={studyTypeFilter}
              onChange={(event) => setStudyTypeFilter(event.target.value as (typeof researchContent.studyTypeFilters)[number])}
              className="w-full min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              {researchContent.studyTypeFilters.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStudies.length === 0 ? (
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              {researchContent.emptyState}
            </div>
          ) : (
            filteredStudies.map((study, index) => (
              <motion.article
                key={study.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{study.modality}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100">
                    {study.studyType}
                  </span>
                  <span className="text-xs text-slate-500">{study.year}</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 mb-2">{study.title}</h2>
                <p className="text-xs text-slate-500 mb-2">{study.population}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{study.summary}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="min-h-11 px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 inline-flex items-center gap-1"
                  >
                    Open study <ExternalLink size={12} />
                  </a>

                  <a
                    href={modalityToStorePath[study.modality]}
                    className="min-h-11 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm inline-flex items-center gap-1"
                  >
                    {researchContent.productCtaLabel} <ArrowRight size={12} />
                  </a>

                  <a
                    href="/protocols"
                    className="min-h-11 px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 inline-flex items-center gap-1"
                  >
                    {researchContent.protocolCtaLabel} <ArrowRight size={12} />
                  </a>
                </div>

                {study.doi && <p className="mt-3 text-xs text-slate-500">DOI: {study.doi}</p>}
              </motion.article>
            ))
          )}
        </div>

        <div className="max-w-6xl mx-auto mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 leading-relaxed">
          {disclaimers.research}
        </div>
      </section>
    </div>
  );
};

export const ResearchHub: React.FC = () => {
  return (
    <FeatureGate flag="feature_research_library" fallback={<LegacyResearchFallback />}>
      <EnhancedResearchHub />
    </FeatureGate>
  );
};

