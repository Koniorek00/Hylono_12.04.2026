import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Fuel, Calculator, TrendingDown, Info } from 'lucide-react';

// ─── FUEL PRICE DATA ─────────────────────────────────────────────────────────
// Approximate pump prices (petrol / diesel) per litre, updated early 2025.
// Source: Global Petrol Prices, European Commission, ACEA.
interface FuelData {
  petrol: number;
  diesel: number;
  currency: string;
  symbol: string;
  countryName: string;
}

const DEFAULT_FUEL_DATA: FuelData = {
  petrol: 1.75,
  diesel: 1.65,
  currency: 'EUR',
  symbol: '€',
  countryName: 'your region',
};

// ─── DEFAULTS ────────────────────────────────────────────────────────────────
const DEFAULTS = {
  car: {
    kmPerMonth: 1200,
    consumptionPer100km: 7.5,   // litres/100km — average EU car
    improvementPct: 17.5,        // midpoint of 15–20%
    fuelType: 'petrol' as 'petrol' | 'diesel',
    kitPriceLabel: 'Car Kit',
  },
  truck: {
    kmPerMonth: 6500,
    consumptionPer100km: 30,     // litres/100km — average diesel truck
    improvementPct: 14,          // midpoint of 10–18%
    fuelType: 'diesel' as 'petrol' | 'diesel',
    kitPriceLabel: 'Truck Kit',
  },
};

interface HHOROICalculatorProps {
  variant: 'car' | 'truck';
  initialFuelContext?: {
    fuelData: FuelData;
    countryCode: string;
    locationStatus: 'detected' | 'fallback';
  };
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export const HHOROICalculator: React.FC<HHOROICalculatorProps> = ({ variant, initialFuelContext }) => {
  const defaults = DEFAULTS[variant];
  const resolvedInitialFuelContext = initialFuelContext ?? {
    fuelData: DEFAULT_FUEL_DATA,
    countryCode: 'DEFAULT',
    locationStatus: 'fallback' as const,
  };

  // Location & fuel price state
  const [locationStatus] = useState<'detected' | 'fallback'>(resolvedInitialFuelContext.locationStatus);
  const [fuelData] = useState<FuelData>(resolvedInitialFuelContext.fuelData);

  // Calculator inputs
  const [kitPrice, setKitPrice] = useState<number>(variant === 'car' ? 499 : 899);
  const [kmPerMonth, setKmPerMonth] = useState<number>(defaults.kmPerMonth);
  const [consumptionPer100, setConsumptionPer100] = useState<number>(defaults.consumptionPer100km);
  const [fuelPricePerL, setFuelPricePerL] = useState<number>(
    resolvedInitialFuelContext.fuelData[defaults.fuelType]
  );
  const [improvementPct, setImprovementPct] = useState<number>(defaults.improvementPct);

  // Reset when variant changes
  useEffect(() => {
    setKmPerMonth(DEFAULTS[variant].kmPerMonth);
    setConsumptionPer100(DEFAULTS[variant].consumptionPer100km);
    setImprovementPct(DEFAULTS[variant].improvementPct);
    setKitPrice(variant === 'car' ? 499 : 899);
    setFuelPricePerL(fuelData[DEFAULTS[variant].fuelType]);
  }, [variant, fuelData]);

  // ── CALCULATIONS ──────────────────────────────────────────────────────────
  const monthlyFuelBefore = (kmPerMonth / 100) * consumptionPer100 * fuelPricePerL;
  const monthlySavings = monthlyFuelBefore * (improvementPct / 100);
  const paybackMonths = kitPrice > 0 && monthlySavings > 0 ? kitPrice / monthlySavings : Infinity;
  const annualSavings = monthlySavings * 12;
  const threeYearSavings = annualSavings * 3;
  const threeYearROI = kitPrice > 0 ? ((threeYearSavings - kitPrice) / kitPrice) * 100 : 0;

  const paybackLabel = () => {
    if (paybackMonths === Infinity || isNaN(paybackMonths)) return '—';
    if (paybackMonths < 1) return '< 1 month';
    if (paybackMonths < 12) return `${Math.ceil(paybackMonths)} months`;
    const yrs = Math.floor(paybackMonths / 12);
    const mos = Math.round(paybackMonths % 12);
    return mos > 0 ? `${yrs}y ${mos}m` : `${yrs} year${yrs > 1 ? 's' : ''}`;
  };

  const paybackProgress = Math.min(100, (12 / Math.max(paybackMonths, 0.1)) * 100);
  const sym = fuelData.symbol;

  const fmt = (n: number) =>
    n >= 1000
      ? `${sym}${(n / 1000).toFixed(1)}k`
      : `${sym}${n.toFixed(0)}`;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider mb-4">
            <Calculator size={12} /> ROI Calculator
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How Fast Will It Pay for Itself?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Enter your details — fuel prices are auto-detected for your location. Adjust any value to see your personalised payback period.
          </p>

          {/* Location badge */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {locationStatus === 'detected' && (
              <span className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <MapPin size={12} /> Fuel prices detected for {fuelData.countryName}
              </span>
            )}
            {locationStatus === 'fallback' && (
              <span className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                <MapPin size={12} /> Using EU average fuel prices — edit below to customise
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT: INPUTS ──────────────────────────────────────── */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-7">

            {/* Kit price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Kit Price</label>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Enter your quote</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-bold text-sm">{sym}</span>
                <input
                  type="number"
                  min={0}
                  max={9999}
                  value={kitPrice}
                  onChange={(e) => setKitPrice(Math.max(0, Number(e.target.value)))}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Enter the price from your Hylono quote. Default is indicative only.
              </p>
            </div>

            {/* km/month */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">
                  {variant === 'car' ? 'km driven per month' : 'km per month (fleet avg.)'}
                </label>
                <span className="text-sm font-black text-slate-900">{kmPerMonth.toLocaleString()} km</span>
              </div>
              <input
                type="range"
                min={variant === 'car' ? 300 : 1000}
                max={variant === 'car' ? 5000 : 20000}
                step={variant === 'car' ? 100 : 500}
                value={kmPerMonth}
                onChange={(e) => setKmPerMonth(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{variant === 'car' ? '300 km' : '1,000 km'}</span>
                <span className="text-[10px] text-slate-400">
                  avg {variant === 'car' ? '~1,200 km/mo' : '~6,500 km/mo'}
                </span>
                <span>{variant === 'car' ? '5,000 km' : '20,000 km'}</span>
              </div>
            </div>

            {/* Fuel consumption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700">Fuel consumption</label>
                <span className="text-sm font-black text-slate-900">{consumptionPer100.toFixed(1)} L/100km</span>
              </div>
              <input
                type="range"
                min={variant === 'car' ? 4 : 15}
                max={variant === 'car' ? 15 : 50}
                step={0.5}
                value={consumptionPer100}
                onChange={(e) => setConsumptionPer100(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{variant === 'car' ? '4 L/100km' : '15 L/100km'}</span>
                <span>{variant === 'car' ? '15 L/100km' : '50 L/100km'}</span>
              </div>
            </div>

            {/* Fuel price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  Fuel price
                  <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-normal">
                    {defaults.fuelType}
                  </span>
                </label>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">per litre</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-bold text-sm">{sym}</span>
                <input
                  type="number"
                  min={0.1}
                  max={5}
                  step={0.01}
                  value={fuelPricePerL.toFixed(2)}
                  onChange={(e) => setFuelPricePerL(Math.max(0.1, Number(e.target.value)))}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Improvement % */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  Fuel economy improvement
                  <Info size={12} className="text-slate-400" />
                </label>
                <span className="text-sm font-black text-cyan-600">{improvementPct.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={variant === 'car' ? 10 : 8}
                max={variant === 'car' ? 25 : 20}
                step={0.5}
                value={improvementPct}
                onChange={(e) => setImprovementPct(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Conservative</span>
                <span className="text-cyan-500 font-bold">
                  Product range: {variant === 'car' ? '15–20%' : '10–18%'}
                </span>
                <span>Optimistic</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: RESULTS ────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Payback period — hero card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cyan-400 blur-3xl" />
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Estimated Payback Period
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={paybackLabel()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="text-5xl font-black text-white mb-2"
                  >
                    {paybackLabel()}
                  </motion.div>
                </AnimatePresence>
                <p className="text-slate-400 text-sm">
                  at {sym}{fuelPricePerL.toFixed(2)}/L · {kmPerMonth.toLocaleString()} km/mo
                </p>

                {/* Progress bar */}
                <div className="mt-6 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(2, Math.min(100, paybackProgress))}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  {paybackMonths < 12 ? '✓ Under 12 months' : paybackMonths < 24 ? '✓ Under 2 years' : ''}
                </p>
              </div>
            </div>

            {/* Savings breakdown cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5 text-center">
                <TrendingDown size={20} className="text-cyan-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-slate-900">{fmt(monthlySavings)}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Monthly savings</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                <Fuel size={20} className="text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-black text-slate-900">{fmt(annualSavings)}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Annual savings</div>
              </div>
            </div>

            {/* 3-year projection */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">3-Year Projection</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  {threeYearROI > 0 ? `+${Math.round(threeYearROI)}% ROI` : ''}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Kit cost', value: `${sym}${kitPrice.toLocaleString()}`, color: 'text-red-400' },
                  { label: 'Fuel saved', value: fmt(threeYearSavings), color: 'text-emerald-400' },
                  { label: 'Net gain', value: fmt(Math.max(0, threeYearSavings - kitPrice)), color: 'text-cyan-400' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className={`text-xl font-black ${item.color}`}>{item.value}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current monthly fuel spend */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Current monthly fuel spend</p>
                  <p className="text-2xl font-black text-slate-900">{fmt(monthlyFuelBefore)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">After kit</p>
                  <p className="text-2xl font-black text-emerald-600">{fmt(monthlyFuelBefore - monthlySavings)}</p>
                </div>
              </div>
              <div className="mt-4 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, 100 - improvementPct)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                Saving {improvementPct.toFixed(1)}% of your fuel bill every month
              </p>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Estimates based on manufacturer fuel economy improvement data. Actual results depend on vehicle, driving conditions, and maintenance. Fuel prices auto-detected from your IP — last updated early 2025.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
