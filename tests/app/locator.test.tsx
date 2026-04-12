import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LocatorPageRoute, { metadata as locatorMetadata } from '@/app/locator/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

vi.mock('@/src/components/StructuredData', () => ({
  default: () => null,
}));

describe('/locator route', () => {
  it('keeps the locator route accessible to crawlers while remaining noindex', () => {
    expect(locatorMetadata.robots).toMatchObject({
      index: false,
      follow: true,
    });

    expect(locatorMetadata.alternates?.canonical).toMatch(/\/locator$/);
    expect(sitemap().some((entry) => entry.url.endsWith('/locator'))).toBe(false);

    const robotsConfig = robots();
    const robotRules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];
    const generalRule = robotRules.find(
      (rule) => !Array.isArray(rule.userAgent) && rule.userAgent === '*'
    );

    expect(generalRule).toBeDefined();
    expect(Array.isArray(generalRule?.disallow) ? generalRule.disallow : []).not.toContain(
      '/locator'
    );
  });

  it('slugifies grouped country headings so aria-labelledby points at valid ids', () => {
    render(<LocatorPageRoute />);

    const countryHeading = screen.getByRole('heading', {
      name: 'Czech Republic',
      level: 3,
    });

    expect(countryHeading).toHaveAttribute('id', 'locator-country-czech-republic');
    expect(countryHeading.closest('section')).toHaveAttribute(
      'aria-labelledby',
      'locator-country-czech-republic'
    );
  });
});
