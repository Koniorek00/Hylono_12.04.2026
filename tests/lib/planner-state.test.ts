import { describe, expect, it } from 'vitest';
import {
  buildPlannerSearchParams,
  parsePlannerSearchParams,
  sanitizePlannerSelectionState,
} from '@/lib/planner-state';

describe('planner state helpers', () => {
  it('parses planner query params into a normalized state object', () => {
    const state = parsePlannerSearchParams(
      new URLSearchParams({
        source: 'planner',
        goal: 'recovery',
        goals: 'recovery,sleep',
        entry: 'goal',
        budgetMode: 'rental',
        budget: '1200',
        modality: 'RLT',
        space: 'Home room',
        products: 'hbot-st1700,h2-hop450',
        tier: 'optimal',
      })
    );

    expect(state).toEqual({
      source: 'planner',
      entryPath: 'goal',
      goals: ['recovery', 'sleep'],
      budgetMode: 'rental',
      budget: 1200,
      modality: 'RLT_NIR',
      space: 'Home room',
      productIds: ['hbot-st1700', 'h2-hop450'],
      tier: 'optimal',
    });
  });

  it('serializes planner state back into stable share params', () => {
    const params = buildPlannerSearchParams({
      source: 'planner',
      entryPath: 'budget',
      goals: ['stress'],
      budgetMode: 'purchase',
      budget: 24000,
      modality: 'H2',
      space: 'Clinic room',
      productIds: ['hydrogen-hop-450'],
    });

    expect(params.get('source')).toBe('planner');
    expect(params.get('entry')).toBe('budget');
    expect(params.get('goal')).toBe('stress');
    expect(params.get('goals')).toBe('stress');
    expect(params.get('budgetMode')).toBe('purchase');
    expect(params.get('budget')).toBe('24000');
    expect(params.get('modality')).toBe('H2');
    expect(params.get('space')).toBe('Clinic room');
    expect(params.get('products')).toBe('hydrogen-hop-450');
  });

  it('sanitizes saved browser state from local storage payloads', () => {
    const restored = sanitizePlannerSelectionState({
      entryPath: 'space',
      goals: ['comfort'],
      budgetMode: 'purchase',
      budget: 18000,
      selectedModality: 'PEMF',
      selectedSpace: 'Studio corner',
      selectedProductIds: ['tesla-max-pemf'],
    });

    expect(restored).toEqual({
      source: 'planner',
      entryPath: 'space',
      goals: ['comfort'],
      budgetMode: 'purchase',
      budget: 18000,
      modality: 'PEMF',
      space: 'Studio corner',
      productIds: ['tesla-max-pemf'],
    });
  });
});
