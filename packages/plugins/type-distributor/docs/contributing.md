# Contributing to type-distributor

This guide describes the day-to-day workflow for contributing to `packages/plugins/type-distributor`.

It focuses on the commands and conventions that are visible in this repository today: install, lint, format, test, changelog updates, branch naming, and the AI-related assets that support work on this plugin.

## Getting started

Before working on `type-distributor`, install and build the shared dependencies used by plugin packages from the repository root:

```bash
pnpm dependencies:install+build
```

Then change into the plugin root:

```bash
cd packages/plugins/type-distributor
```

From there, use the local package commands:

```bash
pnpm install
pnpm dev
pnpm integrated
```

- `pnpm dev` starts a standalone development server with a mock SCD document at 
```
http://localhost:4127/src/plugin.js
```
- `pnpm integrated` builds the plugin in watch mode and serves it via the preview server
```
http://localhost:41127/index.js
```
- paste this URL into OpenSCD as the plugin source

## Linting and formatting

`type-distributor` uses **Biome** for linting and formatting.

- do not use Prettier
- keep imports organized through the existing Biome setup
- prefer the existing package scripts over ad-hoc commands

Useful commands:

```bash
pnpm biome:check
pnpm biome:check:write
pnpm biome:format:write
pnpm biome:lint:write
```

## Type checks and tests

Run checks for the package you changed. For `type-distributor`, the main commands are:

```bash
pnpm check
pnpm test
pnpm test:ui
pnpm test:ui:open
```

Use `check` for Svelte and TypeScript validation.

Use `test` for the standard Vitest run.

Use `test:ui` or `test:ui:open` when the interactive Vitest UI is helpful while iterating.

If your change also touches shared packages like `core-api`, `core-ui-svelte`, or `core`, run the relevant checks there too because `type-distributor` depends on them.

## Branch naming

There is no formal branch naming document in the repository, so treat this as the recommended convention for `type-distributor` work.

Use:

```text
feat/dist/<short-topic>
fix/dist/<short-topic>
docs/dist/<short-topic>
refactor/dist/<short-topic>
```

Examples:

```text
feat/dist/bay-type-validation
fix/dist/manual-match-dialog
docs/dist/contributing-guide
```

Keep the topic short, specific, and focused on one change.

## Changelog updates

If your change is user-visible or important for downstream maintainers, update:

```text
packages/plugins/type-distributor/CHANGELOG.md
```

Follow the style already used in that file:

- Keep a Changelog headings such as `Added`, `Changed`, and `Fixed`
- concise, user-facing wording
- match the existing structure instead of inventing a new one

The PR template also expects changelog updates when they apply.

## AI-assisted work

This repository already contains AI-related guidance that is useful when working on `type-distributor`.

Useful files:

- `.github/copilot-instructions.md` for project structure, commands, and conventions
- `.github/prompts/critical-branch-review.prompt.md` for critical review of a branch
- `.github/agents/vitest.agent.md` for Vitest-oriented testing guidance
- `.github/skills/vitest-test/SKILL.md` for expectations when editing `*.spec.ts`

This one needs to be optimised:
- `.github/prompts/pre-review.prompt.md` for pre-review analysis

Use AI output as a draft, not as the source of truth.
