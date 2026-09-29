---
name: Coding Conventions
description: Use when editing source code in packages; applies the repository's TypeScript, Svelte, naming, import, and formatting conventions.
applyTo: 'packages/**/*.{ts,js,svelte,css}'
---

<!-- @ref=oscd-plugins:coding-conventions -->

# Coding Conventions

- Use Biome for formatting and import organization. Do not use Prettier or introduce another formatter.
- Use tabs, single quotes, no semicolons, and no trailing commas, matching `biome.json`.
- Use `kebab-case` for files and directories. Non-index files follow `name-of-file.name-of-folder.ts`; type declarations use `.d.ts`.
- Organize code by domain first and functionality second. Keep tests next to the implementation.
- Follow the barrel pattern in [barrel-pattern.md](../../doc/guidelines/barrel-pattern.md): folders with `index.ts` expose their public API; internal files do not import their own barrel.
- Prefer the package's `@/` alias where it exists and preserve established import style otherwise.
- Keep headless business logic free of UI dependencies. Keep Svelte components focused on presentation and local interaction.
- Preserve strict TypeScript types. Prefer existing interfaces, guards, and helpers over `any` or unchecked assertions.
- Keep Svelte 5 component structure and OpenSCD plugin props consistent with neighboring files. Do not introduce speculative abstractions or unrelated refactors.
