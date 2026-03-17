# SEO and AI Visibility Reporting

## Purpose

This repo treats search and AI visibility as a measurable acquisition system, not a vague brand outcome.
The reporting layer combines:

- Google Search Console for Google Search performance
- Bing Webmaster Tools for Bing search and Copilot / AI Performance reporting
- Google Merchant Center for free listings and merchant visibility
- PostHog for on-site attribution and content-path behavior

## Traffic taxonomy

The client analytics layer classifies the first landing of a session into one of these channels:

- `google_search`
- `bing_search`
- `copilot`
- `chatgpt`
- `perplexity`
- `direct`
- `other`

These channels are emitted through the `landing_acquisition_detected` event and should be used as the source of truth for on-site attribution slices.

## Required PostHog events

### Acquisition

- `landing_acquisition_detected`
  - `channel`
  - `source`
  - `medium`
  - `referrerHost`
  - `landingPath`
  - `utmSource`
  - `utmMedium`
  - `utmCampaign`
  - `isAiAssistant`

### Cluster-path navigation

- `condition_to_research`
- `condition_to_product`
- `condition_to_protocol`
- `condition_to_rental`
- `condition_to_contact`
- `research_to_product`
- `research_to_protocol`
- `research_to_contact`
- `product_to_protocol`
- `product_to_rental`
- `product_to_contact`
- `citation_opened`

These events should be reviewed by destination and originating path to understand whether the site structure is actually moving users through the intended topical graph.

## Dashboard sections

### 1. Search acquisition

- Sessions and users by `landing_acquisition_detected.channel`
- Landing pages by channel
- Google search landings by condition, research, product, protocol, trust page
- Bing and Copilot landings by path group
- ChatGPT and Perplexity landings by path group

### 2. Topical graph progression

- `condition_to_research`
- `research_to_product`
- `product_to_protocol`
- `product_to_rental`
- `product_to_contact`
- `citation_opened`

Each chart should support breakdown by `destination`, `condition`, `tech`, `slug`, or `evidenceId`.

### 3. Merchant visibility

- Merchant Center free listing clicks
- Merchant Center impressions
- Product landing sessions by `google_search`
- Product landing sessions by `bing_search`
- Product-to-rental and product-to-contact conversion rate

### 4. Trust and support visibility

- Landing sessions on `/about`, `/editorial-policy`, `/research`, `/help`, `/faq`, `/press`, `/contact`
- Contact page entries from search and AI assistants
- Citation opens from research, blog, product, and protocol routes

## External source-of-truth checks

### Google Search Console

Review weekly:

- Queries and pages for condition, research, product, protocol, and trust routes
- Index coverage issues
- Page-level CTR shifts for the main cluster pages

### Bing Webmaster Tools

Review weekly:

- Bing search clicks and impressions
- AI / Copilot performance views where available
- Query and page segments that overlap with Hylono condition and product hubs

### Merchant Center

Review weekly:

- Product approval status
- Free listing impressions and clicks
- Merchant issues affecting public offer visibility

## Weekly reporting template

1. Search visibility summary
2. AI visibility summary
3. Merchant visibility summary
4. Topical graph progression summary
5. Trust-page performance summary
6. Open crawl, schema, or indexing issues
7. Actions for the next sprint

## Owner map

- Search Console: growth / SEO owner
- Bing Webmaster Tools: growth / SEO owner
- Merchant Center: commerce owner
- PostHog dashboards: product analytics owner
- Citation and claim integrity: editorial and compliance owners
