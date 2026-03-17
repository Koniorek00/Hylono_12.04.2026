import { Award, Globe, Heart, Hexagon, Target, Users } from 'lucide-react';
import { siteOwnership } from '@/content/site-entity';

const ABOUT_VALUES = [
  {
    icon: Award,
    title: 'Verified Trust',
    description: 'Every product undergoes rigorous vetting. We only offer what we would use ourselves.',
  },
  {
    icon: Heart,
    title: 'Human-First',
    description: 'Technology is the vessel, but human wellbeing is the destination.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Elite tech democratization. Making advanced regeneration accessible to all.',
  },
] as const;

const ABOUT_TEAM = [
  {
    name: siteOwnership.editorial.team,
    role: siteOwnership.editorial.label,
    bio: 'Shapes product education, support documentation, and route-level content quality across the Hylono experience.',
  },
  {
    name: siteOwnership.research.team,
    role: siteOwnership.research.label,
    bio: 'Reviews evidence summaries, protocol references, and research context before they are published on the site.',
  },
] as const;

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-24 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
              <Hexagon className="text-white" size={32} />
            </div>
          </div>
          <h1 id="about-hero-headline" className="mb-6 text-5xl font-bold text-slate-900 md:text-6xl">About Hylono</h1>
          <p id="about-hero-description" className="mx-auto max-w-2xl text-xl leading-relaxed text-slate-500">
            Where Mind Connects with Matter. We are pioneering the future of non-invasive
            regeneration technology.
          </p>
        </div>

        <section className="mb-24">
          <div className="rounded-3xl border border-slate-100 bg-white p-12 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-slate-900">
              <Target className="text-cyan-500" /> Our Mission
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-slate-600">
              Hylono exists to democratize access to elite bio-optimization technology. We believe
              that the tools for human regeneration should not be locked behind institutional walls
              or reserved for the privileged few.
            </p>
            <p className="text-lg leading-relaxed text-slate-600">
              Through rigorous filtration of global innovation, protocol-based wellness design, and
              transparent education, we empower individuals and businesses to architect their own
              regeneration journey.
            </p>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">Our Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {ABOUT_VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-100 bg-white p-8 text-center"
              >
                <value.icon className="mx-auto mb-4 text-cyan-500" size={32} />
                <h3 className="mb-3 text-xl font-bold text-slate-900">{value.title}</h3>
                <p className="text-sm text-slate-500">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-12 flex items-center justify-center gap-3 text-center text-3xl font-bold text-slate-900">
            <Users className="text-purple-500" /> The Team
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {ABOUT_TEAM.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-white p-8"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300">
                  <Users className="text-slate-500" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                  <p className="mb-2 text-sm font-medium text-cyan-600">{member.role}</p>
                  <p className="text-sm text-slate-500">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
