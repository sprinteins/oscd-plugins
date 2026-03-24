# ADR 0002: Use explicit equipment matching modes

## Status

Accepted

## Context

The plugin has two different matching problems:

- first-time application of a bay type to an SCD bay
- reloading or revisiting a bay that already has persisted `templateUuid` mappings

Trying to handle both cases with one implicit algorithm makes it hard to reason about whether manual matches and type fallback are allowed.

## Decision

Use two explicit matching entry points:

- `matchEquipmentForInitialApply(...)`
- `matchEquipmentForPersistedBay(...)`

`matchEquipmentForInitialApply(...)` uses a three-pass strategy:

1. reuse persisted `templateUuid` mappings when present
2. apply manual matches from `equipmentMatchingStore.manualMatches`
3. fall back to type-based matching for the remaining equipment

`matchEquipmentForPersistedBay(...)` is strict and accepts only persisted `templateUuid` mappings.

## Consequences

The behavior for first-time apply and persisted bays is explicit at the call site.

Equipment identity is preserved after application because revisiting a bay does not silently rematch by type.

Validation and UI messaging become easier to explain because ambiguity is resolved before apply, while persisted bays rely on stored mappings instead of re-running the looser fallback behavior.
