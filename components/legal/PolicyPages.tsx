import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Cookie,
  Mail,
  RotateCcw,
  Scale,
  Settings2,
  Shield,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { MDR_COMPLIANCE_STATEMENT } from '@/content/disclaimers';
import { siteEntity } from '@/content/site-entity';
import { CookieSettingsButton } from '@/components/CookieConsent';

type PolicyFact = {
  label: string;
  value: string;
};

type PolicySection = {
  id: string;
  title: string;
  summary: string;
  content: ReactNode;
};

type PolicyPageLayoutProps = {
  category: string;
  title: string;
  intro: string;
  updatedLabel: string;
  icon: ReactNode;
  facts: PolicyFact[];
  sections: PolicySection[];
  currentPath: string;
  headingId?: string;
  descriptionId?: string;
};

const sharedPolicyLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Returns Policy', href: '/returns' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Sitemap XML', href: '/sitemap.xml' },
] as const;

const shellSectionClasses =
  'rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8';

function PolicyPageLayout({
  category,
  title,
  intro,
  updatedLabel,
  icon,
  facts,
  sections,
  currentPath,
  headingId,
  descriptionId,
}: PolicyPageLayoutProps) {
  const relatedLinks = sharedPolicyLinks.filter((link) => link.href !== currentPath);

  return (
    <div className="bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <section className={`${shellSectionClasses} overflow-hidden`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-800">
                  {icon}
                  {category}
                </span>
                <span>{updatedLabel}</span>
              </div>

              <div className="space-y-4">
                <h1
                  id={headingId}
                  className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"
                >
                  {title}
                </h1>
                <p
                  id={descriptionId}
                  className="max-w-3xl text-base leading-7 text-slate-700 sm:text-lg"
                >
                  {intro}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div
                    key={`${title}-${fact.label}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-900">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  Quick Actions
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href={`mailto:${siteEntity.contactEmail}`}
                    className="inline-flex min-h-11 items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
                  >
                    Contact Hylono
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <CookieSettingsButton className="inline-flex min-h-11 items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-white/15" />
                  <Link
                    href="/sitemap.xml"
                    className="inline-flex min-h-11 items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
                  >
                    Sitemap XML
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  On This Page
                </h2>
                <nav className="mt-4 space-y-2" aria-label={`${title} sections`}>
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block rounded-2xl px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                <p className="font-medium text-white">{siteEntity.serviceArea}</p>
                <p className="mt-1">{siteEntity.supportHours}</p>
                <p className="mt-3 text-slate-300">
                  Use these public pages to verify shipping, returns, warranty, privacy, and
                  cookie controls before you buy or submit a request.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            {sections.map((section) => (
              <section id={section.id} key={section.id} className={shellSectionClasses}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{section.summary}</p>
                  </div>
                  <div className="space-y-4 text-sm leading-7 text-slate-800 [&_a]:font-medium [&_a]:text-cyan-700 [&_a]:underline [&_a]:underline-offset-4 [&_li]:marker:text-slate-400">
                    {section.content}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="space-y-6">
            <section className={shellSectionClasses}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Related Policies
              </h2>
              <div className="mt-4 space-y-2">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    {link.label}
                    <ArrowUpRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>

            <section className={shellSectionClasses}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Need Help?
              </h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-cyan-700" aria-hidden="true" />
                  <span>
                    <a href={`mailto:${siteEntity.supportEmail}`}>{siteEntity.supportEmail}</a>
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Settings2 className="mt-0.5 h-4 w-4 text-cyan-700" aria-hidden="true" />
                  <span>{siteEntity.supportHours}</span>
                </p>
                <p className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-700" aria-hidden="true" />
                  <span>
                    If a page goes out of sync with the real service, the published policy should
                    be updated before the route stays indexable.
                  </span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout
      category="Privacy"
      title="Privacy Policy"
      intro="This page covers the personal data Hylono collects through contact, newsletter, and checkout flows, how that data is used to operate the site, and how optional analytics consent works."
      updatedLabel="Updated 11 April 2026"
      icon={<Shield className="h-4 w-4" aria-hidden="true" />}
      currentPath="/privacy"
      facts={[
        { label: 'Direct inputs', value: 'Contact, newsletter, and checkout forms.' },
        { label: 'Service area', value: siteEntity.serviceArea },
        { label: 'Support channel', value: siteEntity.contactEmail },
        { label: 'Optional analytics', value: 'PostHog only after consent.' },
      ]}
      sections={[
        {
          id: 'privacy-collected',
          title: 'What Hylono Collects',
          summary:
            'The repo verifies three main public collection points: contact requests, newsletter subscriptions, and checkout details.',
          content: (
            <>
              <p>
                Hylono&apos;s public forms collect the information needed to respond or fulfil the
                action you start.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Contact requests:</strong> name, email, subject, message, optional
                  phone, optional company, and inquiry type.
                </li>
                <li>
                  <strong>Newsletter signups:</strong> email, optional first name, and source
                  label.
                </li>
                <li>
                  <strong>Checkout:</strong> first name, last name, email, optional phone,
                  street address, city, postal code, country, cart items, and payment method.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'privacy-use',
          title: 'Why Hylono Uses It',
          summary:
            'Published site flows use this information for support, order handling, subscription management, and opted-in analytics.',
          content: (
            <>
              <p>Hylono uses submitted data to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>reply to enquiries and support requests;</li>
                <li>process orders and record checkout details;</li>
                <li>manage newsletter subscriptions and confirmations; and</li>
                <li>
                  measure site usage only when you opt in to analytics through Cookie Settings.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'privacy-tools',
          title: 'Service Providers And Systems',
          summary:
            'The codebase verifies payment, analytics, email, notification, CRM, and webhook integrations tied to these flows.',
          content: (
            <>
              <p>
                When these services are enabled, Hylono uses tools such as Stripe for card
                payment intents, PostHog for opted-in analytics, and operational services used for
                email delivery, notifications, CRM follow-up, and webhook dispatch.
              </p>
              <p>
                The current repo source does not support a claim that Hylono sells personal data,
                and this page does not publish one.
              </p>
            </>
          ),
        },
        {
          id: 'privacy-choices',
          title: 'Your Choices',
          summary:
            'Optional analytics consent can be changed at any time, and privacy questions should route through the public contact channel.',
          content: (
            <>
              <p>
                Use{' '}
                <CookieSettingsButton
                  className="inline-flex items-center rounded-full border border-cyan-200 px-3 py-1.5 text-sm font-medium text-cyan-800 hover:bg-cyan-50"
                  label="Cookie Settings"
                />{' '}
                to change optional analytics or marketing preferences.
              </p>
              <p>
                For access, correction, deletion, or other privacy questions, contact{' '}
                <a href={`mailto:${siteEntity.contactEmail}`}>{siteEntity.contactEmail}</a>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export function TermsOfServicePage() {
  return (
    <PolicyPageLayout
      category="Terms"
      title="Terms of Service"
      intro="These terms explain how you may use hylono.com, how checkout works, and which linked policies control shipping, returns, warranty, privacy, and cookies."
      updatedLabel="Updated 11 April 2026"
      icon={<Scale className="h-4 w-4" aria-hidden="true" />}
      currentPath="/terms"
      facts={[
        { label: 'Scope', value: 'Website use, enquiries, subscriptions, purchases, and rentals.' },
        { label: 'Payment methods', value: 'Card, bank transfer, and financing.' },
        { label: 'Product position', value: 'Wellness devices for general wellbeing.' },
        { label: 'Support email', value: siteEntity.supportEmail },
      ]}
      sections={[
        {
          id: 'terms-scope',
          title: 'Scope Of These Terms',
          summary:
            'This page applies to public site use and the direct flows Hylono exposes on the website.',
          content: (
            <>
              <p>
                These terms apply when you browse the public site, submit a contact request,
                subscribe to the newsletter, or start a direct checkout or rental flow on
                hylono.com.
              </p>
              <p>
                Product-specific promises should be read together with the linked shipping,
                returns, and warranty pages. Privacy and cookie handling are governed by the
                linked privacy and cookie policies.
              </p>
            </>
          ),
        },
        {
          id: 'terms-wellness',
          title: 'Wellness Positioning',
          summary:
            'The repo source of truth frames Hylono devices as wellness products, not condition-management tools.',
          content: (
            <>
              <p>
                Hylono products are wellness devices for general wellbeing. The site&apos;s content is
                educational and does not replace care from a qualified professional.
              </p>
              <p>{MDR_COMPLIANCE_STATEMENT}</p>
            </>
          ),
        },
        {
          id: 'terms-checkout',
          title: 'Orders, Checkout, And Payment',
          summary:
            'Checkout flows validate cart items and shipping information server-side and expose three payment paths.',
          content: (
            <>
              <p>
                Hylono&apos;s checkout route validates cart items and shipping details before an order
                is accepted for processing.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Shipping details include name, address, email, country, and postal code.</li>
                <li>Payment methods currently include card, bank transfer, and financing.</li>
                <li>
                  When card checkout is enabled, the server creates a Stripe PaymentIntent rather
                  than sending card handling to the browser unchecked.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'terms-linked-policies',
          title: 'Linked Purchase Policies',
          summary:
            'Shipping, returns, warranty, privacy, and cookie controls remain on public routes so buyers can verify them before they commit.',
          content: (
            <>
              <p>
                Use the linked public policies for the operational terms that matter most before
                buying or renting:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>shipping region and timing;</li>
                <li>return window, free return status, and refund type;</li>
                <li>warranty term and coverage scope; and</li>
                <li>privacy and cookie controls.</li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
}

export function ShippingPolicyPage() {
  return (
    <PolicyPageLayout
      category="Shipping"
      title="Shipping Policy"
      intro="This page summarizes the public delivery facts Hylono currently publishes: European Union coverage, the shipping timeline exposed in structured data, and the support routes buyers should use if a shipment needs attention."
      updatedLabel="Updated 11 April 2026"
      icon={<Truck className="h-4 w-4" aria-hidden="true" />}
      currentPath="/shipping"
      headingId="shipping-hero-headline"
      facts={[
        { label: 'Area served', value: siteEntity.serviceArea },
        { label: 'Handling time', value: '0 to 1 business day' },
        { label: 'Transit time', value: '5 to 10 business days' },
        { label: 'Cutoff', value: '16:00, Monday to Friday' },
      ]}
      sections={[
        {
          id: 'shipping-coverage',
          title: 'Where Hylono Ships',
          summary:
            'The route and canonical site entity both point to a European Union service footprint.',
          content: (
            <>
              <p>
                Hylono&apos;s public site entity and shipping structured data both publish European
                Union coverage as the active service area for this route.
              </p>
              <p>
                If your request sits outside that area, the safest public next step is to contact{' '}
                <a href={`mailto:${siteEntity.supportEmail}`}>{siteEntity.supportEmail}</a>{' '}
                before placing an order.
              </p>
            </>
          ),
        },
        {
          id: 'shipping-timing',
          title: 'Published Delivery Timing',
          summary:
            'The current shipping schema on this route exposes handling, transit, and order cutoff values.',
          content: (
            <>
              <p>
                The shipping details published on this route currently describe a European Union
                configuration with a €0 shipping rate, 0 to 1 business day handling, 5 to 10
                business day transit, and a 16:00 cutoff on Monday to Friday.
              </p>
              <p>
                That makes this route the public source buyers should check before a purchase if
                delivery timing is part of the decision.
              </p>
            </>
          ),
        },
        {
          id: 'shipping-checkout',
          title: 'What Buyers Should Confirm',
          summary:
            'Checkout already asks for the fields shipping depends on, so the page should point buyers back to those essentials rather than invent logistics promises.',
          content: (
            <>
              <p>Before checkout, confirm that your order includes:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>a complete delivery name and street address;</li>
                <li>a working email address for order updates; and</li>
                <li>the correct city, postal code, and country.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'shipping-support',
          title: 'Support After Dispatch',
          summary:
            'Post-purchase routes should stay explicit: shipping issues go to support, returns go to the returns page, and warranty questions go to the warranty page.',
          content: (
            <>
              <p>
                Contact <a href={`mailto:${siteEntity.supportEmail}`}>{siteEntity.supportEmail}</a>{' '}
                if you need delivery help.
              </p>
              <p>
                For a change in buying decision, use the public returns page. For a coverage
                question after delivery, use the warranty page.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export function ReturnsPolicyPage() {
  return (
    <PolicyPageLayout
      category="Returns"
      title="Returns Policy"
      intro="This page covers Hylono&apos;s public return terms for direct purchases: the 30-day window, free eligible returns, full refunds, and the EU withdrawal right."
      updatedLabel="Updated 11 April 2026"
      icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
      currentPath="/returns"
      headingId="returns-hero-headline"
      facts={[
        { label: 'Published return window', value: '30 days' },
        { label: 'Return fees', value: 'Free for eligible returns' },
        { label: 'Refund type', value: 'Full refund' },
        { label: 'Return method', value: 'Return by mail' },
      ]}
      sections={[
        {
          id: 'returns-window',
          title: 'Return Window And Consumer Rights',
          summary:
            'Hylono publishes a 30-day return window, and EU buyers still keep their statutory withdrawal rights.',
          content: (
            <>
              <p>
                The structured data published on this route states a 30-day merchant return window
                for eligible Hylono returns.
              </p>
              <p>
                EU consumers also keep the legal 14-day withdrawal right for distance purchases.
                Both timelines should stay easy to find.
              </p>
            </>
          ),
        },
        {
          id: 'returns-scope',
          title: 'What This Page Covers',
          summary:
            'The current Hylono copy positions this route around direct purchases, not every possible third-party resale scenario.',
          content: (
            <>
              <p>
                This page is written for direct Hylono purchases. If you bought from another seller
                or marketplace, that seller&apos;s return terms may apply instead.
              </p>
              <p>
                Use the support channel before shipping hardware back.
              </p>
            </>
          ),
        },
        {
          id: 'returns-start',
          title: 'How To Start A Return',
          summary:
            'The route should reduce uncertainty: one public support path, then the return instructions Hylono provides.',
          content: (
            <>
              <p>
                Start with <a href={`mailto:${siteEntity.supportEmail}`}>{siteEntity.supportEmail}</a>{' '}
                and include the order details you already have from checkout.
              </p>
              <p>
                Wait for Hylono&apos;s return instructions before you send a device back.
              </p>
            </>
          ),
        },
        {
          id: 'returns-refund',
          title: 'Refund Handling',
          summary:
            'The route publishes free returns and full refunds, so that promise should stay visible above the fold and in the body copy.',
          content: (
            <>
              <p>
                The current return schema states free returns and a full refund for eligible items.
              </p>
              <p>
                Approved returns go back to the original payment method used at checkout.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export function WarrantyPolicyPage() {
  return (
    <PolicyPageLayout
      category="Warranty"
      title="Warranty"
      intro="This page only publishes the warranty facts the repo verifies today: a 2-year term, parts-and-labor scope, the covered issue types, and the public support channel."
      updatedLabel="Updated 11 April 2026"
      icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
      currentPath="/warranty"
      headingId="warranty-hero-headline"
      descriptionId="warranty-hero-description"
      facts={[
        { label: 'Standard term', value: '2 years' },
        { label: 'Scope', value: 'Parts and labor' },
        {
          label: 'Published coverage',
          value: 'Manufacturing defects, component failures, electronic malfunctions, and structural issues.',
        },
        { label: 'Support route', value: `${siteEntity.supportEmail} · ${siteEntity.supportHours}` },
      ]}
      sections={[
        {
          id: 'warranty-standard',
          title: 'Standard Warranty Promise',
          summary:
            'The warranty schema already defines the public promise, so the page should stay aligned with that exact scope.',
          content: (
            <>
              <p>
                Hylono currently publishes a 2-year standard warranty promise tied to the public
                warranty route.
              </p>
              <p>
                It covers parts and labor for manufacturing defects, component failures,
                electronic malfunctions, and structural issues.
              </p>
            </>
          ),
        },
        {
          id: 'warranty-support',
          title: 'How To Ask For Warranty Help',
          summary:
            'The safest public next step is a support contact, not an unsupported marketing CTA or form.',
          content: (
            <>
              <p>
                For warranty questions, contact{' '}
                <a href={`mailto:${siteEntity.supportEmail}`}>{siteEntity.supportEmail}</a> during{' '}
                {siteEntity.supportHours}.
              </p>
              <p>
                This route should not promise a 24/7 hotline or an extended plan unless those
                offers are separately published and verified.
              </p>
            </>
          ),
        },
        {
          id: 'warranty-consumer-rights',
          title: 'Consumer Rights Still Apply',
          summary:
            'Commercial warranty copy should not crowd out the buyer’s mandatory legal rights.',
          content: (
            <>
              <p>
                The public warranty promise sits alongside any mandatory consumer rights that apply
                in the buyer&apos;s country of purchase or residence.
              </p>
              <p>
                If a product page needs more detail, it should link back here instead of publishing
                a conflicting summary.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export function CookiePolicyPage() {
  return (
    <PolicyPageLayout
      category="Cookies"
      title="Cookie Policy"
      intro="This page explains the storage Hylono currently verifies in the repo: the consent record, announcement dismissal state, and optional PostHog analytics storage that only loads after consent."
      updatedLabel="Updated 11 April 2026"
      icon={<Cookie className="h-4 w-4" aria-hidden="true" />}
      currentPath="/cookie-policy"
      facts={[
        { label: 'Essential storage', value: 'Consent record and site-state storage.' },
        { label: 'Optional analytics', value: 'PostHog after explicit consent.' },
        { label: 'Consent duration', value: '180 days for the consent cookie.' },
        { label: 'Manage anytime', value: 'Use Cookie Settings from any page.' },
      ]}
      sections={[
        {
          id: 'cookie-essential',
          title: 'Essential Storage',
          summary:
            'The codebase verifies a consent record and site-state storage that are required for basic preference handling.',
          content: (
            <>
              <p>Hylono currently verifies these core browser-side storage items:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>cookieConsent</strong>: stored in both local storage and a cookie so the
                  site can remember your analytics and marketing preferences.
                </li>
                <li>
                  <strong>hylono_announcement_dismissed</strong>: stored in local storage so the
                  site remembers whether the announcement banner was dismissed.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'cookie-analytics',
          title: 'Optional Analytics',
          summary:
            'Analytics are lazy-loaded and remain opted out by default until the visitor chooses otherwise.',
          content: (
            <>
              <p>
                Hylono&apos;s analytics module only initializes PostHog after analytics consent is
                present.
              </p>
              <p>
                The current implementation uses browser local storage for PostHog persistence and
                listens for consent changes so optional analytics can be turned on or off later.
              </p>
            </>
          ),
        },
        {
          id: 'cookie-marketing',
          title: 'Marketing Preference',
          summary:
            'The consent record stores both analytics and marketing choices so future optional tags can honour the same preference model.',
          content: (
            <>
              <p>
                The current settings panel records a marketing preference even though the repo-level
                optional analytics integration verified today is PostHog.
              </p>
              <p>
                That means the cookie settings dialog remains the correct public place to change
                either optional preference.
              </p>
            </>
          ),
        },
        {
          id: 'cookie-manage',
          title: 'How To Manage Cookies',
          summary:
            'Consent must be easy to revisit, so the public route and the reusable settings button both point visitors back to the same control.',
          content: (
            <>
              <p>
                Use{' '}
                <CookieSettingsButton
                  className="inline-flex items-center rounded-full border border-cyan-200 px-3 py-1.5 text-sm font-medium text-cyan-800 hover:bg-cyan-50"
                  label="Cookie Settings"
                />{' '}
                to accept optional cookies, reject optional cookies, or change individual choices.
              </p>
              <p>
                You can also clear stored data through your browser, but that may reset basic site
                preferences at the same time.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
