import React, { useMemo, useState } from 'react';
import { NavigateFunction, TechType } from '../types';
import { rentalLandingContent, rentalProducts, RentalBudgetFilter, RentalTechnologyFilter } from '../content/rental';

interface RentalLandingPageProps {
  onNavigate: NavigateFunction;
}

const technologyToTechType: Record<Exclude<RentalTechnologyFilter, 'all'>, TechType> = {
  mHBOT: TechType.HBOT,
  H2: TechType.HYDROGEN,
  RLT: TechType.RLT,
  PEMF: TechType.PEMF,
};

const matchesBudget = (price: number, budget: RentalBudgetFilter): boolean => {
  if (budget === 'all') return true;
  if (budget === 'upto-500') return price <= 500;
  if (budget === '500-1000') return price > 500 && price <= 1000;
  if (budget === '1000-2000') return price > 1000 && price <= 2000;
  return price > 2000;
};

export const RentalLandingPage: React.FC<RentalLandingPageProps> = ({ onNavigate }) => {
  const [technology, setTechnology] = useState<RentalTechnologyFilter>('all');
  const [budget, setBudget] = useState<RentalBudgetFilter>('all');

  const lowestRentalPrice = useMemo(() => {
    if (rentalProducts.length === 0) return 0;
    return Math.min(...rentalProducts.map((product) => product.rentalMonthly));
  }, []);

  const filteredProducts = useMemo(() => {
    return rentalProducts.filter((product) => {
      const technologyMatch = technology === 'all' || product.modality === technology;
      const budgetMatch = matchesBudget(product.rentalMonthly, budget);
      return technologyMatch && budgetMatch;
    });
  }, [budget, technology]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10">
          <h1 className="text-3xl font-bold text-slate-900">{rentalLandingContent.hero.title}</h1>
          <p className="mt-3 text-sm text-slate-600">
            {rentalLandingContent.hero.subtitle} From €{lowestRentalPrice}/mo.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById('available-rental-devices')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-5 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {rentalLandingContent.hero.cta}
          </button>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">How it works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {rentalLandingContent.howItWorks.map((step) => (
              <article key={step.number} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Step {step.number}</p>
                <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="available-rental-devices" className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Available devices</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Technology</span>
              <select
                value={technology}
                onChange={(event) => setTechnology(event.target.value as RentalTechnologyFilter)}
                className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3"
              >
                <option value="all">All</option>
                <option value="mHBOT">mHBOT</option>
                <option value="H2">H2</option>
                <option value="RLT">RLT</option>
                <option value="PEMF">PEMF</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budget/mo</span>
              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value as RentalBudgetFilter)}
                className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3"
              >
                <option value="all">All</option>
                <option value="upto-500">Up to €500</option>
                <option value="500-1000">€500–1,000</option>
                <option value="1000-2000">€1,000–2,000</option>
                <option value="2000-plus">€2,000+</option>
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{product.title}</h3>
                <p className="mt-2 text-sm text-slate-600">from €{product.rentalMonthly}/mo</p>
                <p className="mt-1 text-xs text-slate-500">{product.available ? 'Available' : 'Made to order'}</p>
                <button
                  type="button"
                  onClick={() => {
                    const target = technologyToTechType[product.modality as Exclude<RentalTechnologyFilter, 'all'>];
                    if (target) onNavigate(`product/${target}?mode=rental`);
                  }}
                  className="mt-3 min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View product →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 overflow-x-auto">
          <h2 className="text-xl font-bold text-slate-900">Buy vs rent — which is right for you?</h2>
          <table className="mt-4 min-w-[680px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-700">
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Purchase</th>
                <th className="py-2 pr-3">Rental</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {rentalLandingContent.comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-3 font-medium text-slate-700">{row.label}</td>
                  <td className="py-2 pr-3">{row.purchase}</td>
                  <td className="py-2 pr-3">{row.rental}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">Rental FAQ</h2>
          <div className="mt-4 space-y-3">
            {rentalLandingContent.faq.map((item) => (
              <details key={item.q} className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">{item.q}</summary>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {rentalLandingContent.testimonials.length > 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900">What rental customers say</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {rentalLandingContent.testimonials.map((testimonial) => (
                <article key={testimonial.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-700">“{testimonial.quote}”</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{testimonial.author}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900">{rentalLandingContent.finalCta.title}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('builder?mode=rental')}
              className="min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {rentalLandingContent.finalCta.primary}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('advisors')}
              className="min-h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {rentalLandingContent.finalCta.secondary}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
