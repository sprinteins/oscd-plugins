# Test Style

## Naming Conventions

### File Name
Test files should be named after the source file they cover and use the `.spec.ts` suffix (for example, `matching.ts` → `matching.spec.ts`).

### Top Level
Use a top-level `describe` that names the module or feature under test, matching the exported unit or file name whenever possible.


## What to Test
Focus on observable behavior and side effects, not implementation details. Tests should validate:
- inputs and outputs for pure functions
- state changes for stores (for example, flags, selected items, or cached values)
- edits produced by helpers and builders
- branching behavior for edge cases and early exits
- error handling paths (log calls and clean-up behavior)

Prefer minimal, well-scoped tests that explain *why* a behavior matters to the user flow.


### GIVEN WHEN THEN
Wrap tests that share the same GIVEN setup in a parent `describe` block to avoid repetition and to keep the structure clear.
Structure each test with explicit GIVEN, WHEN, THEN comments so intent and expectations are easy to follow.
Interpret the structure as follows:
- **GIVEN** describes the initial state, mocks, and inputs needed to run the unit under test.
- **WHEN** describes the single action under test (usually one function call or store method invocation).
- **THEN** describes the expected outcomes, such as returned values, updated state, or committed edits.

## Variables

### Mocks
Place mock variables at the top of the test file so the test setup is easy to scan and consistent across files.
