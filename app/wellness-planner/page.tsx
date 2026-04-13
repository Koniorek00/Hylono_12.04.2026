import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo-metadata';
import { WellnessPlannerClient } from './WellnessPlannerClient';

// [DECISION: wellness planner route stays a static, noindex shell with a server-rendered orientation block and an interactive client island for the recommendation flow. Cache components/runtime cache behavior is preferred unless server-personalized data is introduced.]
// Rendering strategy: server-rendered noindex planner shell with client-side state for guided recommendation inputs, result shaping, and downstream conversion handoffs.

export const metadata: Metadata = createPageMetadata({
  title: 'Wellness Planner',
  description:
    'Use one guided path to compare HBOT, hydrogen, red light, and PEMF by goal, budget, and space.',
  path: '/wellness-planner',
  forceNoIndex: true,
});

export default function WellnessPlannerPage() {
  return (
    <div id="main-content" className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-700">
            Planner overview
          </p>

          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <p className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Start with goal, budget, or space.
              </p>
              <p className="max-w-2xl text-base leading-7 text-slate-700">
                Pick one path and narrow HBOT, hydrogen, red light, and PEMF
                before you browse the full catalog.
              </p>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                You get product suggestions, price context, and a matching
                protocol after one short path.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <a
                href="#planner-builder"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Start the planner
              </a>
              <p className="text-xs text-slate-500">
                See a first recommendation before any contact step.
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Start paths
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                Goal, budget, modality, or room setup.
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Technologies
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                HBOT, hydrogen, red light, and PEMF.
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Decision inputs
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                One short path focused on fit, not endless product tabs.
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Output
              </dt>
              <dd className="mt-2 text-sm text-slate-700">
                Product suggestions, price context, and a matching protocol.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="planner-builder">
        <WellnessPlannerClient />
      </section>
    </div>
  );
}
