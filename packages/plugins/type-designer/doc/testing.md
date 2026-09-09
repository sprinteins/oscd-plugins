# Type Designer – Testing

## Concept

The Type Designer uses automated tests at different levels to detect regressions early and keep changes to the plugin reliable and maintainable.

The test strategy follows three complementary levels:

| Level | Purpose |
| --- | --- |
| Unit tests | Verify isolated functions, helpers and stores independently. |
| Integration tests | Verify that multiple Type Designer modules and XML-related operations work together correctly. |
| End-to-end tests | Verify stable, user-visible workflows in a real browser environment. |

Tests should focus primarily on behaviour where regressions can affect the consistency of SCL/XML data or important plugin workflows. The goal is not to test every implementation detail, but to cover relevant behaviour at the lowest suitable test level.

### Test design principles

- Keep tests independent and reproducible.
- Prefer behaviour-oriented assertions over implementation details.
- Structure Vitest test names using the `GIVEN ... WHEN ... THEN ...` convention.
- Use table-driven tests when the same behaviour applies to multiple inputs or type families.
- Mock external boundaries where necessary, while using real DOM/XML elements for transformations and lifecycle behaviour where practical.
- Add end-to-end tests for stable workflows that benefit from verification in a real browser.
- Treat code coverage as an indicator for untested areas rather than as a measure of test quality on its own.

## Usage

### Tooling

The Type Designer test setup uses:

- `vitest` for unit and integration tests.
- `jsdom` as the DOM environment for Vitest.
- `@testing-library/svelte` and `@testing-library/jest-dom` for component and DOM testing.
- `@vitest/coverage-v8` for code coverage.
- `@playwright/test` for browser-based end-to-end tests.

The main configuration files are:

- `vitest.config.ts`
- `playwright.config.ts`
- `src/test/setup.ts`

Refer to these files for environment-specific configuration.

### Test file conventions

Vitest unit tests use the `*.spec.ts` suffix and are located next to the implementation under test.

Integration tests use the `*.integration.spec.ts` suffix.

Playwright tests are located in the `e2e/` directory.

### Coverage

V8 coverage is configured in `vitest.config.ts`. The current configuration focuses coverage reporting on the Type Designer headless logic.

Coverage reports can be generated with `test:coverage` and are written to the configured coverage directory.

### CI

The Type Designer GitHub Actions workflow runs the Vitest test suite before the build and generates a coverage report.

The workflow configuration is located in:

```text
.github/workflows/plugin_type-designer.yml
```

Playwright end-to-end tests are currently intended for local execution and are not part of the Type Designer CI workflow.
