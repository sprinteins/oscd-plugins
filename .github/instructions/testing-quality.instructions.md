---
name: Testing and Quality
description: Use when adding or changing implementation or tests; applies package-level validation and unit/component test scope.
applyTo: 'packages/**/src/**/*.{ts,js,svelte}'
---

<!-- @ref=oscd-plugins:testing-quality -->

# Testing and Quality

## Test scope

- Put business-logic and component behavior tests in the owning package.
- Keep tests next to the implementation and use the package's existing fixtures and mocks.
- Test observable behavior through public interfaces. Avoid tests coupled to private helpers or implementation details.
- Prefer realistic SCD/XML fixtures and integration-oriented tests when the runtime is practical; avoid unnecessary mocks.
- `core/legacy` tests use Chrome/Chromium browser mode. Plugin and UI tests generally use the environment declared by their package configuration, commonly `jsdom`.
- For `*.spec.ts`, follow [vitest-test.instructions.md](vitest-test.instructions.md) and load the [`vitest-test` skill](../skills/vitest-test/SKILL.md) before editing.

## Validation workflow

1. Identify the owning package and read its `package.json` scripts.
2. Run the smallest focused check available, such as `check`, `types`, `test`, or a single Vitest file.
3. Run the affected package build when public output, generated definitions, or package boundaries changed.
4. Run `pnpm biome:check` for source changes when practical.
5. Report unrelated pre-existing failures separately; do not broaden the fix to them.

There is no root-level test command. Use `pnpm --filter <package> <script>` or run from the package directory.
