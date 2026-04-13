# Confirmed vs Inferred

## CONFIRMED
- Template class: pressRisk
- Visibility: public
- Indexability: indexable
- Source files: app/press/page.tsx, app/press/PressClient.tsx, components/PressHubPage.tsx

## STRONGLY INFERRED
- The route publishes unverified media coverage and fundraising-style claims.
- That makes the route a serious trust risk.
- The correct state is a verified press utility page or a temporary noindex fallback.

## WEAKLY INFERRED
- Conversion and search performance still require runtime and analytics data.

## RUNTIME VERIFICATION REQUIRED
- Check mobile and desktop behavior.
- Verify the route performs the role described in the package.
- Validate auth / noindex / redirect behavior where applicable.

## EXTERNAL VALIDATION REQUIRED
- Verify every press fact externally before leaving the route public.

## UNVERIFIED
- Traffic, conversion, search demand, and revenue impact are not available in the repo.
