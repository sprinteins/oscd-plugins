---
name: vitest-test
description: 'Create or update Vitest spec files for TypeScript. Use when: writing tests, updating tests, fixing failing tests, adding test coverage, generating spec files, GIVEN/WHEN/THEN test format, vitest, coverage. DO NOT USE FOR: e2e tests (use Playwright), non-TypeScript test files.'
argument-hint: 'Optional: path to implementation file to test'
---

# Vitest Test Authoring

Write and update `*.spec.ts` files that match the current implementation, follow the GIVEN/WHEN/THEN naming convention, and achieve ≥90 % branch coverage.

## When to Use
- Creating a new `*.spec.ts` from scratch
- Updating tests after an implementation changed
- Debugging a failing spec
- Reviewing coverage gaps on a file

## Procedure

### 1. Read the Implementation
- Open (or locate) the source file under test.
- List its exported functions/classes and identify all branches: happy path, edge cases, error paths, and missing-context cases (e.g. required prop absent, empty input, not-found).

### 2. Locate or Create the Spec File
- Convention: `*.spec.ts` lives next to the source file.
- If no spec exists, create it from scratch.

### 3. Write Tests — Naming & Structure Rules
- Use `describe / it / expect` from Vitest.
- **Name every test** with GIVEN / WHEN / THEN phrasing.
- **Single test for a condition** → use a flat `it('GIVEN … WHEN … THEN …')` — no wrapping `describe` needed.

  ```ts
  // ❌ Unnecessary nesting — one describe, one it
  describe('GIVEN no input', () => {
    it('WHEN called THEN throws', () => { … })
  })

  // ✅ Flat — GIVEN moves into the it() label
  it('GIVEN no input WHEN called THEN throws', () => { … })
  ```
- **Multiple tests share a GIVEN or WHEN** → group under `describe('GIVEN …')` or `describe('WHEN …')` with shared setup in `beforeEach`; individual `it`s use `THEN …`.
- Reset mocks after each test: `vi.restoreAllMocks()` in `afterEach`.
- Only `vi.mock` external modules/stores when truly needed; avoid mocking the module under test.

#### ❌ Anti-pattern — duplicated setup (NEVER do this)
```ts
it('WHEN x THEN returns foo', () => {
  const doc = makeSsdDoc(SSD_XML)  // ← duplicated in every test
  const result = fn(doc)
  expect(result).toBe('foo')
})
it('WHEN y THEN returns bar', () => {
  const doc = makeSsdDoc(SSD_XML)  // ← duplicated in every test
  const result = fn2(doc)
  expect(result).toBe('bar')
})
```

#### ✅ Correct pattern — shared setup in `beforeEach`
```ts
describe('GIVEN a valid SSD document', () => {
  let doc: XMLDocument

  beforeEach(() => {
    doc = makeSsdDoc(SSD_XML)  // ← created once per test, not duplicated
  })

  it('WHEN x THEN returns foo', () => {
    expect(fn(doc)).toBe('foo')
  })
  it('WHEN y THEN returns bar', () => {
    expect(fn2(doc)).toBe('bar')
  })
})
```

> **Rule:** if two or more `it` blocks inside the same `describe` open with identical setup lines, extract those lines into `beforeEach`. This applies at every nesting level.

#### Nested GIVEN/WHEN — both levels share state
```ts
describe('GIVEN a valid document', () => {
  let doc: Document

  beforeEach(() => {
    doc = parse(MY_XML)  // runs before every it() in this block
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('WHEN valid input is provided', () => {
    let result: string

    beforeEach(() => {
      result = fn(doc, 'valid')  // runs before every it() in this nested block
    })

    it('THEN it returns the expected value', () => {
      expect(result).toBe('expected')
    })

    it('THEN it does not throw', () => {
      expect(() => fn(doc, 'valid')).not.toThrow()
    })
  })
})
```

#### Flat single-case — no shared setup needed
```ts
it('GIVEN no input WHEN the function is called with undefined THEN it throws', () => {
  expect(() => fn(undefined)).toThrow()
})
```

### 4. Run Tests & Iterate
- Use the **Vitest extension** in VS Code (sidebar) to run the spec.
- If any test fails:
  1. Read the failure message carefully.
  2. Determine whether the test or the implementation is wrong.
  3. Fix the **test** if it is incorrect.
  4. If the **implementation** appears to be the cause, report it to the user and wait for confirmation before changing any source file.
  5. Re-run until all tests pass.

### 5. Check Coverage
- Target ≥ 90 % branch coverage for the file under test.
- If gaps remain, add targeted tests for uncovered branches.
- Use `vitest run --coverage` or the VS Code Vitest coverage toggle for a report.

## Quality Checklist
- [ ] Every `it(…)` uses GIVEN / WHEN / THEN phrasing or is grouped under a `describe('GIVEN …')`
- [ ] Shared setup is in `beforeEach`, not duplicated
- [ ] `vi.restoreAllMocks()` called in `afterEach` when mocks are used
- [ ] Tests are independent (no shared mutable state leaking between tests)
- [ ] All important branches are exercised (empty input, null/undefined, error paths)
- [ ] All tests pass with `vitest run`
