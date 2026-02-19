---
title: "Code Style Decision 0001 — Parameter object when 3+ params"
status: Accepted
date: 2026-02-19
category: code-style
---

# Parameter object when 3+ params

Decision

- For functions that require three or more parameters, accept a single object parameter typed via an interface. Example:


```ts
interface BuildParams {
	accessPoint: Element
	iedName: string
	selectedBay?: Element | null
}

// Preferred: destructured object param in the signature
function buildEditsForDeleteAccessPoint({ accessPoint, iedName, selectedBay }: BuildParams) { /* ... */ }

// Use the non-destructured `params: BuildParams` form only when you need
// to forward or store the whole object inside the function.
```

- Prefer passing resolved inputs (e.g. `selectedBay`) into functions rather than having the function read stores directly.

Why

- Improves readability and reduces errors due to positional argument ordering.
- TypeScript interfaces make required vs optional inputs explicit.
- Reduces hidden dependencies and makes functions easier to unit-test.

Scope & Consequences

- Apply inside `packages/plugins/type-distributor` where functions grow beyond two params.
- Call sites must be updated to pass an object; perform small targeted commits that update signatures and callers together.

Notes

- This is a pragmatic rule (threshold = 3). For trivial helpers with 1–2 inputs, keep positional params.
- If a function still accesses stores after adopting object params, consider refactoring to move store reads to the caller.

Next steps

- Migrate affected functions incrementally and add unit tests to ensure behavior remains unchanged.
- Open follow-up issues to split functions that do multiple responsibilities.

Related files

- `packages/plugins/type-distributor/src/headless/ied/delete-elements/build-edits-for-delete-access-point.ts`
- `packages/plugins/type-distributor/src/headless/ied/delete-elements/build-edits-for-delete-access-point.spec.ts`
