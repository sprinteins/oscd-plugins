# Copilot Instructions

## Project Overview

pnpm monorepo of [OpenSCD](https://github.com/openscd/open-scd) plugins for editing IEC 61850 Substation Configuration Description (SCD) files. Plugins are Svelte 5 custom elements dynamically loaded by OpenSCD at runtime. The public GitHub repo stores built artifacts alongside source; development is mirrored from an internal Gitea instance.

## Commands

```bash
# Install and build all core dependencies first (required before working on plugins)
pnpm dependencies:install+build

# Lint check / auto-fix
pnpm biome:check
pnpm biome:fix          # or: make fix

# Start a plugin in build:watch mode (for integrated dev against local OpenSCD)
make network-explorer   # replace with any plugin name

# Start local OpenSCD instance (requires sibling ../openscd/ repo)
make start-scd

# Run tests for a specific package
pnpm --filter @oscd-plugins/core test
pnpm --filter @oscd-plugins/core test:watch

# Run a single test file (inside a package directory)
pnpm test:watch -- src/path/to/feature.spec.ts

# Start core (legacy) tests in watch mode
make core

# Run core-api tests
pnpm --filter @oscd-plugins/core-api test
```

> **Note:** There is no root-level test command. Tests are always run per-package.  
> **Note:** `core/legacy` tests require Chrome/Chromium (`brew install chromium`). They run in browser mode, not jsdom.

## Architecture

### Package Dependency Flow

```
plugins/* → core-ui-svelte, core-api, core-standard, core (legacy), ui
```

Core packages must be built before plugins. Always run `pnpm dependencies:install+build` first.

### Key Packages

| Package | Path | Purpose |
|---|---|---|
| `@oscd-plugins/core-api` | `packages/core/api/` | Shared plugin API types/interfaces; exports `pluginV1` and `mocksV1` namespaces |
| `@oscd-plugins/core` | `packages/core/legacy/` | Business logic for SCD file manipulation (`scd-queries/`, `scd-actions/`, `scd-events/`) |
| `@oscd-plugins/core-standard` | `packages/core/standard/` | IEC 61850 standard type definitions (some auto-generated) |
| `@oscd-plugins/core-ui-svelte` | `packages/core/ui-svelte/` | Shared Svelte 5 UI component library (shadcn-style) |
| `@oscd-plugins/ui` | `packages/ui/` | Additional UI component library |
| `packages/plugins/*` | `packages/plugins/` | 9 standalone plugin apps (auto-doc, communication-explorer, diffing-tool, documentation, io-center, network-explorer, type-designer, type-distributor, type-switcher) |

### Plugin Structure

Every plugin exports an OpenSCD custom element:

```ts
// plugin.ts — entry point
import Plugin from './plugin.svelte'
import type { Component } from 'svelte'
export default (Plugin as Component).element
```

`plugin.svelte` always uses `<svelte:options customElement={{ props: { ... } }}>` with these reflected props (the OpenSCD plugin contract):

```svelte
<svelte:options
  customElement={{
    props: {
      doc: { reflect: true, type: "Object" },
      docName: { reflect: true, type: "String" },
      editCount: { reflect: true, type: "Number" },
      locale: { reflect: true, type: "String" },
      pluginType: { reflect: true, type: "String" },
      isCustomInstance: { reflect: true, type: "Boolean" },
    },
  }}
/>
```

Props are typed via `Plugin.CustomComponentsProps` from `@oscd-plugins/core-api/plugin/v1` and destructured using Svelte 5 `$props()`. The `<main>` element uses `use:initPlugin` and `use:initScdTemplate` or `use:initSsdTemplate` actions from `@oscd-plugins/core-ui-svelte`, and carries `data-plugin-name` / `data-plugin-version` attributes from `package.json`.

Each plugin's internal structure:
```
src/
  plugin.ts          # Entry: exports web component element (cannot self-register)
  plugin.svelte      # Root component with <svelte:options customElement=...>
  plugin.dev.ts      # Standalone dev entry
  headless/          # Business logic (no UI dependencies) — testable in isolation
  ui/                # Svelte UI components
  stores/            # Svelte stores
```

The `integrated` script (`pnpm integrated` in a plugin) runs `build:watch` + `preview` concurrently to serve the built JS to a running OpenSCD instance on port 8080.

## Key Conventions

### File Naming (kebab-case + double-dot)

All files and directories use **kebab-case**. Non-index files follow the pattern `name-of-file.name-of-folder.ts`:
- `queries.data-type-templates.ts`
- `service.ied.ts`
- `types.data-type-templates.d.ts` — type declarations always use `.d.ts`
- `feature.spec.ts` — test files colocated with source (not in `__tests__/`)

### Barrel Pattern (strictly enforced)

Documented in `doc/guidelines/barrel-pattern.md`:
- Every folder with an `index.ts` is a **module** — `index.ts` is its sole public API
- Files **within** a module must NOT import from their own `index.ts`
- Files **outside** a module must ALWAYS import from the module's `index.ts`
- A module may only re-export from its **direct** sub-modules (not deeper levels)
- Folders without `index.ts` are not modules — consumers may import files directly

### Domain-Driven Structure

Code is organized by domain first, then by functionality:
```
src/
  domain1/
    featureA/
    featureB/
  domain2/
    featureC/
```

### Path Aliases

All packages use `@/*` → `src/*`. Use `@/` for internal imports instead of relative paths where available.

### TypeScript

- `strict: true`, `ESNext` target/module, `moduleResolution: "bundler"`
- Library packages (core) built with `tsup`; plugins built with `vite`
- Plugins extend `@tsconfig/svelte/tsconfig.json` and split into `tsconfig.json` (app) + `tsconfig.node.json` (vite config)

### Linting / Formatting

**Biome only** (no Prettier, no ESLint). Key style rules:
- Tabs for indentation, indent width 4
- Single quotes, no semicolons, no trailing commas
- Organize imports: enabled
- Do not run Prettier — it is explicitly banned

Husky runs Biome on pre-commit.

### Testing

- Framework: **Vitest** with colocated `*.spec.ts` files
- Plugin/UI tests: `environment: 'jsdom'`
- `core/legacy` tests: Chrome browser mode (requires Chromium installed) — `vitest.config.ts` sets `browser: { enabled: true, name: 'chrome' }`
- Test fixtures/SCD XML files live in `tests/` or `testfiles/` directories within a package
- Import from `'vitest'`: `describe, it, expect, vi, beforeEach`
