# Equipment Matching Process

## Overview

Equipment matching is the mechanism by which the Type Distributor maps each `ConductingEquipment` element in an SCD bay to a template definition imported from an SSD file. The result of a successful match determines which logical nodes, equipment functions, and data types are applied to each piece of physical equipment when the user applies a bay type.

The process runs in three sequential phases:

1. **Validation** – check whether the SCD bay is compatible with the selected bay type
2. **Manual matching** – resolve ambiguities the user must decide
3. **Apply** – run initial-apply matching (persisted mapping → manual matches → type fallback) and commit SCD edits

---

## Phase 1: Validation

Entry point: `validateBayTypeSelection(bayName)` → `validateEquipmentMatch(scdBay, bayType)`

Before the user can apply a bay type, the plugin validates that a mapping is possible.

### Pre-flight guard

If the bay already has LNode connections assigned to an IED **and** the user is trying to switch to a different bay type, validation is immediately rejected:

```
Error: "Cannot change Bay Type - LNode connections exist"
```

This prevents data loss from re-assigning connected logical nodes.

### Type count check

All `ConductingEquipment` elements in the SCD bay are grouped by their `type` attribute. The bay type's conducting equipment list (resolved through their `templateUuid`) is grouped the same way. For every type that appears in either side, the counts must be equal:

```
SCD:     2× CBR, 1× DIS
BayType: 2× CBR, 1× DIS  →  valid

SCD:     1× CBR, 1× DIS
BayType: 2× CBR, 1× DIS  →  error: "SCD has 1 CBR, BayType has 2"
```

### Ambiguity detection

If the bay type contains multiple templates that share the same `type` but have **different names**, auto-matching cannot safely decide which template to assign to which SCD element. The validator marks these types as ambiguous:

```
Templates for type "CBR":
  - CircuitBreaker_A
  - CircuitBreaker_B
→ Ambiguous: requires manual matching
```

When ambiguity is detected `ValidationResult.requiresManualMatching` is set to `true` and `canAutoMatch` to `false`.

### Validation result

```typescript
type ValidationResult = {
  isValid: boolean
  errors: string[]
  requiresManualMatching?: boolean
  ambiguousTypes?: AmbiguousTypeInfo[]   // list of { typeCode, templateNames }
  canAutoMatch?: boolean
}
```

The result is stored in `equipmentMatchingStore.validationResult` and drives the UI. If `isValid` is `false` and `requiresManualMatching` is `false`, the "Apply" action remains disabled without any further user interaction possible.

---

## Phase 2: Manual Matching UI

Relevant files:
- [`equipment-matching.svelte`](../../src/ui/components/columns/bay-type/equipment-matching.svelte)
- [`equipment-matching-row.svelte`](../../src/ui/components/columns/bay-type/equipment-matching-row.svelte)
- [`template-count-mismatch-panel.svelte`](../../src/ui/components/columns/bay-type/template-count-mismatch-panel.svelte)
- [`equipment-matching.store.svelte.ts`](../../src/headless/stores/equipment-matching.store.svelte.ts)

Only SCD equipment that belongs to an **ambiguous type** appears in the manual matching UI. Equipment whose type maps to exactly one template is silently auto-matched later.

### Identifying ambiguous rows

`equipment-matching.svelte` derives `ambiguousEquipmentRows` by iterating the SCD bay's `ConductingEquipment` elements and keeping only those whose type has more than one distinct template in `equipmentMatchingStore.templatesByType`:

```
templatesByType: Map<equipmentType, ConductingEquipmentTemplate[]>
```

This map is derived from the selected bay type in `equipmentMatchingStore`.

### Dropdown options

For each ambiguous equipment row the component builds a list of selectable template options. Deduplication is applied so that the same template UUID only appears once, even if the bay type references it multiple times.

```
Equipment: CB1 (CBR)
Options:
  - None
  - CircuitBreaker_A (CBR)
  - CircuitBreaker_B (CBR)
```

### Recording a manual match

When the user picks a template, `equipmentMatchingStore.setMatch(equipmentKey, templateUuid)` is called. This writes to the reactive `manualMatches: SvelteMap<string, string>`.

The equipment key is resolved by `getScdEquipmentMatchKey` and is stable in this order:
- `uuid` (preferred)
- `name`
- fallback `index:<n>`

### Template count mismatch guard

The bay type may require a specific template to appear a certain number of times (e.g., exactly two instances of `CircuitBreaker_A`). The store computes `templateCountMismatch` by comparing:

- `requiredTemplateCounts`: how many times each template UUID appears in the bay type
- `selectedTemplateCounts`: how many times each template UUID has been assigned via `manualMatches`

A mismatch is surfaced via `TemplateCountMismatchPanel`:

```
Template count mismatch:
  CircuitBreaker_A (CBR): 1/2
```

The "Apply" action remains blocked while any mismatch exists.

### Apply readiness

`allMatchesSet` is `true` (enabling apply) only when:
1. Every ambiguous equipment row has an entry in `manualMatches`, **and**
2. `templateCountMismatch` is empty

---

## Phase 3: Apply — Matching Algorithm and SCD Edits

Entry point: `applyBayTypeSelection(bayName)`

### Step 3.1 – Run matching (`matching.ts`)

`applyBayTypeSelection` uses `matchEquipmentForInitialApply(scdBay, bayType, manualMatches)`.

Initial-apply matching runs in three passes:

**Pass A – Persisted UUID mapping first**
1. Read each SCD equipment element's `templateUuid` attribute.
2. Resolve the matching bay-type equipment instance by `bayTypeEquipment.uuid`.
3. Reserve the instance (`usedUuids`) and emit an `EquipmentMatch`.

This preserves identity for already-mapped equipment and prevents same-type reshuffling.

**Pass B – Manual key-based matches**
1. For unmatched SCD equipment, resolve a stable key via `getScdEquipmentMatchKey`.
2. Look up `manualMatches.get(equipmentKey)`.
3. Resolve an unused bay-type equipment instance by `templateUuid` and emit a match.

If no available instance exists for the selected template, an error is thrown.

**Pass C – Type-based fallback**
1. Group still-unmatched equipment by `type`.
2. Match each item to an unused bay-type template of the same `type`.

If no type-compatible instance exists, an error is thrown.

For already-assigned bays, `bayStore` resolves matches through `matchEquipmentForPersistedBay(scdBay, bayType)`, which only accepts persisted `templateUuid` mappings and throws on missing mappings.

**Match result structure:**

```typescript
type EquipmentMatch = {
  scdElement: Element                    // <ConductingEquipment> in the SCD
  bayTypeEquipment: ConductingEquipmentType  // reference entry in the bay type
  templateEquipment: ConductingEquipmentTemplate  // full template from SSD
}
```

### Step 3.2 – Build SCD edits

After matching, a series of edit operations are collected and committed atomically via `editor.commit(edits, { title })`.

| Builder | What it does |
|---|---|
| `buildEditForBayUpdate` | Sets `desc` and other attributes on the `<Bay>` element |
| `buildEditsForEquipmentUpdates` | Sets `uuid`, `templateUuid`, and `originUuid` on each matched `<ConductingEquipment>`; assigns UUIDs to any existing `<Terminal>` children that lack one |
| `buildInsertEditsForEqFunction` | For each match, inserts `<EqFunction>` children (with nested `<LNode>` elements) into the `<ConductingEquipment>`, derived from `templateEquipment.eqFunctions` |
| `buildInsertEditsForFunction` | Inserts bay-level `<Function>` elements into the `<Bay>` element, one per `bayType.functions` entry |
| `ensureDataTypeTemplates` | Creates a `<DataTypeTemplates>` section in the document if one does not already exist |
| `buildEditsForDataTypeTemplates` | Walks all `LNodeTemplate` references across matched equipment functions and bay functions, resolves `LNodeType → DOType → DAType / EnumType` dependency trees, and inserts all required type elements (deduplicating against already-present types) |

---

## Data Model Summary

```
BayType
  ├── conductingEquipments: ConductingEquipmentType[]  (references to templates)
  │     └── templateUuid → ConductingEquipmentTemplate
  │           ├── type   (e.g. "CBR", "DIS")
  │           ├── name   (e.g. "CircuitBreaker_A")
  │           ├── terminals: TerminalTemplate[]
  │           └── eqFunctions: EqFunctionTemplate[]
  │                 └── lnodes: LNodeTemplate[]
  └── functions: FunctionType[]  (bay-level functions)
        └── templateUuid → FunctionTemplate
              └── lnodes: LNodeTemplate[]
```

---

## Store Responsibilities

| Store | Role in matching |
|---|---|
| `ssdImportStore` | Source of parsed bay types, templates, and selected bay type UUID |
| `bayStore` | Holds the target SCD `<Bay>` element and current assignment state |
| `equipmentMatchingStore` | Holds `manualMatches`, validation result, `templatesByType`, and count mismatch state |
| `assignedLNodesStore` | Guards against replacing a bay type when LNode connections already exist |

---

## Error Conditions

| Situation | Behaviour |
|---|---|
| LNode connections exist and bay type changes | Validation blocked with explicit error message |
| Equipment type count mismatch (SCD vs BayType) | Validation fails; list of mismatching types shown |
| Ambiguous types without completing manual matches | Apply disabled; user prompted to fill all dropdowns |
| Template count mismatch in manual matches | Apply disabled; mismatch panel shows required vs selected |
| Manual match specifies an already-exhausted template | Runtime error thrown in `matchEquipmentForInitialApply` |
| Persisted bay has missing `templateUuid` mapping | Runtime error thrown in `matchEquipmentForPersistedBay` |
| SCD equipment has no matching template type | Runtime error thrown in `matchEquipmentForInitialApply` |

---

## Related Documents

- [Matching Algorithm](./matching-algorithm.md) — deep-dive into initial-apply vs persisted-bay matching
- [How to Match Equipment Manually](../how-to/match-equipment.md) — user-facing guide
- [How to Distribute Types](../how-to/distribute-types.md) — end-to-end workflow
- [Store Architecture](./store-architecture.md) — state management overview
