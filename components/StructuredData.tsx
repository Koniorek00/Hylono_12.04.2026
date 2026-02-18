import React, { useEffect } from 'react';
import { TechType, TechData } from '../types';
import { TECH_DETAILS } from '../constants';

// ============================================================
// JSON-LD Structured Data Components for SEO
// ============================================================

// Type definitions for structured data
interface ArticleData {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    author?: string;
    content?: string;
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

// FAQ Schema Types
interface FAQItem {
    q: string;
    a: string;
}

interface FAQCategory {
    category: string;
    items: FAQItem[];
}

type StructuredDataInput = TechData | ArticleData | BreadcrumbItem[] | FAQCategory[] | undefined;

interface StructuredDataProps {
    type: 'Product' | 'Organization' | 'Article' | 'BreadcrumbList' | 'FAQPage';
    data?: StructuredDataInput;
}

// Main component that injects JSON-LD into page head
export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
    useEffect(() => {
        const existingScript = document.getElementById(`structured-data-${type}`);
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = `structured-data-${type}`;
        script.type = 'application/ld+json';

        let schemaData;

        switch (type) {
            case 'Product':
                schemaData = generateProductSchema(data as TechData);
                break;
            case 'Organization':
                schemaData = generateOrganizationSchema();
                break;
            case 'Article':
                schemaData = generateArticleSchema(data as ArticleData);
                break;
            case 'BreadcrumbList':
                schemaData = generateBreadcrumbSchema(data as BreadcrumbItem[]);
                break;
            case 'FAQPage':
                schemaData = generateFAQSchema(data as FAQCategory[]);
                break;
            default:
                return;
        }

        script.innerHTML = JSON.stringify(schemaData);
        document.head.appendChild(script);

        return () => {
            const scriptToRemove = document.getElementById(`structured-data-${type}`);
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, [type, data]);

    return null;
};

// ============================================================
// Schema Generators
// ============================================================

const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hylono",
    "alternateName": "Hylono Systems",
    "url": "https://hylono.com",
    "logo": "https://hylono.com/favicon.svg",
    "description": "Premium bio-optimization technology for cellular regeneration. HBOT, PEMF, Red Light Therapy, and Molecular Hydrogen systems.",
    "foundingDate": "2024",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Warsaw",
        "addressCountry": "PL"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contact@hylono.com",
        "availableLanguage": ["English", "Polish"]
    },
    "sameAs": [
        "https://www.linkedin.com/company/hylono",
        "https://www.instagram.com/hylono"
    ],
    "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 52.2297,
            "longitude": 21.0122
        },
        "geoRadius": "5000"
    }
});

const generateProductSchema = (tech: TechData) => {
    if (!tech) return null;

    const priceValue = tech.price?.replace(/[^0-9.]/g, '') || '0';
    const rentalPriceValue = tech.rentalPrice ? String(tech.rentalPrice) : null;

    // Build offers array - always include purchase, add rental if available (P1-1 SEO Fix)
    const offers: Array<{
        "@type": string;
        name?: string;
        price: string;
        priceCurrency: string;
        availability: string;
        seller: { "@type": string; name: string };
        priceValidUntil: string;
        eligibleDuration?: string;
    }> = [
        {
            "@type": "Offer",
            "name": "Purchase",
            "price": priceValue,
            "priceCurrency": "USD",
            "availability": tech.inventory?.available > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Hylono"
            },
            "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
    ];

    // Add rental offer if rental price exists (P1-1 SEO Enhancement)
    if (rentalPriceValue) {
        offers.push({
            "@type": "Offer",
            "name": "Monthly Rental",
            "price": rentalPriceValue,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Hylono"
            },
            "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "eligibleDuration": "P1M" // ISO 8601 duration: 1 month
        });
    }

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `Hylono ${tech.name}`,
        "description": tech.descriptionStandard || tech.tagline,
        "brand": {
            "@type": "Brand",
            "name": "Hylono"
        },
        "category": "Bio-Optimization Equipment",
        "url": `https://hylono.com/product/${tech.id}`,
        "image": `https://hylono.com/images/${tech.id.toLowerCase()}-product.jpg`,
        "offers": offers.length === 1 ? offers[0] : offers,
        "additionalProperty": tech.technicalSpecs?.map(spec => ({
            "@type": "PropertyValue",
            "name": spec.label,
            "value": spec.value
        })) || [],
        "review": {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "4.8",
                "bestRating": "5"
            },
            "author": {
                "@type": "Organization",
                "name": "Hylono Quality Assurance"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127"
        }
    };
};

interface ArticleData {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    author?: string;
    content?: string;
}

const generateArticleSchema = (article: ArticleData) => {
    if (!article) return null;

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "datePublished": article.date,
        "dateModified": article.date,
        "author": {
            "@type": "Organization",
            "name": "Hylono Research Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Hylono",
            "logo": {
                "@type": "ImageObject",
                "url": "https://hylono.com/favicon.svg"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://hylono.com/blog/${article.id}`
        },
        "articleSection": article.category,
        "wordCount": parseInt(article.readTime) * 200 || 1000
    };
};

interface BreadcrumbItem {
    name: string;
    url: string;
}

const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
    if (!items || items.length === 0) return null;

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
};

// ============================================================
// FAQPage Schema Generator (P0-3: Critical for Rich Snippets)
// ============================================================

const generateFAQSchema = (faqData: FAQCategory[]) => {
    if (!faqData || faqData.length === 0) return null;

    // Flatten all FAQ items from all categories
    const allQuestions = faqData.flatMap(cat => cat.items);

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": allQuestions.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };
};

// ============================================================
// Convenience Components
// ============================================================

export const ProductStructuredData: React.FC<{ techId: TechType }> = ({ techId }) => {
    const tech = TECH_DETAILS[techId];
    return <StructuredData type="Product" data={tech} />;
};

export const OrganizationStructuredData: React.FC = () => {
    return <StructuredData type="Organization" />;
};

export const ArticleStructuredData: React.FC<{ article: ArticleData }> = ({ article }) => {
    return <StructuredData type="Article" data={article} />;
};

export const BreadcrumbStructuredData: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
    return <StructuredData type="BreadcrumbList" data={items} />;
};

// FAQPage Schema Component - Use on FAQ page for rich snippet eligibility
export const FAQStructuredData: React.FC<{ faqData: FAQCategory[] }> = ({ faqData }) => {
    return <StructuredData type="FAQPage" data={faqData} />;
};

// ============================================================
// Person Schema for E-E-A-T Compliance (P2-1 SEO Fix)
// ============================================================

export interface PersonData {
    name: string;
    role: string;
    bio: string;
    expertise?: string[];
    image?: string;
    sameAs?: string[]; // Social profiles, LinkedIn, etc.
}

/**
 * Generates Person schema for team members (E-E-A-T compliance)
 * Use on About page to establish authoritativeness and trust
 */
export const generatePersonSchema = (person: PersonData) => {
    if (!person) return null;

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": person.name,
        "jobTitle": person.role,
        "description": person.bio,
        "worksFor": {
            "@type": "Organization",
            "name": "Hylono"
        },
        "knowsAbout": person.expertise || [],
        "image": person.image,
        "sameAs": person.sameAs || []
    };
};

/**
 * Person Schema Component - Injects Person JSON-LD for team members
 * Important for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 */
export const PersonStructuredData: React.FC<{ person: PersonData }> = ({ person }) => {
    useEffect(() => {
        const existingScript = document.getElementById(`structured-data-person-${person.name.toLowerCase().replace(/\s+/g, '-')}`);
        if (existingScript) {
            existingScript.remove();
        }

        const schemaData = generatePersonSchema(person);
        if (!schemaData) return;

        const script = document.createElement('script');
        script.id = `structured-data-person-${person.name.toLowerCase().replace(/\s+/g, '-')}`;
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(schemaData);
        document.head.appendChild(script);

        return () => {
            const scriptToRemove = document.getElementById(`structured-data-person-${person.name.toLowerCase().replace(/\s+/g, '-')}`);
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, [person]);

    return null;
};

/**
 * Team Schema Component - Injects multiple Person schemas for the About page
 */
export const TeamStructuredData: React.FC<{ team: PersonData[] }> = ({ team }) => {
    useEffect(() => {
        // Remove existing team schemas
        const existingScripts = document.querySelectorAll('script[id^="structured-data-person-"]');
        existingScripts.forEach(script => script.remove());

        // Inject new schemas
        team.forEach(person => {
            const schemaData = generatePersonSchema(person);
            if (!schemaData) return;

            const script = document.createElement('script');
            script.id = `structured-data-person-${person.name.toLowerCase().replace(/\s+/g, '-')}`;
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify(schemaData);
            document.head.appendChild(script);
        });

        return () => {
            const scriptsToRemove = document.querySelectorAll('script[id^="structured-data-person-"]');
            scriptsToRemove.forEach(script => script.remove());
        };
    }, [team]);

    return null;
};
