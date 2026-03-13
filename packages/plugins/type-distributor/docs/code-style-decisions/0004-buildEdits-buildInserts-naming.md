---
title: "Code Style Decision 0004 — buildEdits vs buildInserts naming"
status: Accepted
date: 2026-03-13
category: code-style
---

# `buildEdits*` vs `buildInserts*` naming

## Decision

Use the function name prefix to express the **narrowest edit type** the function returns:

| Return type | Prefix |
|---|---|
| `Insert[]` only | `buildInserts*` |
| `SetAttributes[]` only | `buildUpdates*` |
| `Remove[]` only | `buildRemoves*` |
| Mixed (e.g. `(Insert \| SetAttributes)[]`) | `buildEdits*` |

Examples:

```ts
// Only inserts new nodes → buildInserts*
function buildInsertsForDataTypeTemplates(...): Insert[] { ... }

// Only updates attributes → buildUpdates*
function buildUpdatesForBayLNode(...): SetAttributes[] { ... }

// Only removes nodes → buildRemoves*
function buildRemovesForLDevice(...): Remove[] { ... }

// Mixed insert + update, or mixed remove + update → buildEdits*
function buildEditsForEquipmentUpdates(...): (SetAttributes | Insert)[] { ... }
function buildEditsForDeleteAccessPoint(...): (Remove | SetAttributes)[] { ... }
```

For a function that returns exactly **one** edit (not an array), use the singular:
`buildInsert*`, `buildUpdate*`, `buildRemove*`, `buildEdit*`.

```ts
// Single SetAttributes edit
function buildUpdateForBay(scdBay: Element, bayType: BayType): SetAttributes { ... }
```

## Why

The existing code mixes the conventions — `buildEditsForDataTypeTemplates` returns only
`Insert[]`, while `buildInsertEditsForFunction` also returns only `Insert[]`, and
`buildAccessPointInserts` drops `Edits` altogether. This makes it harder to reason about
what a function does from its name alone without reading the return type.

Aligning the prefix with the edit type means:

- A reviewer reading a call site knows whether attribute mutations, node insertions, or
  deletions are happening without jumping to the definition.
- TypeScript inference is clearer — callers that spread results into a typed array can
  verify the prefix matches.
- Inconsistencies surface as code-review noise rather than runtime bugs.

## Scope & Consequences

- Apply inside `packages/plugins/type-distributor`.
- Migrate existing mismatched names incrementally; rename the function and update all
  call sites in one focused commit per function.

### Functions to rename (current → target)

| Current name | Target name | Reason |
|---|---|---|
| `buildEditsForDataTypeTemplates` | `buildInsertsForDataTypeTemplates` | returns `Insert[]` |
| `buildEditsForLd0DataTypes` | `buildInsertsForLd0DataTypes` | returns `Insert[]` |
| `buildEditsForType` (private) | `buildInsertsForType` | returns `Insert[]` |
| `buildEditsForBayLNode` | `buildUpdatesForBayLNode` | returns `SetAttributes[]` |
| `buildEditForBayUpdate` (singular) | `buildUpdateForBay` | returns single `SetAttributes` |
| `buildInsertEditsForFunction` | `buildInsertsForFunction` | returns `Insert[]`; drop redundant "Edits" |
| `buildInsertEditsForEqFunction` | `buildInsertsForEqFunction` | same reason |
| `buildAccessPointInserts` | `buildInsertsForAccessPoints` | align with naming pattern |
| `buildEditsForCreateAccessPoint` | `buildInsertsForCreateAccessPoint` | returns `Insert[]` |
| `buildEditsForCreateIedWithAccessPoints` | `buildInsertsForCreateIedWithAccessPoints` | returns `Insert[]` |

Functions whose names are already correct (mixed return types):

- `buildEditsForEquipmentUpdates` → `(SetAttributes | Insert)[]` ✓
- `buildEditsForDeleteAccessPoint` → `(Remove | SetAttributes)[]` ✓
- `buildEditsForDeleteLNodeFromAccessPoint` → `(Remove | SetAttributes)[]` ✓
- `buildEditsForClearingBayLNodeConnections` → `SetAttributes[]` — rename to `buildUpdatesForClearingBayLNodeConnections`

## Notes

- The `code-style.md` file says *"Use `build*` prefix for factory functions returning edits"*
  and cites `buildEditsForBayLNode` as an example. Update that example when renaming.
- If a function composes both pure-insert and pure-update helpers internally but exposes a
  mixed return type, `buildEdits*` is the right choice — the external contract determines
  the prefix, not the internal implementation.
- Do not use `buildEdits*` as a catch-all just to avoid choosing. If the return type is
  unambiguous, use the specific prefix.
