import React, { useActionState, useEffect, useMemo, useState } from 'react';
import { type ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  getRentalPlanOptions,
  resolveRentalPlan,
  resolveRentalProductId,
  type RentalPlanOption,
} from '@/lib/commerce/rental-catalog';
import { productById } from '@/content/products';
import { NavigateFunction } from '../types';
import { FeatureGate } from './FeatureGate';
import { rentalCheckoutContent } from '../content/rentalCheckout';
import { submitRentalFormAction, type FormActionResult } from '../src/actions/formActions';

interface RentalCheckoutPageProps {
  onNavigate: NavigateFunction;
}

interface CheckoutPlanOption {
  deposit: number;
  id: string;
  label: string;
  lineItems: RentalPlanOption[];
  monthlyPrice: number;
  minPeriod: string;
  productLabel: string;
  termMonths: number;
}

const DEFAULT_RENTAL_PRODUCT_ID = 'hbot-st1700';

const formatEur = (amount: number): string => `EUR ${amount}`;

const toTitleCase = (value: string): string =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const formatProductLabel = (productIds: string[]): string => {
  if (productIds.length === 0) {
    return 'Selected rental plan';
  }

  if (productIds.length === 1) {
    const firstProductId = productIds[0];
    return firstProductId
      ? productById[firstProductId]?.title ?? 'Selected rental plan'
      : 'Selected rental plan';
  }

  return `${productIds.length} selected devices`;
};

const getRequestedProductIds = (params: ReadonlyURLSearchParams): string[] => {
  const candidates = [
    ...((params.get('items') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)),
    params.get('device') ?? '',
  ];

  const resolved = candidates
    .map((candidate) => resolveRentalProductId(candidate))
    .filter((value): value is string => Boolean(value));

  if (resolved.length === 0) {
    return [DEFAULT_RENTAL_PRODUCT_ID];
  }

  return [...new Set(resolved)];
};

const buildCheckoutPlanOptions = (productIds: string[]): CheckoutPlanOption[] => {
  const planGroups = productIds
    .map((productId) => ({
      productId,
      plans: getRentalPlanOptions(productId),
    }))
    .filter((entry) => entry.plans.length > 0);

  if (planGroups.length === 0) {
    return [];
  }

  const commonTerms = planGroups.reduce<number[]>((terms, entry, index) => {
    const entryTerms = entry.plans.map((plan) => plan.termMonths);

    if (index === 0) {
      return entryTerms;
    }

    return terms.filter((term) => entryTerms.includes(term));
  }, []);

  return commonTerms
    .sort((left, right) => left - right)
    .map((termMonths) => {
      const lineItems = planGroups
        .map((entry) => entry.plans.find((plan) => plan.termMonths === termMonths))
        .filter((plan): plan is RentalPlanOption => Boolean(plan));
      const firstLineItem = lineItems[0];

      if (lineItems.length !== planGroups.length || !firstLineItem) {
        return null;
      }

      return {
        id:
          productIds.length === 1
            ? firstLineItem.id
            : `bundle-${productIds.join('-')}-${termMonths}`,
        label: `${termMonths} month${termMonths === 1 ? '' : 's'} plan`,
        monthlyPrice: lineItems.reduce((sum, plan) => sum + plan.monthlyPrice, 0),
        deposit: lineItems.reduce((sum, plan) => sum + plan.deposit, 0),
        minPeriod: firstLineItem.minPeriod,
        termMonths,
        lineItems,
        productLabel: formatProductLabel(productIds),
      } satisfies CheckoutPlanOption;
    })
    .filter((option): option is CheckoutPlanOption => Boolean(option));
};

const LegacyRentalCheckoutFallback: React.FC<{
  message?: string;
  onNavigate: NavigateFunction;
}> = ({ message = 'Enhanced rental checkout is currently disabled.', onNavigate }) => (
  <div className="min-h-screen bg-slate-50 px-6 pb-24 pt-32">
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white p-8 text-center">
      <h1 className="mb-3 text-3xl font-black text-slate-900 futuristic-font">Rental checkout</h1>
      <p className="mb-6 text-slate-600">{message}</p>
      <button
        onClick={() => onNavigate('rental')}
        className="min-h-11 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
      >
        Back to rental plans
      </button>
    </div>
  </div>
);

const EnhancedRentalCheckout: React.FC<RentalCheckoutPageProps> = ({ onNavigate }) => {
  const reduced = useReducedMotion();
  const searchParams = useSearchParams();
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryCompany, setDeliveryCompany] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryPostalCode, setDeliveryPostalCode] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('Poland');
  const [acceptRentalTerms, setAcceptRentalTerms] = useState(false);
  const [acceptIntendedUse, setAcceptIntendedUse] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const productIds = useMemo(() => getRequestedProductIds(searchParams), [searchParams]);
  const checkoutPlanOptions = useMemo(
    () => buildCheckoutPlanOptions(productIds),
    [productIds]
  );
  const defaultPlanId = checkoutPlanOptions[1]?.id ?? checkoutPlanOptions[0]?.id ?? '';
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);

  useEffect(() => {
    setSelectedPlanId((current) => {
      if (checkoutPlanOptions.some((plan) => plan.id === current)) {
        return current;
      }

      return defaultPlanId;
    });
  }, [checkoutPlanOptions, defaultPlanId]);

  const [rentalState, rentalFormAction, rentalPending] = useActionState<FormActionResult, FormData>(
    submitRentalFormAction,
    { success: false, message: '' }
  );

  const selectedPlan = useMemo(
    () => checkoutPlanOptions.find((plan) => plan.id === selectedPlanId) ?? checkoutPlanOptions[0] ?? null,
    [checkoutPlanOptions, selectedPlanId]
  );

  useEffect(() => {
    if (rentalState.success) {
      setSubmitted(true);
      setSubmitError(null);
      return;
    }

    if (rentalState.message) {
      setSubmitError(rentalState.message);
    }
  }, [rentalState]);

  if (!selectedPlan) {
    return (
      <LegacyRentalCheckoutFallback
        onNavigate={onNavigate}
        message="We could not resolve a compatible rental plan for the selected device or bundle. Please return to the rental hub or contact Hylono for guidance."
      />
    );
  }

  const rentalItemsJson = JSON.stringify(
    selectedPlan.lineItems.map((plan) => ({
      techId: plan.productId,
      quantity: 1,
      monthlyPrice: plan.monthlyPrice,
    }))
  );

  const productTitle = selectedPlan.productLabel;
  const firstInvoiceEstimate = selectedPlan.monthlyPrice + selectedPlan.deposit;
  const selectedDeviceTokens = productIds.map((productId) => {
    const product = productById[productId];
    return product?.title ?? toTitleCase(productId);
  });

  const isDeliveryValid =
    deliveryName.trim().length > 1 &&
    deliveryEmail.includes('@') &&
    deliveryAddress.trim().length > 4 &&
    deliveryCity.trim().length > 1 &&
    deliveryPostalCode.trim().length > 2 &&
    deliveryCountry.trim().length > 1;

  const canSubmit = isDeliveryValid && acceptRentalTerms && acceptIntendedUse;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pb-24 pt-32">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-8 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle size={30} />
          </div>
          <h1 className="mb-3 text-3xl font-black text-slate-900 futuristic-font">Rental request received</h1>
          <p className="mb-2 text-slate-600">
            We recorded your rental request for {productTitle} and will contact {deliveryEmail} with
            the next steps, payment options, and delivery timing.
          </p>
          <p className="mb-4 text-sm text-slate-500">
            Selected devices: {selectedDeviceTokens.join(', ')}.
          </p>
          {rentalState.rentalId && (
            <p className="mb-6 text-sm text-slate-500">Reference: {rentalState.rentalId}</p>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('rental')}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
            >
              Return to rental overview
              <ArrowRight size={14} />
            </button>
            <Link
              href="/contact?intent=rental"
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Talk to an advisor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 pb-20 pt-28">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.aside
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="h-fit rounded-3xl border border-slate-100 bg-white p-6 lg:col-span-1"
        >
          <h1 className="mb-4 text-2xl font-black text-slate-900 futuristic-font">
            {rentalCheckoutContent.title}
          </h1>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">{productTitle}</h2>
            <p className="mt-1 text-xs text-slate-500">Plan: {selectedPlan.label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatEur(selectedPlan.monthlyPrice)}/mo
            </p>
            <div className="mt-3 space-y-2">
              {selectedPlan.lineItems.map((plan) => (
                <div key={plan.productId} className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {plan.productTitle}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {formatEur(plan.monthlyPrice)}/mo · Deposit {formatEur(plan.deposit)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Estimated monthly total</dt>
              <dd className="text-slate-800">{formatEur(selectedPlan.monthlyPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Estimated refundable deposit</dt>
              <dd className="text-slate-800">{formatEur(selectedPlan.deposit)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Delivery and setup</dt>
              <dd className="text-emerald-700">Included</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-bold">
              <dt className="text-slate-900">Estimated first invoice after review</dt>
              <dd className="text-slate-900">{formatEur(firstInvoiceEstimate)}</dd>
            </div>
          </dl>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            {rentalCheckoutContent.depositNote}
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Need a different configuration?</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/rental" className="font-semibold text-cyan-700 hover:text-cyan-800">
                Back to rental hub
              </Link>
              <Link
                href="/contact?intent=rental"
                className="font-semibold text-cyan-700 hover:text-cyan-800"
              >
                Ask for guidance
              </Link>
            </div>
          </div>
        </motion.aside>

        <motion.section
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 lg:col-span-2"
        >
          <form action={rentalFormAction} className="space-y-8">
            <input type="hidden" name="itemsJson" value={rentalItemsJson} />
            <input type="hidden" name="termMonths" value={String(selectedPlan.termMonths)} />

            <fieldset>
              <legend className="mb-3 text-lg font-bold text-slate-900">Select rental plan</legend>
              <div className="space-y-2">
                {checkoutPlanOptions.map((plan) => (
                  <label
                    key={plan.id}
                    className="flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    <input
                      type="radio"
                      name="rental-plan"
                      className="mt-1 accent-cyan-600"
                      checked={selectedPlanId === plan.id}
                      onChange={() => setSelectedPlanId(plan.id)}
                    />
                    <span className="text-sm text-slate-700">
                      <span className="block font-semibold text-slate-900">
                        {plan.label} - {formatEur(plan.monthlyPrice)}/mo
                      </span>
                      <span className="block text-xs text-slate-500">
                        Deposit {formatEur(plan.deposit)} · {plan.productLabel}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-lg font-bold text-slate-900">Delivery details</legend>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="rental-name" className="mb-2 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>
                  <input
                    id="rental-name"
                    name="fullName"
                    value={deliveryName}
                    onChange={(event) => setDeliveryName(event.target.value)}
                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rental-email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    id="rental-email"
                    name="email"
                    type="email"
                    value={deliveryEmail}
                    onChange={(event) => setDeliveryEmail(event.target.value)}
                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="rental-phone" className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    id="rental-phone"
                    name="phone"
                    value={deliveryPhone}
                    onChange={(event) => setDeliveryPhone(event.target.value)}
                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="rental-company" className="mb-2 block text-sm font-semibold text-slate-700">
                    Company or clinic (optional)
                  </label>
                  <input
                    id="rental-company"
                    name="company"
                    value={deliveryCompany}
                    onChange={(event) => setDeliveryCompany(event.target.value)}
                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="rental-address" className="mb-2 block text-sm font-semibold text-slate-700">
                  Address
                </label>
                <input
                  id="rental-address"
                  name="address"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                  required
                />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="rental-city" className="mb-2 block text-sm font-semibold text-slate-700">
                    City
                  </label>
                  <input
                    id="rental-city"
                    name="city"
                    value={deliveryCity}
                    onChange={(event) => setDeliveryCity(event.target.value)}
                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rental-postal" className="mb-2 block text-sm font-semibold text-slate-700">
                    Postal code
                  </label>
                  <input
                    id="rental-postal"
                    name="postalCode"
                    value={deliveryPostalCode}
                    onChange={(event) => setDeliveryPostalCode(event.target.value)}
                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rental-country" className="mb-2 block text-sm font-semibold text-slate-700">
                    Country
                  </label>
                  <input
                    id="rental-country"
                    name="country"
                    value={deliveryCountry}
                    onChange={(event) => setDeliveryCountry(event.target.value)}
                    className="w-full min-h-11 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-lg font-bold text-slate-900">Rental terms</legend>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                <div className="mb-2 flex items-start gap-2 text-cyan-900">
                  <Info size={16} className="mt-0.5" />
                  <p className="text-sm font-semibold">Program conditions</p>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-cyan-900">
                  {rentalCheckoutContent.terms.map((term) => (
                    <li key={term}>{term.replace('{selectedPlan.minPeriod}', selectedPlan.minPeriod)}</li>
                  ))}
                </ul>
              </div>
              <label className="mt-4 flex min-h-11 items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={acceptRentalTerms}
                  onChange={(event) => setAcceptRentalTerms(event.target.checked)}
                  className="mt-1 accent-cyan-600"
                />
                <span>
                  {rentalCheckoutContent.termsAcceptance}{' '}
                  <Link href="/terms" className="text-cyan-700 underline" target="_blank" rel="noreferrer">
                    Full terms {'->'}
                  </Link>
                </span>
              </label>
            </fieldset>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              This form submits a rental request for manual review. We confirm payment method,
              deposit timing, and delivery details with you after the request is accepted.
            </div>

            <label className="flex min-h-11 items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={acceptIntendedUse}
                onChange={(event) => setAcceptIntendedUse(event.target.checked)}
                className="mt-1 accent-cyan-600"
              />
              <span>{rentalCheckoutContent.intendedUse}</span>
            </label>

            {submitError && (
              <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || rentalPending}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rentalPending ? <Loader2 size={16} className="animate-spin" /> : null}
              {rentalCheckoutContent.paymentButtonPrefix}
            </button>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export const RentalCheckoutPage: React.FC<RentalCheckoutPageProps> = ({ onNavigate }) => {
  return (
    <FeatureGate
      flag="feature_rental_checkout"
      fallback={<LegacyRentalCheckoutFallback onNavigate={onNavigate} />}
    >
      <EnhancedRentalCheckout onNavigate={onNavigate} />
    </FeatureGate>
  );
};
