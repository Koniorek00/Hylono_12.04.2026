# Local Environment Notes

Project: Hylono_MAIN - SEO BOOST
Family: seo-site

## Default Operator Shortcut

- Start with `Use $universal-project-codex. <task>`.
- Use `Use $select-applicable-skills. <task>` when the task needs a more precise specialist-skill mix.
- Use `Use $split-task-cli. <task>` only for explicit multi-agent fan-out.

## Codex-Native Layer

- Repo MCP config now lives in `.codex/config.toml`.
- Repo-local Codex skills live in `.agents/skills/`.
- Legacy `.agent/skills/` remains in the repo for compatibility with older agent tooling; keep both trees aligned when updating skill content.
- Use `scripts/sync-codex-skills.ps1` after changing legacy skill content to refresh the Codex-native mirror.

## Preferred Skills

- Use repo-local skills first for Hylono-specific work:
  - `project-conventions`
  - `seo-medtech-playbook`
  - `hylono-compliance-framework`
  - `playwright-e2e-patterns`
  - `website-audit-framework`
- Use global skills for connected systems:
  - `linear`
  - `notion-research-documentation`
  - `notion-spec-to-implementation`
  - `sentry`
  - `figma`, `figma-use`, `figma-generate-design`, `figma-code-connect-components`

## Connected Tools

- GitHub plugin is the default path for PR review, issue triage, CI debugging, and publish flows.
- NotebookLM is the preferred evidence synthesis layer for claim-sensitive research once a Hylono notebook is available.
- Similarweb is the preferred competitor and demand signal source for SEO prioritization.
- Figma MCP is the preferred design-to-code path when a Figma URL or node id is provided.

## Suggested Setup Checks

- `pnpm install`
- `pnpm build`
- `pnpm check`
- `pnpm test`
- `pnpm compliance:strict` for health-adjacent or benefit-oriented copy changes

## Notes

- Keep public-route, metadata, schema, sitemap, and redirect changes coordinated.
- Treat SEO governance docs as mandatory when touching public pages.
- Review-first workflows should prefer findings on SEO, evidence, compliance, and routing before style or cleanup notes.
- Workflow entry points live under `workflows/` for GitHub review, Linear triage, NotebookLM evidence packs, Similarweb snapshots, and Figma handoff runs.
