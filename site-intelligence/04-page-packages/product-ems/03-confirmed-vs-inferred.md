# Confirmed vs Inferred

## CONFIRMED
- Template class: productSecondary
- Visibility: public
- Indexability: indexable
- Source files: app/product/[tech]/page.tsx, app/product/[tech]/ProductClient.tsx, components/TechDetail.tsx

## STRONGLY INFERRED
- The route is not safe to treat as an indexable public page in its current form.
- The local runtime shows a title/body mismatch that collapses multiple secondary modalities into HBOT.
- The route is not properly supported by the canonical topical graph.

## WEAKLY INFERRED
- Conversion and search performance still require runtime and analytics data.

## RUNTIME VERIFICATION REQUIRED
- Check mobile and desktop behavior.
- Verify the route performs the role described in the package.
- Validate auth / noindex / redirect behavior where applicable.

## EXTERNAL VALIDATION REQUIRED
- None.

## UNVERIFIED
- Traffic, conversion, search demand, and revenue impact are not available in the repo.
