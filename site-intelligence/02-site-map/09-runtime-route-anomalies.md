# Runtime Route Anomalies

## /product/ewot
- Status: 200
- Title: EWOT | Pricing, Rental Plans, Specs and Evidence | Hylono
- H1: HBOT

## /product/ems
- Status: 200
- Title: EMS Suit | Pricing, Rental Plans, Specs and Evidence | Hylono
- H1: HBOT

## /product/vns
- Status: 200
- Title: VNS Device | Pricing, Rental Plans, Specs and Evidence | Hylono
- H1: HBOT

## /guarantee
- Status: 308
- Title: n/a
- H1: n/a
- Redirect target: /returns

## /support
- Status: 308
- Title: n/a
- H1: n/a
- Redirect target: /help

## Crawl-surface note
- Local requests to `/robots.txt` and `/sitemap.xml` surfaced a compile error tied to `components/TechDetail.tsx` importing a missing `components/product/detail/TechHero.tsx`.