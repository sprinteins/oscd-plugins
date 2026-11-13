---
name: vitest-test
description: 'Create or update Vitest spec files for TypeScript. Use when: writing tests, updating tests, fixing failing tests, adding test coverage, generating spec files, GIVEN/WHEN/THEN test format, vitest, coverage. DO NOT USE FOR: e2e tests (use Playwright), non-TypeScript test files.'
---

# Vitest Test Authoring

Write and update colocated TypeScript `*.spec.ts` files against **agreed behavior**, not blindly against the current implementation. This skill owns repository test conventions, fixtures/mocks, naming, and validation. [AGENTS.md](../../../AGENTS.md) owns safety and portable invocation; [tdd](../tdd/SKILL.md) owns authorized source-plus-test implementation.

## When to Use
- Creating a new `*.spec.ts` from scratch
- Updating tests after an implementation changed
- Debugging a failing spec
- Reviewing coverage gaps on a file

## Procedure

### 1. Establish Behavior and Read the Implementation
- Read the agreed spec/acceptance criteria and the [domain policy](../../../doc/agents/domain.md), relevant glossaries, and ADRs. Confirm affected public seams and behavior; identify what tests catch/miss.
- Open (or locate) the source file under test.
- List its exported functions/classes and identify all branches: happy path, edge cases, error paths, and missing-context cases (e.g. required prop absent, empty input, not-found).
- Read the owning package manifest, Vitest configuration, existing specs/fixtures, and scoped instructions. Preserve its configured environment (including legacy browser mode).
- Use independent expected literals, worked examples, or spec-derived outcomes; never recompute the implementation's algorithm as the assertion.

### 2. Locate or Create the Spec File
- Convention: `*.spec.ts` lives next to the source file.
- If no spec exists, create it from scratch.
- Reuse existing SCD fixtures and package helpers. See [test-design.md](test-design.md) for headless, component, and semantic DOM/XML assertions and [mocking.md](mocking.md) for typed boundary mocks.

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
- Use `it.each` when the same behavior varies by input. Each test's full nested label must contain GIVEN / WHEN / THEN; keep case inputs and independent expected results visible.

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
- Portable baseline: inspect the owning package's scripts and run the smallest package-owned CLI selector from its directory (or `pnpm --dir <package-directory> <script>`). Record the exact command and result. There is no root test command. The VS Code Vitest extension is optional.
- If any test fails:
  1. Read the failure message carefully.
  2. Determine whether the test or the implementation is wrong.
  3. Fix the **test** if it is incorrect.
  4. In test-maintenance-only mode (including the optional Vitest specialist), report production defects and stop; do not change source or weaken correct expectations to make the suite green. Source changes need an explicit implementation request and authorized scope, then follow `tdd`.
  5. Re-run until all tests pass.

### 5. Check Coverage
- Target ≥90% branch coverage for the **agreed affected surface**, not the entire unrelated package.
- Use the package's existing coverage script/configuration when supported. Record exact command/result, include scope, measured numerator/denominator or percentage, uncovered branches, and meaningful behavioral gaps.
- Add targeted tests only within agreed seams/behavior. Report unreachable/uncovered branches and request user-confirmed exceptions or scope changes; do not expand unrelated work to chase the target.
- If coverage tooling/providers or scoped measurement are unavailable, report **not measured**, the limitation, and the remaining risk. Passing tests or inspecting branches does not prove the target passed. Install/restore only for a chosen missing-dependency failure and within user authorization; do not add tooling just for a docs task.

## Quality Checklist
- [ ] Every `it(…)` uses GIVEN / WHEN / THEN phrasing or is grouped under a `describe('GIVEN …')`
- [ ] Shared setup is in `beforeEach`, not duplicated
- [ ] `vi.restoreAllMocks()` called in `afterEach` when mocks are used
- [ ] Tests are independent (no shared mutable state leaking between tests)
- [ ] Agreed important success, boundary, and error behavior is exercised
- [ ] The focused package CLI test passes (exact command/result recorded)
- [ ] Affected branch coverage is measured against the target, or gaps/unmeasured status and confirmed exceptions are explicitly reported
