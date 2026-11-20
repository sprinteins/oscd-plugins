---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---

# Test-Driven Development

TDD is the red → green → small post-green refactor loop for **agreed behavior**, changing source and tests within authorized scope. Apply repository standards during each cycle and review. [AGENTS.md](../../../AGENTS.md) owns authorization and portable Skill/subagent fallbacks.

Before exploring, read the [domain policy](../../../doc/agents/domain.md) and relevant glossary-map entries and ADRs. Use domain terms in test names and interfaces.

For package TypeScript specs, load [Vitest routing](../../../.github/instructions/vitest-test.instructions.md) and [vitest-test](../vitest-test/SKILL.md), which owns colocated specs, configured environments, GIVEN/WHEN/THEN naming, fixture/mock setup, and validation. Use the owning package's CLI runner; VS Code's extension is optional.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't. A good test reads like a specification: "user can checkout with valid cart" tells you exactly what capability exists, and it survives refactors because it doesn't care about internal structure.

See [tests.md](tests.md) for test anti-patterns, [mocking.md](mocking.md) for boundary guidance, and [interface-design.md](interface-design.md) when designing testable interfaces.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test is written at an unconfirmed seam. You can't test everything, so agreeing the seams up front is how testing effort lands on the critical paths and complex logic instead of every edge case.

Ask: "What's the public interface, and which seams should we test?" Give each proposed seam a one-line note on what it catches and what it misses.

When the interface shape is in question, load [codebase-design](../codebase-design/SKILL.md) for module, interface, depth, seam, adapter, leverage, and locality vocabulary. Use its vocabulary as reference, not a separate design session.

Record the user-confirmed seams, behaviors, independent expectations, what each seam catches/misses, and the agreed affected coverage surface before writing tests. Existing explicit approval in the spec/conversation counts; if approval cannot be obtained, report the gate and stop before test authoring rather than inventing agreement.

## Anti-patterns

- **Implementation-coupled**: mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior hasn't changed.
- **Tautological**: the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant asserted equal to itself), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, the spec.
- **Horizontal slicing**: writing all tests first, then all implementation. Bulk tests verify _imagined_ behavior: you test the _shape_ of things rather than user-facing behavior, the tests go insensitive to real changes, and you commit to test structure before understanding the implementation. Work in **vertical slices** instead: one test → one implementation → repeat, each test a **tracer bullet** that responds to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Don't anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Small post-green refactoring.** Once the focused tests pass, remove local duplication or simplify the affected design in small steps, rerunning tests after each. Never refactor while RED or broaden into unrelated cleanup. See [refactoring.md](refactoring.md).

## Completion

- Observe each tracer bullet failing for the intended behavioral reason before minimal implementation; environment/import failures are not behavioral RED.
- One agreed public-API vertical slice reaches GREEN before starting the next; no bulk tests followed by bulk implementation.
- Complete the [Vitest validation and coverage procedure](../vitest-test/SKILL.md) for the agreed affected surface. Missing coverage measurement is not a pass; report gaps and seek confirmation for exceptions.
- Run the two-axis [completion review](../code-review/SKILL.md), including relevant uncommitted/new work. Report exact validation results and remaining misses; leave changes uncommitted unless explicitly authorized.
