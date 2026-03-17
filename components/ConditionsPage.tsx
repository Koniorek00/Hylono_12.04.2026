"use client";

import React from 'react';
import Link from 'next/link';
import { NavigateFunction } from '../types';
import { conditionGoalBySlug, conditionGoals } from '../content/conditions';
import { evidenceById } from '../content/evidence';
import { disclaimers } from '../content/disclaimers';
import { toProtocolCardView } from '../content/protocolView';
import { ProtocolCard } from './protocols/ProtocolCard';

interface ConditionsPageProps {
  slug?: string;
  onNavigate?: NavigateFunction;
}

const modalityProductHref = {
  mHBOT: '/product/hbot',
  H2: '/product/hydrogen',
  RLT: '/product/rlt',
  PEMF: '/product/pemf',
} as const;

const RelevanceDots: React.FC<{ score: number }> = ({ score }) => {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-slate-600"
      aria-label={`Relevance ${score} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={`dot-${index}`}
          className={`h-2.5 w-2.5 rounded-full ${
            index < score ? 'bg-cyan-500' : 'bg-slate-200'
          }`}
          aria-hidden
        />
      ))}
    </span>
  );
};

export const ConditionsPage: React.FC<ConditionsPageProps> = ({ slug, onNavigate: _onNavigate }) => {
  if (!slug) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <header className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h1 id="conditions-hero-headline" className="text-3xl font-bold text-slate-900">Goal-based wellness guides</h1>
            <p id="conditions-hero-description" className="mt-2 text-sm text-slate-600">
              Explore evidence-informed pages for recovery, sleep, stress, comfort, and vitality.
            </p>
          </header>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {conditionGoals.map((goal) => (
            <Link
              key={goal.slug}
              href={`/conditions/${goal.slug}`}
              className="block min-h-11 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-cyan-300 hover:shadow-md"
            >
                <h2 className="text-lg font-semibold text-slate-900">{goal.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{goal.subtitle}</p>
              </Link>
            ))}
          </section>

          <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600">
            {disclaimers.general}
          </p>
        </div>
      </div>
    );
  }

  const goal = conditionGoalBySlug[slug];
  if (!goal) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Goal page not found</h1>
            <p className="mt-2 text-sm text-slate-600">
              Try selecting one of the available goal guides.
            </p>
            <Link
              href="/conditions"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to all goals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const protocolCards = goal.protocolSlugs
    .map((protocolSlug) => toProtocolCardView(protocolSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <header id="condition-intro" className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <Link
            href="/conditions"
            className="mb-4 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            &larr; Back to all goals
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{goal.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{goal.subtitle}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
            This guide compares the most relevant technologies, protocol options, and supporting
            research notes for {goal.title.toLowerCase()}.
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="space-y-3 text-sm leading-relaxed text-slate-700">
            {goal.description.map((paragraph) => (
              <p key={`${goal.slug}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Recommended technologies</h2>
          <div className="mt-4 space-y-3">
            {goal.modalities.map((modality) => (
              <article
                key={`${goal.slug}-${modality.slug}`}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{modality.name}</h3>
                  <RelevanceDots score={modality.relevance} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{modality.explanation}</p>
                <Link
                  href={modalityProductHref[modality.slug]}
                  className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View devices &rarr;
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Technology comparison for this goal
          </h2>
          <table className="mt-4 min-w-[760px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-700">
                <th className="py-2 pr-3">Metric</th>
                {goal.modalities.map((modality) => (
                  <th key={`head-${goal.slug}-${modality.slug}`} className="py-2 pr-3">
                    {modality.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3 font-medium">Relevance</td>
                {goal.modalities.map((modality) => (
                  <td key={`rel-${goal.slug}-${modality.slug}`} className="py-2 pr-3">
                    <RelevanceDots score={modality.relevance} />
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3 font-medium">Session time</td>
                {goal.modalities.map((modality) => (
                  <td key={`time-${goal.slug}-${modality.slug}`} className="py-2 pr-3">
                    {modality.sessionTime}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-3 font-medium">Rental from</td>
                {goal.modalities.map((modality) => (
                  <td key={`rent-${goal.slug}-${modality.slug}`} className="py-2 pr-3">
                    {modality.rentalFrom}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 pr-3 font-medium">Purchase from</td>
                {goal.modalities.map((modality) => (
                  <td key={`buy-${goal.slug}-${modality.slug}`} className="py-2 pr-3">
                    {modality.purchaseFrom}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Protocols</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {protocolCards.map((protocolCard) => (
              <ProtocolCard
                key={`${goal.slug}-${protocolCard.slug}`}
                protocol={protocolCard}
                href={`/protocols/${protocolCard.slug}`}
                compact
              />
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Recommended stacks</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goal.stacks.map((stack) => (
              <article
                key={`${goal.slug}-${stack.title}`}
                className={`rounded-xl border p-4 ${
                  stack.highlighted ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200'
                }`}
              >
                <h3 className="font-semibold text-slate-900">{stack.title}</h3>
                <p className="mt-2 text-sm text-slate-600">Devices: {stack.devices.join(', ')}</p>
                <p className="mt-2 text-sm text-slate-700">Rental: {stack.rentalPrice}</p>
                <p className="text-sm text-slate-700">Purchase: {stack.purchasePrice}</p>
                <Link
                  href={stack.link}
                  className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-white"
                >
                  Open stack
                </Link>
              </article>
            ))}
          </div>

          <Link
            href={`/wellness-planner?goal=${goal.slug}`}
            className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Or configure it yourself in the builder &rarr;
          </Link>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">What the research says</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {goal.evidenceIds.map((evidenceId) => {
              const evidence = evidenceById[evidenceId];
              if (!evidence) return null;

              return (
                <article
                  key={`${goal.slug}-${evidence.id}`}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">{evidence.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">
                    {evidence.publication} - {evidence.year}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{evidence.resultSummary}</p>
                </article>
              );
            })}
          </div>

          <Link
            href="/research"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            More research &rarr;
          </Link>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {goal.faq.map((faq) => (
              <details key={`${goal.slug}-${faq.q}`} className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
                  {faq.q}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/wellness-planner?goal=${goal.slug}`}
              className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Configure a stack
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Book a consultation
            </Link>
            <Link
              href="/rental"
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore rentals
            </Link>
          </div>
        </section>

        <p className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600">
          {disclaimers.general}
        </p>
      </div>
    </div>
  );
};
