# AGENTS.md

<!-- @ref=oscd-plugins:agent-guidelines -->

This document defines always-on baseline guidance for AI agents working in the OpenSCD plugins monorepo. Use the linked instruction files and package documentation for details that apply only to a specific task or scope.

## General

- This repository is a pnpm monorepo of Svelte plugins and shared packages for [OpenSCD](https://github.com/openscd/open-scd).
- Before GitHub, release, or repository-management work, run `git remote -v` and confirm the intended remote.
- "Plugin" means an OpenSCD plugin package under `packages/plugins/`. "Core package" means a package under `packages/core/`.
- Treat `pnpm-workspace.yaml` and each package's `package.json` as the source of truth for active packages and commands. Architecture documents explain intent but may describe an older package set.
- Before editing a package, inspect its local `package.json`, configuration, tests, and any package-level `AGENTS.md` if present.

## Core Rules

- Provide objective evaluation and challenge assumptions when repository evidence does not support them.
- Work only on the requested task and its directly related documentation or tests.
- Preserve existing behavior unless the requested change intentionally changes it; make behavior changes explicit.
- Prefer existing helpers, package patterns, and shared components over duplicated logic.
- Keep business logic independent from UI code where the package already separates `headless/` and `ui/`.
- Surface errors explicitly using the repository's existing error and notification patterns; do not hide failures behind broad catches or silent fallbacks.
- Never stage, commit, or push changes unless the user explicitly requests it. When work is complete, leave changes ready for human review.
- Create temporary or scratch files only under `.tmp/` at the repository root, and remove them when they are no longer needed.
- Treat documentation as part of implementation. If a change adds or alters project knowledge, update the relevant documentation in the same task.
- When no documentation update is needed, state why in the final handoff.

## Instruction Hierarchy

Load the scoped instruction that matches the task. Combine all applicable instructions when a task spans multiple areas.

- Coding conventions: [coding-conventions.instructions.md](.github/instructions/coding-conventions.instructions.md)
- Testing and quality: [testing-quality.instructions.md](.github/instructions/testing-quality.instructions.md)
- Documentation routing: [documentation.instructions.md](.github/instructions/documentation.instructions.md)
- Architecture and package boundaries: [architecture-boundaries.instructions.md](.github/instructions/architecture-boundaries.instructions.md)
- Communication: [communication.instructions.md](.github/instructions/communication.instructions.md)
- Terminal command safety: [terminal-command-safety.instructions.md](.github/instructions/terminal-command-safety.instructions.md)
- Instruction registration: [instruction-registration.instructions.md](.github/instructions/instruction-registration.instructions.md)
- PR review and creation: [pr-review-creation.instructions.md](.github/instructions/pr-review-creation.instructions.md)
- TypeScript tests: [vitest-test.instructions.md](.github/instructions/vitest-test.instructions.md), followed by the [`vitest-test` skill](.github/skills/vitest-test/SKILL.md)

## Task Routing

- Feature or bug fix in `packages/**`: coding conventions + testing and quality; add documentation routing when behavior or project knowledge changes.
- Test-only changes: testing and quality + the scoped Vitest instruction and skill.
- Refactoring or dependency changes: coding conventions + architecture and package boundaries + testing and quality.
- Documentation, ADR, or process changes: documentation routing; add architecture guidance for design decisions.
- PR preparation or review: PR review and creation + communication.
- Instruction file changes: instruction registration + communication.

- Code structure and imports also follow [barrel-pattern.md](doc/guidelines/barrel-pattern.md) and [code_style.md](doc/guidelines/code_style.md).
- Setup and dependencies follow [setup.md](doc/how-to/setup.md); build shared dependencies before plugin work.
- Architecture or release decisions require reading the relevant documents in [doc/adr/](doc/adr/) and [doc/references/architecture/](doc/references/architecture/).
- If a package-level `AGENTS.md` is added, link it from this file and apply it to that package's subtree.

## Repository Structure

The workspace dependency direction is generally:

```text
packages/plugins/*
        |
core-ui-svelte, core-api, core-standard, core/legacy, ui, uilib
```

- `packages/core/api/` - shared plugin API types and mocks, including `pluginV1` and `mocksV1`.
- `packages/core/legacy/` - legacy SCD business logic, queries, actions, events, and browser-based tests.
- `packages/core/standard/` - IEC 61850 standard types and generated definitions.
- `packages/core/ui-svelte/` - shared Svelte 5 UI components and themes.
- `packages/ui/` - additional UI components and the newer UI package.
- `packages/uilib/` - legacy Svelte UI/plugin library.
- `packages/plugins/` - standalone plugin applications such as `network-explorer`, `communication-explorer`, `auto-doc`, `io-center`, `documentation`, `diffing-tool`, `type-designer`, `type-distributor`, and `type-switcher`.
- `packages/create-plugin/` - plugin scaffolding and its template.
- `doc/` - repository-wide architecture, ADRs, guidelines, references, and how-to documentation.

Each plugin normally has:

```text
src/
  plugin.ts          # exports the custom-element class; does not self-register it
  plugin.svelte      # root Svelte custom element
  plugin.dev.ts      # standalone development entry, when provided
  headless/          # business logic without UI dependencies, when provided
  ui/                # Svelte UI components, when provided
  stores/            # Svelte stores, when provided
```

## OpenSCD Plugin Contract

- A plugin entry point must default-export an HTML custom-element class and must not register the element itself.
- Root plugin components use Svelte 5 `$props()` and type their reflected OpenSCD props with `Plugin.CustomComponentsProps` from `@oscd-plugins/core-api/plugin/v1`.
- Preserve the reflected plugin props (`doc`, `docName`, `editCount`, `locale`, `pluginType`, and `isCustomInstance`) when changing a root `plugin.svelte`.
- Root components should wire the shared initialization actions from `@oscd-plugins/core-ui-svelte` and expose package name/version through the plugin data attributes.
- Use the existing theme, document-template, and plugin-initialization helpers rather than recreating them in individual plugins.

## Code Conventions

- Use Biome for formatting, import organization, and linting. Do not use Prettier or introduce another formatter.
- Use tabs, single quotes, no semicolons, and no trailing commas, matching `biome.json`.
- Use `kebab-case` for files and directories. Non-index files follow the domain-qualified pattern `name-of-file.name-of-folder.ts`; type declarations use `.d.ts`.
- Organize code by domain first and functionality second.
- A folder containing `index.ts` is a module. Files inside a module must not import from their own `index.ts`; consumers outside the module should import from the module's public `index.ts`.
- A module may re-export from direct submodules only, not from deeper implementation files.
- Use the `@/` path alias where the package provides it, and preserve existing import style when it does not.
- Keep generated files and standard definitions consistent with their generator. Change generator inputs or scripts rather than hand-editing generated output.
- Maintain strict TypeScript types. Prefer type guards and existing interfaces over `any`, unnecessary casts, or unchecked assertions.

## Dependencies, Builds, and Validation

- Install and build shared local dependencies before plugin work:

  ```bash
  pnpm dependencies:install+build
  ```

- Run commands from the owning package directory or use `pnpm --filter <package>`; do not assume a root test command exists.
- Use the smallest relevant package command:

  ```bash
  pnpm --filter <package> check
  pnpm --filter <package> types
  pnpm --filter <package> test
  ```

  Confirm the script exists in that package's `package.json` before running it.
- For repository-wide formatting and linting:

  ```bash
  pnpm biome:check
  pnpm biome:fix
  ```

- Core legacy tests run in a Chrome/Chromium browser. Install Chromium as described in [setup.md](doc/how-to/setup.md) when that test suite requires it.
- `make <plugin-name>` starts a plugin build/watch target; `make start-scd` starts the local OpenSCD integration when the sibling OpenSCD repository is available.
- For `*.spec.ts` changes, follow the scoped Vitest instruction and validate the affected package tests. For user-visible flows, use the package's configured browser or Playwright tests when available.

## Documentation and Release

- Write documentation in English and place repository-wide documentation under `doc/`; plugin-specific documentation belongs under the relevant plugin's `doc/` or `docs/` directory.
- Use Diataxis categories and the existing documentation style. Add an ADR when a change establishes or reverses an architectural or release decision.
- Update package changelogs and versions only when the user explicitly requests release preparation.
- Source code and built plugin output have separate release concerns; read [0003-release-process.md](doc/adr/0003-release-process.md) before changing release or publication workflows.

## Handoff

After completing the requested task, stop and hand off the result. Do not begin a follow-up task without explicit instruction. Offer these available next steps:

1. **Lint + Format** - run Biome for the files or packages touched.
2. **Run Tests** - execute the affected package tests and report results.
3. **Run Checks** - execute package type-checking or Svelte checks.
4. **Manual Test** - run the relevant plugin against a local OpenSCD instance.
5. **Review Code** - list issues only; make no fixes.
6. **Review Code + Fix** - list and fix the relevant issues.
7. **Document Architecture** - assess whether an ADR is warranted and draft one only if necessary.
8. **Release** - update the relevant changelog and package versions.
9. **Create Pull Request** - prepare a PR description and ask permission before posting it.
