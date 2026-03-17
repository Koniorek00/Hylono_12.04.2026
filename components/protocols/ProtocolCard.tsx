import React from 'react';
import Link from 'next/link';

export interface ProtocolCardData {
  slug: string;
  title: string;
  goalTag: string;
  timePerDay: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modalities: string[];
  description: string;
}

interface ProtocolCardProps {
  protocol: ProtocolCardData;
  onOpen?: (slug: string) => void;
  href?: string;
  compact?: boolean;
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({
  protocol,
  onOpen,
  href,
  compact = false,
}) => {
  return (
    <Link
      href={href ?? `/protocols/${protocol.slug}`}
      onClick={() => onOpen?.(protocol.slug)}
      aria-label={`Open protocol ${protocol.title}`}
      className="block w-full min-h-11 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-cyan-300 hover:shadow-md md:p-6"
    >
      <h3 className="text-lg font-bold text-slate-900 leading-tight">{protocol.title}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 font-semibold uppercase tracking-wide">
          {protocol.goalTag}
        </span>
        <span>⏱ {protocol.timePerDay}/day</span>
        <span>📊 {protocol.difficulty}</span>
      </div>

      <p className={`mt-3 text-sm text-slate-600 ${compact ? 'line-clamp-2' : ''}`}>{protocol.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Requires:</span>
        {protocol.modalities.map((modality) => (
          <span key={`${protocol.slug}-${modality}`} className="px-2 py-1 rounded-full border border-slate-200 bg-slate-50">
            {modality}
          </span>
        ))}
      </div>
    </Link>
  );
};
