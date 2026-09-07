# Type Designer – Test Setup and Strategy

## Purpose

This document describes the automated test setup introduced for the Type Designer plugin. It is intended as a maintenance reference for contributors and reviewers: it explains which test levels exist, which behaviour is covered, how tests are executed, and which parts run in CI.

## Test concept

The test strategy uses three complementary levels:

| Level | Tool | Focus | Execution |
| --- | --- | --- | --- |
| Unit tests | Vitest with jsdom | Isolated helper and store behaviour | Local and CI |
| Integration tests | Vitest with jsdom | Collaboration of stores, helper functions, XML elements and edit actions | Local and CI |
| End-to-end smoke tests | Playwright / Chromium | Plugin mount in the development harness and visible Bay Type filtering | Local |

The tests prioritise operations with a high risk of invalid or inconsistent SCL/XML state: type and reference creation/deletion, drag-and-drop reference creation, import processing, UUID remapping and name-conflict handling. Table-driven test cases are used where one rule applies to several type or reference families.

## Tooling and configuration

The test dependencies are declared in `package.json`:

- `vitest` is the unit and integration test runner.
- `jsdom` provides the browser-like DOM environment required by Svelte and XML-related tests.
- `@testing-library/svelte` and `@testing-library/jest-dom` provide DOM assertions and cleanup support.
- `@vitest/coverage-v8` collects V8 coverage data.
- `@playwright/test` runs browser-based smoke tests in Chromium.

`vitest.config.ts` configures the Svelte plugin, the `@` alias for `src`, the jsdom environment and `src/test/setup.ts`. The setup file imports `jest-dom` matchers and runs Testing Library cleanup after every test.

Coverage is deliberately limited to `src/headless/**/*.ts`, since the initial automated tests target the plugin's headless business logic. Declarations, plugin entry points and test files are excluded. Reports are written to `coverage/` in text, HTML and JSON-summary format.

`playwright.config.ts` uses the `e2e/` directory, Chromium Desktop Chrome, a development server on port `4175`, a 60-second test timeout, a five-second assertion timeout, traces on the first retry, and screenshots/videos on failure. In CI, Playwright would use one worker and up to two retries; at present, the workflow does not invoke the `e2e` script.

## Test coverage

### Unit tests

The unit tests cover the following behaviour:

- Filtering type elements by empty, exact, partial, case-insensitive and non-matching search terms without mutating the source collection.
- Determining terminal options for conducting equipment, including known one- and two-terminal types, unknown types and missing type attributes.
- Computing unique names and occurrences for created, copied and imported types.
- Creating and deleting references, including required attributes, LNode instance numbering, event dispatching and error cases for missing XML document or host.
- Maintaining drag-and-drop state and selecting the correct reference family for supported drop targets.
- Updating imported UUIDs, preserving `originUuid`, and updating `templateUuid` references.
- Renaming imported elements if their names conflict with existing types.

External stores, UUID generation and OpenSCD/core APIs are mocked in unit tests. This keeps tests deterministic and allows each helper's decisions and interactions to be asserted independently.

### Integration tests

Integration tests use real DOM/XML elements while mocking system boundaries such as OpenSCD core APIs and global stores. They cover complete workflows rather than individual helper decisions:

- Importing an element creates the corresponding import action, assigns a new UUID and retains the original UUID in the configured namespace.
- Duplicate imports do not create duplicate actions; equivalent local and imported elements create no action; changed equivalents create replacement actions.
- Creating a function type, creating a `FunctionRef`, and deleting the type removes both the type and its associated reference.
- The type-elements store maps type families into UI columns, includes imported elements, applies filters and exposes CRUD/naming helper functions.

### End-to-end smoke tests

The Playwright smoke tests verify that the development harness mounts the plugin and displays the Bay Types, Equipment Types, Function Types and LN Types sections. They also verify that the visible Bay Type search input filters `Bay_2` when `Bay_1` is entered and restores it after clearing the input.

## Running tests locally

Run the commands from the repository root after installing workspace dependencies:

```bash
pnpm run type-designer:install

# Watch mode for unit and integration tests
pnpm -C ./packages/plugins/type-designer run test

# Single execution for unit and integration tests
pnpm -C ./packages/plugins/type-designer run test:run

# Unit/integration tests with V8 coverage report
pnpm -C ./packages/plugins/type-designer run test:coverage

# Playwright end-to-end smoke tests
pnpm -C ./packages/plugins/type-designer run e2e
```

For interactive browser-test development, use:

```bash
pnpm -C ./packages/plugins/type-designer run e2e:ui
```

After running Playwright, the HTML report can be opened with:

```bash
pnpm -C ./packages/plugins/type-designer run e2e:report
```

Generated coverage reports, Playwright reports and test results are ignored by Git.

## CI integration

`.github/workflows/plugin_type-designer.yml` now defines a `test` job between version checking and building. If changes affect the Type Designer plugin or its workflow file, GitHub Actions:

1. Checks out the repository.
2. Installs pnpm and Node.js 24.
3. Installs the Type Designer dependencies.
4. Runs `test:run` for unit and integration tests.
5. Generates V8 coverage with `test:coverage`.
6. Uploads `packages/plugins/type-designer/coverage/` as the `type-designer-coverage` artifact for 30 days.

The build job requires successful completion of this test job. The current CI workflow does not run Playwright E2E tests or upload Playwright artifacts.

## Maintenance rules

- Add or adapt tests whenever behaviour in `src/headless/` changes, especially where SCL/XML structure, references, UUIDs or naming rules are modified.
- Keep test names behaviour-oriented: describe the observable rule or workflow rather than implementation details.
- Use table-driven tests for family-dependent rules to make supported combinations explicit.
- Keep mocks at external boundaries. Use real DOM/XML elements when testing transformations or lifecycle behaviour.
- Add active E2E coverage only for stable, user-visible paths. Enable the commented creation test only after its selectors and expected persisted state are reliable.
- If E2E tests become part of CI, install the required Playwright browser in the workflow, execute `e2e`, and upload `playwright-report/` and `test-results/` on failure.

## Current limitations

The initial suite focuses on headless logic and two UI smoke scenarios. It does not yet establish a coverage threshold, execute E2E tests in CI, or comprehensively cover every Svelte component and all import/export scenarios. These boundaries are intentional starting points and should be reviewed as the plugin evolves.
