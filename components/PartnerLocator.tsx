import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
} from 'lucide-react';
import { partnerLocations, partnerTypeLabels } from '@/content/partners';

const typeColors = {
  clinic: 'bg-emerald-500',
  distributor: 'bg-purple-500',
  showroom: 'bg-cyan-500',
} as const;

export const PartnerLocator: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<(typeof partnerLocations)[number] | null>(
    null
  );

  const countries = useMemo(
    () => [...new Set(partnerLocations.map((partner) => partner.country))],
    []
  );
  const technologies = ['HBOT', 'PEMF', 'RLT', 'Hydrogen'];

  const filteredPartners = useMemo(() => {
    return partnerLocations.filter((partner) => {
      if (selectedCountry !== 'all' && partner.country !== selectedCountry) {
        return false;
      }

      if (selectedType !== 'all' && partner.type !== selectedType) {
        return false;
      }

      if (selectedTech !== 'all' && !partner.features.includes(selectedTech)) {
        return false;
      }

      return true;
    });
  }, [selectedCountry, selectedType, selectedTech]);

  useEffect(() => {
    if (selectedPartner && !filteredPartners.some((partner) => partner.id === selectedPartner.id)) {
      setSelectedPartner(null);
    }
  }, [filteredPartners, selectedPartner]);

  const featuredPartner = selectedPartner ?? filteredPartners[0] ?? null;
  const partnerTypeCounts = filteredPartners.reduce(
    (acc, partner) => {
      acc[partner.type] += 1;
      return acc;
    },
    { clinic: 0, distributor: 0, showroom: 0 }
  );
  const countriesRepresented = [...new Set(filteredPartners.map((partner) => partner.country))];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <MapPin className="mx-auto text-cyan-500 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Find a Partner</h1>
          <p className="text-lg text-slate-600">
            Locate clinics, distributors, and showrooms near you
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-500 mb-1 block" htmlFor="locator-country">
                Country
              </label>
              <select
                id="locator-country"
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-500 mb-1 block" htmlFor="locator-type">
                Partner Type
              </label>
              <select
                id="locator-type"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="showroom">Hylono Showroom</option>
                <option value="clinic">Wellness Clinic</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-slate-500 mb-1 block" htmlFor="locator-technology">
                Technology
              </label>
              <select
                id="locator-technology"
                value={selectedTech}
                onChange={(event) => setSelectedTech(event.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Technologies</option>
                {technologies.map((technology) => (
                  <option key={technology} value={technology}>
                    {technology}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-2xl min-h-[500px] relative overflow-hidden border border-slate-800">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200">
                  <Sparkles size={14} /> Partner Coverage
                </div>
                <h2 className="text-3xl font-bold text-white">Interactive map is in staging.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  The current launch build keeps locator performance stable by shipping a verified
                  partner directory first. Use the filtered list to review coverage by country,
                  partner type, and technology.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Active Partners
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">{filteredPartners.length}</p>
                  <p className="mt-1 text-xs text-slate-400">Visible with current filters</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Countries
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">{countriesRepresented.length}</p>
                  <p className="mt-1 text-xs text-slate-400">Regional coverage in this view</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    Top Mix
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {partnerTypeCounts.showroom} showrooms, {partnerTypeCounts.clinic} clinics,
                    {` ${partnerTypeCounts.distributor} distributors`}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">Directory-first rollout for launch</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <Building2 size={16} />
                    <p className="text-xs font-bold uppercase tracking-[0.3em]">
                      Coverage Snapshot
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {countriesRepresented.map((country) => (
                      <span
                        key={country}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-100"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200">
                    Featured Partner
                  </p>
                  {featuredPartner ? (
                    <>
                      <h3 className="mt-3 text-lg font-bold text-white">{featuredPartner.name}</h3>
                      <p className="mt-1 text-sm text-cyan-50">
                        {partnerTypeLabels[featuredPartner.type]} in {featuredPartner.city},{' '}
                        {featuredPartner.country}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {featuredPartner.features.map((feature) => (
                          <span
                            key={feature}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-slate-200">
                      No partners match the current filter combination yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <p className="text-sm text-slate-500">{filteredPartners.length} partners found</p>

            <AnimatePresence>
              {filteredPartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => setSelectedPartner(partner)}
                  className={`bg-white rounded-xl p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    selectedPartner?.id === partner.id ? 'ring-2 ring-cyan-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full text-white ${typeColors[partner.type]}`}
                      >
                        {partnerTypeLabels[partner.type]}
                      </span>
                      <h3 className="font-bold text-slate-900 mt-2">{partner.name}</h3>
                      <p className="text-sm text-slate-500">
                        {partner.city}, {partner.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-medium">{partner.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {partner.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {partner.hours}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {selectedPartner ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPartner(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="partner-detail-title"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(event) => event.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <span
                  className={`text-xs px-3 py-1 rounded-full text-white ${typeColors[selectedPartner.type]}`}
                >
                  {partnerTypeLabels[selectedPartner.type]}
                </span>
                <h2 id="partner-detail-title" className="text-2xl font-bold text-slate-900 mt-4 mb-2">
                  {selectedPartner.name}
                </h2>

                <div className="space-y-3 mb-6">
                  <p className="flex items-center gap-3 text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    {selectedPartner.address}, {selectedPartner.city}
                  </p>
                  <p className="flex items-center gap-3 text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    {selectedPartner.phone}
                  </p>
                  <p className="flex items-center gap-3 text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    {selectedPartner.email}
                  </p>
                  {selectedPartner.website ? (
                    <a
                      href={selectedPartner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-cyan-600 hover:underline"
                    >
                      <Globe size={16} /> Visit Website <ExternalLink size={12} />
                    </a>
                  ) : null}
                  <p className="flex items-center gap-3 text-slate-600">
                    <Clock size={16} className="text-slate-400" />
                    {selectedPartner.hours}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPartner.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a
                    href={`mailto:${selectedPartner.email}`}
                    className="flex-1 py-3 bg-slate-900 text-white text-center rounded-xl font-bold hover:bg-slate-800"
                  >
                    Contact
                  </a>
                  <button
                    onClick={() => setSelectedPartner(null)}
                    className="px-6 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
