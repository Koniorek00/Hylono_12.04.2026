export interface Advisor {
  id: string;
  name: string;
  title: string;
  photo: string;
  specializations: string[];
  bio: string;
}

export const advisors: Advisor[] = [
  {
    id: 'adv-elena-vasquez',
    name: 'Dr. Elena Vasquez',
    title: 'Integrative Recovery Advisor',
    photo: '/images/advisors/elena-vasquez.webp',
    specializations: ['Recovery planning', 'Protocol progression', 'Sleep-support routines'],
    bio: 'Dr. Vasquez supports clients in building practical protocol-first routines for recovery, sleep quality, and consistent weekly adherence. Her approach combines evidence literacy with simple implementation frameworks that fit real schedules.',
  },
  {
    id: 'adv-james-wright',
    name: 'Dr. James Wright',
    title: 'Performance and Vitality Advisor',
    photo: '/images/advisors/james-wright.webp',
    specializations: ['Hydrogen workflows', 'Stress balance routines', 'Vitality stack design'],
    bio: 'Dr. Wright works with professionals and athletes who want sustainable vitality routines using hydrogen and oxygen modalities. He focuses on conservative progression, measurable consistency, and long-horizon wellness outcomes.',
  },
];

export const advisorsContent = {
  title: 'Advisory support, tailored to your protocol journey',
  subtitle:
    'Book a guided session with our advisors to review your goals, build a conservative protocol, and stay consistent over time.',
  advisors,
  howItWorksTitle: 'How advisor sessions work',
  howItWorksSteps: [
    'Tell us your goals and current routine during booking.',
    'Meet your advisor for a practical protocol walkthrough.',
    'Receive an action-focused plan with clear weekly checkpoints.',
    'Continue with optional follow-up sessions as your protocol evolves.',
  ],
} as const;

export const advisorById = advisors.reduce<Record<string, Advisor>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
