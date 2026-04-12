'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { conditionGoals } from '@/content/conditions';
import { disclaimers } from '@/content/disclaimers';
import { FeatureGate } from '@/components/FeatureGate';
import { ErrorPage } from '@/components/ErrorPage';
import analytics from '@/src/lib/analytics';
import { navigateToPage } from '@/src/lib/navigation';

const alternativePaths = [
  { href: '/research', label: 'Research' },
  { href: '/protocols', label: 'Protocols' },
  { href: '/store', label: 'Store' },
  { href: '/rental', label: 'Rental' },
] as const;

const goalCardCopy: Record<(typeof conditionGoals)[number]['slug'], string> = {
  recovery: 'Best after training, hard work blocks, or heavier weeks.',
  sleep: 'Best when you want an easier wind-down and better nightly rhythm.',
  stress: 'Best for calmer days and lower mental load.',
  comfort: 'Best for daily comfort and easier movement.',
  vitality: 'Best for steadier energy and focus across the week.',
};

function ConditionsHub() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Conditions
          </p>
          <h1
            id="conditions-hero-headline"
            className="mt-3 max-w-3xl text-3xl font-bold text-slate-900 md:text-4xl"
          >
            Choose the goal you want to improve
          </h1>
          <p
            id="conditions-hero-description"
            className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base"
          >
            Start with the result you want, not a device. Each guide shows the
            best-fit options, session time, research notes, and the next step.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              5 goal guides
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Technology comparison inside each guide
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Research, protocol, and rental next steps
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/wellness-planner"
              className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={() =>
                analytics.capture('condition_hub_primary_cta_clicked', {
                  destination: '/wellness-planner',
                })
              }
            >
              Get a guided recommendation
            </Link>
            <p className="text-sm text-slate-500">
              Or compare the five goal guides below.
            </p>
          </div>
        </header>

        <section
          id="conditions-goal-grid"
          className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {conditionGoals.map((goal) => (
            <Link
              key={goal.slug}
              href={`/conditions/${goal.slug}`}
              className="block min-h-11 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-cyan-300 hover:shadow-md"
              onClick={() =>
                analytics.capture('condition_hub_goal_selected', {
                  goal: goal.slug,
                })
              }
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {goal.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {goalCardCopy[goal.slug]}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                See the best-fit devices, read the research summary, and move to
                protocols, rental, or contact.
              </p>
              <span className="mt-4 inline-flex text-sm font-semibold text-cyan-700">
                Open guide &rarr;
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            Prefer a different starting point?
          </span>{' '}
          {alternativePaths.map((path, index) => (
            <span key={path.href}>
              <Link
                href={path.href}
                className="font-medium text-cyan-700 underline-offset-4 hover:underline"
              >
                {path.label}
              </Link>
              {index < alternativePaths.length - 1 ? ' | ' : ''}
            </span>
          ))}
        </section>

        <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600">
          {disclaimers.general}
        </p>
      </div>
    </div>
  );
}

export function ConditionsClient() {
  const router = useRouter();

  const navigateTo = (page: string) => {
    navigateToPage(router, page);
  };

  return (
    <FeatureGate
      flag="feature_condition_pages"
      fallback={<ErrorPage type="404" onNavigate={navigateTo} />}
    >
      <ConditionsHub />
    </FeatureGate>
  );
}
