# Equipment matching

Equipment matching is the core step that connects an SCD bay to the templates imported from an SSD.

The output of matching determines:

- which `ConductingEquipment` instance maps to which template
- which `EqFunction` and bay-level `Function` content gets inserted
- which data type templates must be copied into the SCD

## Matching modes

The plugin uses two explicit modes.

### Initial apply

Used when applying a bay type to an SCD bay.

`matchEquipmentForInitialApply(...)` runs in three passes:

1. reuse persisted `templateUuid` mappings when they already exist
2. apply manual matches chosen by the user
3. fall back to type-based matching for anything still unmatched

### Persisted bay

Used when the bay has already been assigned and the plugin is reconstructing the current state.

`matchEquipmentForPersistedBay(...)` is strict:

- it requires stored `templateUuid` mappings
- it does not use manual matches
- it does not fall back to type-only matching

## Validation before matching

`validateBayType()` runs before the user can apply a bay type.

It checks:

- whether changing the bay type would conflict with existing LNode connections
- whether the SCD and bay type contain the same number of conducting-equipment instances per `type`
- whether the selected bay type is ambiguous and therefore needs manual matching

## Manual matching

Manual matching is needed when multiple templates share the same equipment `type` but represent different concrete choices.

Example:

```text
SCD equipment:
- CB1 (CBR)
- CB2 (CBR)

Bay type templates:
- CircuitBreaker_A (CBR)
- CircuitBreaker_B (CBR)
```

The plugin cannot safely decide whether `CB1` should use `CircuitBreaker_A` or `CircuitBreaker_B`, so the user must choose.

`equipmentMatchingStore` keeps:

- `manualMatches`
- `validationResult`
- template counts used to block incomplete or overused selections

## Why persisted mapping comes first

Persisted `templateUuid` values preserve equipment identity across repeated visits to the same bay.

Without that rule, a later re-run could silently reshuffle same-type equipment and make previously assigned content appear to jump between equipment instances.

## Match result

Successful matching produces an `EquipmentMatch` that combines:

- the SCD `ConductingEquipment` element
- the selected bay-type equipment instance
- the resolved conducting-equipment template

That result then feeds the SCL edit builders in `applyBayType(...)`.

## Related docs

- [How to match equipment manually](../how-to/match-equipment.md)
- [Workflow and data flow](../structure/workflow-and-data-flow.md)
- [ADR 0002: Use explicit equipment matching modes](../adr/0002-use-explicit-equipment-matching-modes.md)
