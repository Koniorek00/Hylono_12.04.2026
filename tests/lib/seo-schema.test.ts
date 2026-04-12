import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import CareersPageRoute, { metadata as careersMetadata } from '@/app/careers/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { CareersClient } from '@/app/careers/CareersClient';
import { createOrganizationSchema, createWebSiteSchema } from '@/lib/seo-schema';

describe('schema cleanup', () => {
  it('omits unsupported organization facts from the organization schema', () => {
    const schema = createOrganizationSchema();

    expect(schema).not.toHaveProperty('foundingDate');
    expect(schema).not.toHaveProperty('numberOfEmployees');
    expect(schema).not.toHaveProperty('foundingLocation');
    expect(schema).not.toHaveProperty('naics');
    expect(schema).not.toHaveProperty('priceRange');
    expect(schema).not.toHaveProperty('slogan');
    expect(schema).not.toHaveProperty('knowsAbout');
    expect(schema).not.toHaveProperty('paymentAccepted');
  });

  it('keeps the website schema free of retired sitelinks-search markup', () => {
    const schema = createWebSiteSchema();

    expect(schema).not.toHaveProperty('potentialAction');
  });

  it('keeps the careers route as a thin client wrapper without speculative job schema', () => {
    const route = CareersPageRoute() as ReactElement<Record<string, unknown>>;

    expect(route.type).toBe(CareersClient);
    expect(route.props.children).toBeUndefined();
  });

  it('keeps the careers route directly accessible but de-exposed from crawl promotion', () => {
    expect(careersMetadata.robots).toMatchObject({
      index: false,
      follow: true,
    });

    expect(careersMetadata.alternates?.canonical).toMatch(/\/careers$/);
    expect(sitemap().some((entry) => entry.url.endsWith('/careers'))).toBe(false);

    const robotsConfig = robots();
    const robotRules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];
    const generalRule = robotRules.find(
      (rule) => !Array.isArray(rule.userAgent) && rule.userAgent === '*'
    );

    expect(generalRule).toBeDefined();
    expect(Array.isArray(generalRule?.disallow) ? generalRule.disallow : []).not.toContain(
      '/careers'
    );
    expect(createOrganizationSchema().subjectOf).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@id': expect.stringMatching(/\/careers$/),
        }),
      ])
    );
  });
});
