# Skill Registry — std-official

> Auto-generated index. `SKILL.md` is the source of truth. Do not edit by hand.

## Registry Contract

- Orchestrators select matching rows and pass `path` to sub-agents before work begins.
- Sub-agents read the exact `SKILL.md` file at `path` — never rely on this summary alone.
- Skip `sdd-*`, `_shared`, and `skill-registry` from delegation; they are loaded by the orchestrator.
- Deduplication: project-level skills override user-level skills with the same name.

## Skills

| Name | Trigger / Description | Scope | Path |
|------|----------------------|-------|------|
| branch-pr | Create Gentle AI pull requests with issue-first checks. Trigger: creating, opening, or preparing PRs for review. | user | `C:\Users\Wilfr\.config\opencode\skills\branch-pr\SKILL.md` |
| chained-pr | Trigger: PRs over 400 lines, stacked PRs, review slices. Split oversized changes into chained PRs that protect review focus. | user | `C:\Users\Wilfr\.config\opencode\skills\chained-pr\SKILL.md` |
| cognitive-doc-design | Design docs that reduce cognitive load. Trigger: writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs. | user | `C:\Users\Wilfr\.config\opencode\skills\cognitive-doc-design\SKILL.md` |
| comment-writer | Write warm, direct collaboration comments. Trigger: PR feedback, issue replies, reviews, Slack messages, or GitHub comments. | user | `C:\Users\Wilfr\.config\opencode\skills\comment-writer\SKILL.md` |
| go-testing | Trigger: Go tests, go test coverage, Bubbletea teatest, golden files. Apply focused Go testing patterns. | user | `C:\Users\Wilfr\.config\opencode\skills\go-testing\SKILL.md` |
| issue-creation | Create Gentle AI issues with issue-first checks. Trigger: creating GitHub issues, bug reports, or feature requests. | user | `C:\Users\Wilfr\.config\opencode\skills\issue-creation\SKILL.md` |
| judgment-day | Trigger: judgment day, dual review, adversarial review, juzgar. Run blind dual review, fix confirmed issues, then re-judge. | user | `C:\Users\Wilfr\.config\opencode\skills\judgment-day\SKILL.md` |
| nextjs-15 | Next.js 15 App Router patterns. Trigger: When working with Next.js - routing, Server Actions, data fetching. | user | `C:\Users\Wilfr\.config\opencode\skills\nextjs-15\SKILL.md` |
| playwright | Playwright E2E testing patterns. Trigger: When writing E2E tests - Page Objects, selectors, MCP workflow. | user | `C:\Users\Wilfr\.config\opencode\skills\playwright\SKILL.md` |
| react-19 | React 19 patterns with React Compiler. Trigger: When writing React components - no useMemo/useCallback needed. | user | `C:\Users\Wilfr\.config\opencode\skills\react-19\SKILL.md` |
| skill-creator | Trigger: new skills, agent instructions, documenting AI usage patterns. Create LLM-first skills with valid frontmatter. | user | `C:\Users\Wilfr\.config\opencode\skills\skill-creator\SKILL.md` |
| skill-improver | Trigger: improve skills, audit skills, refactor skills, skill quality. Audit and upgrade existing LLM-first skills. | user | `C:\Users\Wilfr\.config\opencode\skills\skill-improver\SKILL.md` |
| typescript | TypeScript strict patterns and best practices. Trigger: When writing TypeScript code - types, interfaces, generics. | user | `C:\Users\Wilfr\.config\opencode\skills\typescript\SKILL.md` |
| work-unit-commits | Plan commits as reviewable work units. Trigger: implementation, commit splitting, chained PRs, or keeping tests and docs with code. | user | `C:\Users\Wilfr\.config\opencode\skills\work-unit-commits\SKILL.md` |

## Excluded (loaded by orchestrator)

- `_shared` — shared SDD references
- `skill-registry` — this index
- `sdd-*` — all SDD phase skills (init, explore, propose, spec, design, tasks, apply, verify, archive, onboard)
