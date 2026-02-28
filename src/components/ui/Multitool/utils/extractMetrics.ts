/**
 * Metric Extraction Utilities
 * 
 * Extracts primary metrics from section content for "Peek" tooltips.
 * Supports common patterns found in Hylono product/therapy pages.
 */

export interface ExtractedMetric {
  value: string;
  label?: string;
  unit?: string;
}

export type SectionType = 
  | 'specs' 
  | 'benefits' 
  | 'pricing' 
  | 'evidence' 
  | 'features' 
  | 'reviews' 
  | 'faq'
  | 'overview'
  | 'gallery'
  | 'protocols'
  | 'resources'
  | 'delivery'
  | 'safety'
  | 'goals'
  | 'synergies'
  | 'bundles'
  | 'how-to-use'
  | 'trust'
  | 'timeline'
  | 'description'
  | 'default';

/**
 * Common metric patterns for extraction
 */
const PATTERNS = {
  // Pressure values (e.g., "1.5 ATA", "2.0 ATA")
  pressure: /(\d+\.?\d*)\s*(ATA|psi|bar)/i,
  
  // Currency values (e.g., "€150", "$1,299")
  currency: /([€$£]\s*\d[\d,]*(?:\.\d{2})?(?:\s*\/?\s*(?:mo|month|day|week|yr|year)?)?)/gi,
  
  // Percentage values (e.g., "85%", "15-20%")
  percentage: /(\d+(?:\s*-\s*\d+)?)\s*%/g,
  
  // Time duration (e.g., "60 min", "2 hours")
  duration: /(\d+)\s*(min|minutes?|hrs?|hours?|sessions?)/gi,
  
  // Dimensions (e.g., "90cm x 180cm", "36" x 72"")
  dimensions: /(\d+(?:\.\d+)?)\s*(?:cm|in|"|'|m|meters?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(cm|in|"|'|m|meters?)/gi,
  
  // Weight (e.g., "45 kg", "100 lbs")
  weight: /(\d+(?:\.\d+)?)\s*(kg|lbs?|pounds?|kilograms?)/gi,
  
  // Study count (e.g., "150+ studies", "50 clinical trials")
  studyCount: /(\d+)\+?\s*(studies?|clinical\s*trials?|papers?|research)/gi,
  
  // Rating (e.g., "4.8 out of 5", "4.8★")
  rating: /(\d+\.?\d*)\s*(?:out\s*of\s*5|★|stars?)/gi,
  
  // Count (e.g., "500+ clients", "10,000 users")
  count: /(\d[\d,]*)\+?\s*(clients?|users?|customers?|patients?|sessions?)/gi,
};

/**
 * Section-specific extraction strategies
 */
const SECTION_STRATEGIES: Record<SectionType, (content: string) => ExtractedMetric | null> = {
  specs: (content) => {
    // For specs, prioritize: pressure > dimensions > weight
    const pressure = content.match(PATTERNS.pressure);
    if (pressure) {
      return { value: pressure[0], label: 'Pressure', unit: pressure[2] };
    }
    
    const dimensions = content.match(PATTERNS.dimensions);
    if (dimensions) {
      return { value: dimensions[0], label: 'Dimensions' };
    }
    
    const weight = content.match(PATTERNS.weight);
    if (weight) {
      return { value: weight[0], label: 'Weight' };
    }
    
    return null;
  },
  
  pricing: (content) => {
    // For pricing, find the first/main price
    const prices = content.match(PATTERNS.currency);
    if (prices && prices.length > 0) {
      // Find the lowest price (often the rental/starting price)
      const priceValues = prices.map(p => ({
        raw: p,
        value: parseFloat(p.replace(/[^\d.]/g, '')) || 0
      }));
      
      // Return the first price found (usually the primary offering)
      return { value: prices[0], label: 'From' };
    }
    
    return null;
  },
  
  benefits: (content) => {
    // For benefits, look for percentages or study counts
    const percentages = content.match(PATTERNS.percentage);
    if (percentages && percentages.length > 0) {
      return { value: percentages[0], label: 'Improvement' };
    }
    
    const studies = content.match(PATTERNS.studyCount);
    if (studies) {
      return { value: studies[0], label: 'Research' };
    }
    
    return null;
  },
  
  evidence: (content) => {
    // For evidence, prioritize study counts
    const studies = content.match(PATTERNS.studyCount);
    if (studies) {
      return { value: studies[0], label: 'Studies' };
    }
    
    const percentages = content.match(PATTERNS.percentage);
    if (percentages && percentages.length > 0) {
      return { value: percentages[0], label: 'Efficacy' };
    }
    
    return null;
  },
  
  reviews: (content) => {
    // For reviews, look for rating or count
    const rating = content.match(PATTERNS.rating);
    if (rating) {
      return { value: `${rating[1]}★`, label: 'Rating' };
    }
    
    const count = content.match(PATTERNS.count);
    if (count) {
      return { value: count[0], label: 'Reviews' };
    }
    
    return null;
  },
  
  features: (content) => {
    // For features, look for counts or duration
    const duration = content.match(PATTERNS.duration);
    if (duration) {
      return { value: duration[0], label: 'Session' };
    }
    
    const count = content.match(PATTERNS.count);
    if (count) {
      return { value: count[0] };
    }
    
    return null;
  },
  
  faq: () => null, // FAQ sections don't typically have metrics
  
  overview: (content) => {
    // Overview might have any metric
    const pressure = content.match(PATTERNS.pressure);
    if (pressure) {
      return { value: pressure[0], label: 'Pressure' };
    }
    
    const prices = content.match(PATTERNS.currency);
    if (prices && prices.length > 0) {
      return { value: prices[0], label: 'From' };
    }
    
    return null;
  },
  
  gallery: () => null,
  
  protocols: (content) => {
    const duration = content.match(PATTERNS.duration);
    if (duration) {
      return { value: duration[0], label: 'Duration' };
    }
    
    return null;
  },
  
  resources: (content) => {
    const studies = content.match(PATTERNS.studyCount);
    if (studies) {
      return { value: studies[0], label: 'Resources' };
    }
    
    return null;
  },
  
  delivery: (content) => {
    const duration = content.match(PATTERNS.duration);
    if (duration) {
      return { value: duration[0], label: 'Delivery' };
    }
    
    return null;
  },
  
  safety: () => null,
  
  goals: () => null,
  
  synergies: (content) => {
    const percentage = content.match(PATTERNS.percentage);
    if (percentage) {
      return { value: percentage[0], label: 'Boost' };
    }
    
    return null;
  },
  
  bundles: (content) => {
    const prices = content.match(PATTERNS.currency);
    if (prices && prices.length > 0) {
      return { value: prices[0], label: 'From' };
    }
    
    return null;
  },
  
  'how-to-use': (content) => {
    const duration = content.match(PATTERNS.duration);
    if (duration) {
      return { value: duration[0], label: 'Session' };
    }
    
    return null;
  },
  
  trust: () => null,
  
  timeline: (content) => {
    const duration = content.match(PATTERNS.duration);
    if (duration) {
      return { value: duration[0], label: 'Timeline' };
    }
    
    return null;
  },
  
  description: () => null,
  
  default: (content) => {
    // Generic extraction - try all patterns
    const patterns = [
      PATTERNS.pressure,
      PATTERNS.currency,
      PATTERNS.percentage,
      PATTERNS.duration,
    ];
    
    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return { value: match[0] };
      }
    }
    
    return null;
  },
};

/**
 * Detects the section type from element attributes or content
 */
export function detectSectionType(element: Element): SectionType {
  // Check explicit data-section attribute
  const dataSection = element.getAttribute('data-section');
  if (dataSection && Object.keys(SECTION_STRATEGIES).includes(dataSection)) {
    return dataSection as SectionType;
  }
  
  // Check ID for common patterns
  const id = element.id?.toLowerCase() || '';
  
  // Specifications
  if (id.includes('spec') || id.includes('tech') || id.includes('configuration')) return 'specs';
  
  // Pricing
  if (id.includes('price') || id.includes('rental') || id.includes('cost') || id.includes('financing')) return 'pricing';
  
  // Benefits
  if (id.includes('benefit') || id.includes('advantage') || id.includes('why-choose')) return 'benefits';
  
  // Evidence
  if (id.includes('evidence') || id.includes('science') || id.includes('research') || id.includes('studies')) return 'evidence';
  
  // Reviews
  if (id.includes('review') || id.includes('testimonial')) return 'reviews';
  
  // Features
  if (id.includes('feature')) return 'features';
  
  // FAQ
  if (id.includes('faq') || id.includes('question')) return 'faq';
  
  // Overview
  if (id.includes('overview') || id.includes('intro') || id.includes('hero')) return 'overview';
  
  // Gallery
  if (id.includes('gallery') || id.includes('image') || id.includes('photos')) return 'gallery';
  
  // Protocols
  if (id.includes('protocol')) return 'protocols';
  
  // Resources
  if (id.includes('resource')) return 'resources';
  
  // Delivery
  if (id.includes('delivery') || id.includes('shipping') || id.includes('install')) return 'delivery';
  
  // Safety
  if (id.includes('safety') || id.includes('compliance') || id.includes('contraindication')) return 'safety';
  
  // Goals
  if (id.includes('goal') || id.includes('who-for') || id.includes('designed-for') || id.includes('is-this-for')) return 'goals';
  
  // Synergies
  if (id.includes('synerg') || id.includes('pair') || id.includes('combine') || id.includes('enhancement')) return 'synergies';
  
  // Bundles
  if (id.includes('bundle') || id.includes('package') || id.includes('starter')) return 'bundles';
  
  // How to use
  if (id.includes('how-to') || id.includes('usage') || id.includes('protocol-steps') || id.includes('instruction')) return 'how-to-use';
  
  // Trust
  if (id.includes('trust') || id.includes('why-selected') || id.includes('guarantee') || id.includes('warranty')) return 'trust';
  
  // Timeline
  if (id.includes('timeline') || id.includes('what-to-expect') || id.includes('results') || id.includes('progress')) return 'timeline';
  
  // Description
  if (id.includes('description') || id.includes('about') || id.includes('detail')) return 'description';
  
  // Check classList for hints
  const classes = element.className?.toLowerCase() || '';
  if (classes.includes('specs')) return 'specs';
  if (classes.includes('pricing')) return 'pricing';
  if (classes.includes('benefits')) return 'benefits';
  if (classes.includes('evidence')) return 'evidence';
  if (classes.includes('delivery')) return 'delivery';
  if (classes.includes('safety')) return 'safety';
  if (classes.includes('goals')) return 'goals';
  
  return 'default';
}

/**
 * Extracts the primary metric from a section element
 */
export function extractSectionMetric(element: Element): ExtractedMetric | null {
  const sectionType = detectSectionType(element);
  
  // Get text content for analysis
  const content = element.textContent?.trim() || '';
  
  // Also check for specific metric elements
  const metricEl = element.querySelector('[data-metric], .metric-value, .stat-value');
  if (metricEl?.textContent) {
    const value = metricEl.textContent.trim();
    const label = metricEl.getAttribute('data-metric-label') || 
                  metricEl.closest('[data-metric-label]')?.getAttribute('data-metric-label');
    return { value, label: label || undefined };
  }
  
  // Apply section-specific strategy
  const strategy = SECTION_STRATEGIES[sectionType];
  const result = strategy(content);
  
  // Fall back to default strategy if section-specific found nothing
  if (!result && sectionType !== 'default') {
    return SECTION_STRATEGIES.default(content);
  }
  
  return result;
}

/**
 * Gets a short preview text from a section
 */
export function getSectionPreview(element: Element, maxLength: number = 100): string {
  // Try to find the main content area
  const contentEl = element.querySelector(
    'p, .prose p, .description, [data-description], .section-description'
  );
  
  const text = contentEl?.textContent?.trim() || element.textContent?.trim() || '';
  
  if (text.length <= maxLength) return text;
  
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

/**
 * Formats a metric for display in peek tooltip
 */
export function formatMetricForPeek(metric: ExtractedMetric | null): string {
  if (!metric) return '';
  
  if (metric.label) {
    return `${metric.label}: ${metric.value}`;
  }
  
  return metric.value;
}