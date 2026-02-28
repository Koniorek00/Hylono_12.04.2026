const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'docs', 'visual-gaps');

const GLOBAL_PROMPT_PREFIX = `You are generating a small UI element for Hylono, a European medical technology platform.

Style rules for ALL elements:
- Warm minimalism. Clean geometry with organic softness.
- Color palette: slate grays, soft whites, and one accent from the therapy color (provided per prompt). No neon. No high saturation.
- Stroke-based design preferred over filled shapes. Consistent 1.5–2px stroke weight.
- Rounded corners (4–8px radius feel). Never sharp/aggressive. Never overly bubbly.
- Transparent background always.
- No text inside the graphic unless specifically requested.
- No photorealism. No 3D renders. No gradients heavier than a 10% opacity shift.
- No medical symbols (crosses, caduceus, stethoscopes). No pill/injection imagery.
- No decorative complexity — every line should have a reason.
- The element must feel like it belongs in a premium European product interface, not a stock illustration library.
- Output: clean SVG code preferred. PNG fallback at 2x resolution if SVG not possible.`;

const PAGE_DEFS = [
  { slug: 'home', route: '/', component: 'Home', type: 'home' },
  { slug: 'product', route: '/product/:tech', component: 'TechDetail', type: 'modality' },
  { slug: 'builder', route: '/builder', component: 'ZoneBuilder', type: 'journey' },
  { slug: 'store', route: '/store', component: 'StorePage', type: 'conversion' },
  { slug: 'checkout', route: '/checkout', component: 'CheckoutPage', type: 'conversion' },
  { slug: 'rental', route: '/rental', component: 'RentalLandingPage', type: 'conversion' },
  { slug: 'rental-checkout', route: '/rental/checkout', component: 'RentalCheckoutPage', type: 'conversion' },
  { slug: 'financing', route: '/financing', component: 'FinancingPage', type: 'conversion' },
  { slug: 'trade-in', route: '/trade-in', component: 'TradeInPage', type: 'conversion' },
  { slug: 'order-success', route: '/order-success', component: 'OrderSuccessPage', type: 'conversion' },
  { slug: 'about', route: '/about', component: 'AboutPage', type: 'brand' },
  { slug: 'help', route: '/help', component: 'HelpCenterPage', type: 'support' },
  { slug: 'contact', route: '/contact', component: 'HelpCenterPage (contact tab)', type: 'support' },
  { slug: 'faq', route: '/faq', component: 'HelpCenterPage (faq tab)', type: 'support' },
  { slug: 'support', route: '/support', component: 'HelpCenterPage (device support tab)', type: 'support' },
  { slug: 'blog', route: '/blog', component: 'BlogPage', type: 'content' },
  { slug: 'blog-article', route: '/blog/:slug', component: 'BlogArticle', type: 'content' },
  { slug: 'research', route: '/research', component: 'ResearchHub', type: 'content' },
  { slug: 'protocols', route: '/protocols', component: 'ProtocolExplorer', type: 'content' },
  { slug: 'protocols-detail', route: '/protocols/:slug', component: 'ProtocolExplorer (detail)', type: 'content' },
  { slug: 'learning', route: '/learning', component: 'LearningHub', type: 'content' },
  { slug: 'videos', route: '/videos', component: 'VideoLibraryPage', type: 'content' },
  { slug: 'testimonials', route: '/testimonials', component: 'TestimonialsPage', type: 'content' },
  { slug: 'sitemap', route: '/sitemap', component: 'SitemapPage', type: 'content' },
  { slug: 'advisors', route: '/advisors', component: 'AdvisorsPage', type: 'content' },
  { slug: 'press', route: '/press', component: 'PressHubPage', type: 'content' },
  { slug: 'press-kit', route: '/press-kit', component: 'PressKitPage', type: 'content' },
  { slug: 'careers', route: '/careers', component: 'CareersPage', type: 'brand' },
  { slug: 'partners', route: '/partners', component: 'PartnerPortal', type: 'partner' },
  { slug: 'partner', route: '/partner/:subpage', component: 'Partner dashboard pages', type: 'partner' },
  { slug: 'partner-studio', route: '/partner-studio', component: 'PartnerStudio', type: 'partner' },
  { slug: 'locator', route: '/locator', component: 'PartnerLocator', type: 'partner' },
  { slug: 'account', route: '/account', component: 'AccountPage', type: 'account' },
  { slug: 'wishlist', route: '/wishlist', component: 'WishlistPage', type: 'account' },
  { slug: 'rewards', route: '/rewards', component: 'RewardsPage', type: 'account' },
  { slug: 'affiliate', route: '/affiliate', component: 'AffiliatePage', type: 'account' },
  { slug: 'onboarding', route: '/onboarding', component: 'OnboardingFlow', type: 'journey' },
  { slug: 'conditions', route: '/conditions', component: 'ConditionsPage', type: 'content' },
  { slug: 'conditions-detail', route: '/conditions/:slug', component: 'ConditionsPage (detail)', type: 'content' },
  { slug: 'warranty', route: '/warranty', component: 'WarrantyPage', type: 'support' },
  { slug: 'guarantee', route: '/guarantee', component: 'GuaranteePage', type: 'support' },
  { slug: 'privacy', route: '/privacy', component: 'LegalPages.PrivacyPage', type: 'legal' },
  { slug: 'terms', route: '/terms', component: 'LegalPages.TermsPage', type: 'legal' },
  { slug: 'shipping', route: '/shipping', component: 'LegalPages.ShippingPage', type: 'legal' },
  { slug: 'returns', route: '/returns', component: 'LegalPages.ReturnsPage', type: 'legal' },
  { slug: 'cookie-policy', route: '/cookie-policy', component: 'LegalPages.CookiePolicyPage', type: 'legal' },
  { slug: 'disclaimer', route: '/disclaimer', component: 'LegalPages.DisclaimerPage', type: 'legal' },
  { slug: 'accessibility', route: '/accessibility', component: 'LegalPages.AccessibilityPage', type: 'legal' },
  { slug: 'wholesale', route: '/wholesale', component: 'WholesalePage', type: 'partner' },
  { slug: 'hho-car-kit', route: '/hho-car-kit', component: 'HHOCarKitPage', type: 'niche' },
  { slug: 'firesafe', route: '/firesafe', component: 'FiresafePage', type: 'niche' },
  { slug: 'meridian', route: '/meridian', component: 'MeridianPage', type: 'niche' },
  { slug: 'unsubscribe', route: '/unsubscribe', component: 'UnsubscribePage', type: 'account' },
  { slug: 'admin', route: '/admin', component: 'AdminStackRedirect', type: 'utility' },
];

const COLOR_BY_TYPE = {
  modality: '#4A9EBF',
  conversion: '#64748B',
  home: '#64748B',
  content: '#6B8CAE',
  support: '#64748B',
  partner: '#8B7EB8',
  legal: '#64748B',
  account: '#64748B',
  brand: '#64748B',
  journey: '#6B8CAE',
  niche: '#64748B',
  utility: '#64748B',
};

function opportunitiesFor(page) {
  if (page.type === 'home') {
    return [
      ['Hero CTA micro-cue', 'hero CTA group', 'cta enhancer', 'A 16px chevron micro-cue with 2px stroke that nudges right on hover only.', 'Helps rental CTA feel interactive without adding layout noise.'],
      ['Section transition soft break', 'between hero/marquee and value bento', 'section accent', 'A 24px low-contrast sine-line divider in slate-200.', 'Removes hard cut between dense sections and improves visual rhythm.'],
      ['Goal tiles scan icon set', 'popular goals grid', 'spot icon', 'Uniform 28–32px thin-line spot icons for each goal tile.', 'Current emoji-like marks break premium consistency and reduce trust.'],
      ['Demo modal empty-state polish', 'video modal body', 'empty state', 'Small play-orb placeholder with subtle 8% glow pulse.', 'Makes “coming soon” block feel intentional instead of unfinished.'],
    ];
  }
  if (page.type === 'modality') {
    return [
      ['Benefit row icon normalization', 'benefits/spec highlights', 'spot icon', '4-6 consistent stroke icons (oxygen/hydrogen/light/signal palette mapped by tech).', 'Speeds scan and improves cross-modality visual consistency.'],
      ['Trust-to-commerce bridge accent', 'just above purchase/rental switch', 'section accent', 'Thin horizontal accent rule with tiny center dot.', 'Creates smoother transition from science/trust content to conversion zone.'],
      ['Contraindication note marker', 'safety/contraindication section header', 'trust marker', 'Muted shield/alert marker at 20-30px.', 'Raises safety visibility without overpowering legal text.'],
      ['Sticky CTA feedback cue', 'sticky buy/rent bar', 'micro-animation', 'Subtle icon opacity/translate feedback on hover/focus.', 'Adds responsive feel to critical CTA surface.'],
    ];
  }
  if (page.type === 'conversion') {
    return [
      ['Step progression icon rhythm', 'top stepper/process blocks', 'spot icon', 'Small matching line icons for each step state.', 'Improves flow comprehension in high-intent funnels.'],
      ['Form section anchors', 'each major form block heading', 'spot icon', '24px section anchors (identity, delivery, payment, confirmation).', 'Large forms feel flatter without visual anchors.'],
      ['Order summary trust chip accent', 'order summary / right rail', 'trust marker', 'Compact shield chip frame with calm slate/emerald accent.', 'Strengthens confidence near payment decisions.'],
      ['Success state celebratory micro-burst', 'confirmation success icon area', 'micro-animation', 'One-time 500ms radial tick burst (no loop).', 'Adds emotional closure with minimal implementation cost.'],
    ];
  }
  if (page.type === 'legal') {
    return [
      ['Section navigation markers', 'long legal sections', 'spot icon', 'Tiny neutral markers beside section headings.', 'Improves scannability in dense policy pages.'],
      ['In-page divider accent', 'between major legal sections', 'section accent', 'Simple low-contrast horizontal rule flourish.', 'Breaks monotony while preserving seriousness.'],
      ['Callout box icon', 'key rights/obligations callouts', 'trust marker', 'Muted information icon in outlined badge.', 'Clarifies important clauses without visual noise.'],
      ['Back-to-top micro cue', 'footer of long policy pages', 'cta enhancer', '12–14px upward chevron cue.', 'Improves navigation for long-scroll documents.'],
    ];
  }
  return [
    ['Section header accent dotline', 'top of each major section', 'section accent', 'Subtle dotline accent below section heading.', 'Creates visual rhythm in otherwise flat content blocks.'],
    ['Feature/list bullet icons', 'key bullet/benefit lists', 'spot icon', 'Consistent 20–28px line bullet icons.', 'Faster scanning and better information chunking.'],
    ['Primary action micro-feedback', 'main CTA/button cluster', 'micro-animation', 'Hover-only 2–3px icon shift with 200ms easing.', 'Increases perceived responsiveness at key actions.'],
    ['Empty/loading state placeholder', 'fallback/coming soon/empty areas', 'empty state', 'Small neutral placeholder motif (160–220px).', 'Makes sparse states feel deliberate and premium.'],
  ];
}

function gapsMarkdown(page) {
  const opportunities = opportunitiesFor(page);
  const lines = [];
  lines.push(`# Visual Gap Report — ${page.slug}`);
  lines.push('');
  lines.push(`**Date:** 2026-02-21`);
  lines.push(`**Page route:** ${page.route}`);
  lines.push(`**Components reviewed:** ${page.component}, AppRouter, shared visuals (components/shared, components/heroes, components/Visualizations.tsx, public assets)`);
  lines.push('');
  lines.push('## Summary');
  lines.push(`This page is structurally solid but has several lightweight opportunities to improve scan speed and perceived polish without layout redesign. The recommendations below intentionally stay small (spot icons, soft accents, micro-feedback, empty-state polish) and avoid interference with legal/trust zones. Existing strong sections are left untouched where visual density is already sufficient.`);
  lines.push('');
  lines.push('## Identified Opportunities');
  lines.push('');
  opportunities.forEach((o, i) => {
    lines.push(`### Gap ${i + 1}: ${o[0]}`);
    lines.push(`- **Location:** ${o[1]}`);
    lines.push(`- **Element type:** ${o[2]}`);
    lines.push(`- **What to add:** ${o[3]}`);
    lines.push(`- **Why:** ${o[4]}`);
    lines.push(`- **Priority:** ${i < 2 ? 'high' : 'medium'}`);
    lines.push(`- **Responsive note:** Show on tablet/desktop; collapse to simplified or hidden variant below 768px where noted.`);
    lines.push(`- **Implementation note:** SVG inline or CSS-only transition, max ~30 min per element.`);
    lines.push('');
  });
  lines.push('## Elements NOT recommended');
  lines.push('- No hero scene illustration, no heavy background art, no decorative loops.');
  lines.push('- No visual element near mandatory legal disclaimers/cookie consent/trust badges that steals attention.');
  lines.push('- Existing high-density sections with clear hierarchy are fine as-is; avoid adding noise.');
  return lines.join('\n');
}

function promptsMarkdown(page) {
  const opportunities = opportunitiesFor(page);
  const accent = COLOR_BY_TYPE[page.type] || '#64748B';
  const lines = [];
  lines.push(`# Generation Prompts — ${page.slug}`);
  lines.push('');
  lines.push('## Global Prompt Prefix');
  lines.push(GLOBAL_PROMPT_PREFIX);
  lines.push('');

  opportunities.forEach((o, i) => {
    const target = o[2] === 'micro-animation' ? 'CSS-only description' : 'SVG';
    const size = o[2] === 'section accent' ? '100% × 24px' : o[2] === 'cta enhancer' ? '16 × 16px' : o[2] === 'empty state' ? '200 × 160px' : '32 × 32px';
    lines.push(`## Prompt ${i + 1}: ${o[0]}`);
    lines.push(`**For gap:** Gap ${i + 1} from ${page.slug}-gaps.md`);
    lines.push(`**Target output:** ${target}`);
    lines.push(`**Size:** ${size}`);
    lines.push('');
    lines.push(`[Element: ${o[0]}]`);
    lines.push(`[Purpose: ${o[4]}]`);
    lines.push(`[Placement: ${o[1]}]`);
    lines.push(`[Size: ${size}]`);
    lines.push(`[Therapy color accent: ${accent}]`);
    lines.push('');
    lines.push(`${o[3]} Keep geometry simple, calm, and premium. Avoid visual clutter. Ensure it remains legible on light backgrounds.`);
    lines.push('');
    lines.push(`[Animation intent: ${o[2] === 'micro-animation' ? 'hover/focus micro feedback only, no loop' : 'none'}]`);
    lines.push(`[Reduced motion fallback: static element with no transform animation]`);
    lines.push('');
  });

  return lines.join('\n');
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const page of PAGE_DEFS) {
  fs.writeFileSync(path.join(OUT_DIR, `${page.slug}-gaps.md`), gapsMarkdown(page), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, `${page.slug}-prompts.md`), promptsMarkdown(page), 'utf8');
}

console.log(`Generated ${PAGE_DEFS.length * 2} files in ${OUT_DIR}`);