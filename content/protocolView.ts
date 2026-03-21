import { protocolBySlug } from './protocols';

export const normalizeProtocolGoal = (goalTag: string): string => {
  const value = goalTag.toLowerCase();
  if (value.includes('recovery')) return 'Recovery';
  if (value.includes('sleep')) return 'Sleep';
  if (value.includes('stress')) return 'Stress';
  if (value.includes('comfort')) return 'Comfort';
  return 'Vitality';
};

export const getProtocolModalities = (slug: string): string[] => {
  const protocol = protocolBySlug[slug];
  if (!protocol) return [];

  const modalities = new Set<string>();

  protocol.weeks.forEach((week) => {
    week.days.forEach((day) => {
      day.sessions.forEach((session) => {
        const label = session.modality.toLowerCase();

        if (label.includes('hb')) modalities.add('HBOT');
        else if (label.includes('hydrogen')) modalities.add('H2');
        else if (label.includes('red') || label.includes('nir')) modalities.add('RLT');
        else if (label.includes('pemf')) modalities.add('PEMF');
      });
    });
  });

  return Array.from(modalities);
};

export interface ProtocolCardView {
  slug: string;
  title: string;
  goalTag: string;
  timePerDay: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modalities: string[];
  description: string;
}

export const toProtocolCardView = (slug: string): ProtocolCardView | null => {
  const protocol = protocolBySlug[slug];
  if (!protocol) return null;

  return {
    slug: protocol.slug,
    title: protocol.title,
    goalTag: normalizeProtocolGoal(protocol.goalTag),
    timePerDay: protocol.timePerDay,
    difficulty: protocol.difficulty,
    modalities: getProtocolModalities(protocol.slug),
    description: protocol.shortDescription,
  };
};
