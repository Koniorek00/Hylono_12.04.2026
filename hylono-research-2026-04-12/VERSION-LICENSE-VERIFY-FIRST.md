# Version and License Verify First

## Purpose
Use this file before implementation starts on any service. The research pack is a high-quality starting point, but version drift and license changes must be rechecked immediately before deployment.

## Mandatory Pre-Implementation Checks
For every app or infrastructure component, verify:
1. current stable version
2. installation path still recommended by official docs
3. container image still maintained and official
4. license still acceptable for intended use
5. self-hosting terms still acceptable
6. upgrade path documented
7. backup strategy compatible with the chosen storage approach
8. auth and secret model compatible with Hylono policies

## License Review Flags
Escalate for human review if any app is:
- AGPL or GPL and will be modified or tightly embedded into proprietary workflows
- source-available or fair-code rather than OSI open source
- dual-licensed with important enterprise-only features
- unclear about hosted vs self-hosted feature parity
- unclear about redistribution rights for bundled configs or templates

## Version Review Rules
When version information conflicts:
1. official release notes or official docs win
2. official GitHub releases come next
3. maintained image registry tags come next
4. community guides are advisory only

## Asset Review Rules
Before reusing a blueprint, example, or starter repo:
- check the last meaningful update date
- check the LICENSE file
- inspect open issues for breakage on the target version
- confirm that environment variables still match current docs
- confirm that reverse proxy assumptions still match Hylono infrastructure

## Output Required From Codex
Before coding starts, Codex should create a `verification snapshot` containing:
- app name
- version selected
- official source checked
- license status
- deployment method selected
- unresolved risks
- go or no-go recommendation

## Red Flags That Trigger No-Go Until Resolved
- no official upgrade documentation
- unclear persistence location
- license changed after the research date
- repo archived or abandoned with no viable maintained fork
- self-hosting docs older than the runtime stack they depend on
- auth model incompatible with intended user flows
