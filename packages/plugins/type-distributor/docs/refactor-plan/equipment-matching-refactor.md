# Equipment Matching Refactor Plan

## References

- [new-folder-structure.md](./new-folder-structure.md) — target architecture
- [concepts/equipment-matching-process.md](../concepts/equipment-matching-process.md) — full description of the three matching phases (validation → manual matching → apply)
- [concepts/matching-algorithm.md](../concepts/matching-algorithm.md) — matching strategies (auto vs. manual) and validation rules
- [concepts/store-architecture.md](../concepts/store-architecture.md) — store responsibilities and dependency graph
- [code-style-decisions/0001-parameter-object-params.md](../code-style-decisions/0001-parameter-object-params.md) — parameter object rule (3+ params → object)
- [code-style.md](../code-style.md) — naming conventions (`build*`, `query*`, `ensure*`) and file naming

---

## Goal

Dissolve the `headless/matching/` folder and redistribute its contents into the new architecture
(`domain/`, `scl/`, `actions/`) defined in [new-folder-structure.md](./new-folder-structure.md).

The single most important constraint: **functions in `domain/` must be pure**. Any function that
currently reads from a store must receive the data it needs as a parameter instead.

### How store reads are eliminated

Rather than passing store methods as function callbacks, we extract **standalone pure lookup functions** that operate on plain data arrays. Domain functions then receive the needed array (e.g. `conductingEquipmentTemplates`) as a parameter and call the pure helper internally.

```ts
// domain/matching/template-lookup.ts
export function getConductingEquipmentTemplate(
  templates: ConductingEquipmentTemplate[],
  uuid: string
): ConductingEquipmentTemplate | undefined {
  return templates.find((t) => t.uuid === uuid)
}

export function getFunctionTemplate(
  templates: FunctionTemplate[],
  uuid: string
): FunctionTemplate | undefined {
  return templates.find((t) => t.uuid === uuid)
}
```

Callers in `actions/` pass `ssdImportStore.conductingEquipmentTemplates` (or `functionTemplates`) directly. The store's existing `getConductingEquipmentTemplate()` and `getFunctionTemplate()` methods can be updated to delegate to these pure helpers, or removed entirely if all callers are migrated.

> **Why not a callback param?** Per [code-style-decisions/0001](../code-style-decisions/0001-parameter-object-params.md), we prefer passing resolved data into functions over hidden dependencies. A plain array param is more explicit and easier to test than a `(uuid) => Template | undefined` callback.

---

## Current `matching/` Inventory

```
headless/matching/
├── index.ts
├── matching.ts                          ← algorithmic core
├── equipment-grouping.ts                ← pure utility
├── resolve-matching-context.ts          ← pure utility
├── types.d.ts                           ← EquipmentMatch, EquipmentLookupItem, TemplateCountMismatch
├── applyBayTypeSelection.ts             ← ORCHESTRATOR – reads 3 stores, calls editor.commit()
├── validation/
│   ├── index.ts
│   ├── types.d.ts                       ← ValidationResult, AmbiguousTypeInfo
│   ├── validation.ts                    ← core algorithm, but reads ssdImportStore
│   └── validateBayTypeSelection.ts      ← ORCHESTRATOR – reads stores, writes back to stores
└── scd-edits/
    ├── index.ts
    ├── bay-update.ts                    ← pure edit builder
    ├── equipment-updates.ts             ← pure edit builder
    ├── function-creation.ts             ← edit builder, but reads ssdImportStore
    ├── eqfunction-creation.ts           ← pure edit builder
    ├── lnode-creation.ts                ← pure element factory (duplicate of scl/elements/lnode-element.ts)
    └── data-types/
        ├── index.ts
        ├── copy-data-type-templates.ts  ← type-collection + edit building logic, reads ssdImportStore
        ├── ensure-data-type-templates.ts ← pure edit builder
        ├── query-types.ts               ← pure XML queries (DOType / DAType / EnumType traversal)
        ├── query-insertion-references.ts ← pure helper (TYPE_ORDER, reference resolution)
        └── type-creation-helpers.ts     ← edit builder, reads ssdImportStore via cloneTypeFromSSD
```

---

## Destination Map

### 1. `domain/matching/` — Pure matching + validation (equipment matching domain)

Validation and matching are co-located here because they are the two phases of the same equipment matching process (see [concepts/equipment-matching-process.md](../concepts/equipment-matching-process.md) — Phase 1 is validation, Phase 3 is apply/match). Separating them into different folders would split a cohesive domain concept unnecessarily.

**Source:** `matching/matching.ts`, `matching/equipment-grouping.ts`, `matching/resolve-matching-context.ts`, `matching/types.d.ts`, `matching/validation/validation.ts`, `matching/validation/types.d.ts`

**Target:** `headless/domain/matching/` — flat structure, no sub-folders

| Source file | Target file | Changes needed |
|---|---|---|
| `matching.ts` | `domain/matching/match-equipment.ts` | `createEquipmentLookup` calls `ssdImportStore.getConductingEquipmentTemplate`. Replace store call with `getConductingEquipmentTemplate(conductingEquipmentTemplates, uuid)` from the new pure helper. Add `conductingEquipmentTemplates: ConductingEquipmentTemplate[]` param to `matchEquipmentForInitialApply` and `matchEquipmentForPersistedBay`. |
| `equipment-grouping.ts` | `domain/matching/equipment-grouping.ts` | No changes — already pure. |
| `resolve-matching-context.ts` | `domain/matching/resolve-matching-context.ts` | No changes — already pure. |
| `types.d.ts` | `domain/matching/types.d.ts` | No changes — pure types. (`EquipmentMatch`, `EquipmentLookupItem`, `TemplateCountMismatch`) |
| `validation/validation.ts` | `domain/matching/validate-equipment-match.ts` | `validateEquipmentMatch` calls `ssdImportStore.getConductingEquipmentTemplate`. Replace store call with `getConductingEquipmentTemplate(conductingEquipmentTemplates, uuid)` from the pure helper. Add `conductingEquipmentTemplates: ConductingEquipmentTemplate[]` param. |
| `validation/types.d.ts` | `domain/matching/validation-types.d.ts` | No changes — pure types. (`ValidationResult`, `AmbiguousTypeInfo`) |
| _(new)_ | `domain/matching/template-lookup.ts` | New file — pure lookup helpers (see [Goal → How store reads are eliminated](#how-store-reads-are-eliminated)). |

**Exports from `domain/matching/index.ts`:**
```ts
export { matchEquipmentForInitialApply, matchEquipmentForPersistedBay, getScdEquipmentMatchKey } from './match-equipment'
export { validateEquipmentMatch } from './validate-equipment-match'
export { getConductingEquipmentTemplate, getFunctionTemplate } from './template-lookup'
export { groupEquipmentByType } from './equipment-grouping'
export { resolveMatchingContext } from './resolve-matching-context'
export type { EquipmentMatch, EquipmentLookupItem, TemplateCountMismatch } from './types'
export type { ValidationResult, AmbiguousTypeInfo } from './validation-types'
```

---

### 2. `domain/type-resolution/` — Pure type dependency collection

**Source:** `matching/scd-edits/data-types/copy-data-type-templates.ts` (the `queryAllTypesFromLNodeTemplates` + `queryAllTypeIds` logic), `matching/scd-edits/data-types/query-types.ts`

**Target:** `headless/domain/type-resolution/`

| Source | Target file | Changes needed |
|---|---|---|
| `copy-data-type-templates.ts` — `queryAllTypeIds`, `queryAllTypesFromLNodeTemplates`, `filterExistingTypes` | `domain/type-resolution/collect-type-dependencies.ts` | `queryAllTypeIds` reads `ssdImportStore.loadedSSDDocument`. Replace with `ssdDoc: XMLDocument` parameter. Signature becomes: `collectTypeDependencies(lnodeTemplates: LNodeTemplate[], ssdDoc: XMLDocument): TypeCollections`. The raw document is unavoidable here — the SSD-parsed typed objects don't carry the DOM nodes needed for `cloneNode` during the copy step. |
| `query-types.ts` | `domain/type-resolution/query-types.ts` | No changes — pure XML queries. No store access. |

**Note:** `TypeCollections` is a co-located type in this folder.

---

### 3. `scl/edits/bay-type-edits.ts` — Bay-type application edit builders

**Source:** `matching/scd-edits/bay-update.ts`, `matching/scd-edits/equipment-updates.ts`

**Target:** `headless/scl/edits/bay-type-edits.ts` (new file, distinct from the existing `bay-edits.ts` which handles LNode bay connections)

| Source function | Notes |
|---|---|
| `buildEditForBayUpdate(scdBay, bayType)` | Pure — no store reads. Move as-is. |
| `buildEditsForEquipmentUpdates(matches)` | Pure — no store reads. Move as-is. |

---

### 4. `scl/edits/function-edits.ts` — Function & EqFunction edit builders

**Source:** `matching/scd-edits/function-creation.ts`, `matching/scd-edits/eqfunction-creation.ts`

**Target:** `headless/scl/edits/function-edits.ts` (new file)

| Source function | Changes needed |
|---|---|
| `buildInsertEditsForFunction(doc, bayType, scdBay)` | Reads `ssdImportStore.getFunctionTemplate`. Replace store read with a `functionTemplates: FunctionTemplate[]` param; call pure `getFunctionTemplate(functionTemplates, uuid)` internally. |
| `buildInsertEditsForEqFunction(doc, matches)` | Pure — no store reads. Move as-is. |

---

### 5. `scl/elements/lnode-element.ts` — LNode element factory (merge)

**Source:** `matching/scd-edits/lnode-creation.ts`

**Target:** Already exists as `scl/elements/lnode-element.ts`

`lnode-element.ts` exports `createLNodeElementInIED` (used for IED LN elements). The matching version
`createLNodeElement` creates `LNode` elements for bay/function contexts — different tag and attribute set.

**Decision:** Add `createLNodeElement` (the bay-context version) to `scl/elements/lnode-element.ts`
and export it alongside `createLNodeElementInIED`. Remove `matching/scd-edits/lnode-creation.ts`.

---

### 6. `scl/edits/data-type-edits.ts` — Data type template edit builders

**Source:** `matching/scd-edits/data-types/copy-data-type-templates.ts` (the `buildEditsForDataTypeTemplates` + `buildEditsForType`), `matching/scd-edits/data-types/ensure-data-type-templates.ts`, `matching/scd-edits/data-types/query-insertion-references.ts`, `matching/scd-edits/data-types/type-creation-helpers.ts`

**Target:** `headless/scl/edits/data-type-edits.ts` (new file)

| Source function | Changes needed |
|---|---|
| `buildEditsForDataTypeTemplates(doc, dataTypeTemplates, lnodeTemplates)` | Calls `queryAllTypesFromLNodeTemplates` which reads the store. After step 2, pass `ssdDoc` through: `buildEditsForDataTypeTemplates(doc, dataTypeTemplates, lnodeTemplates, ssdDoc)`. |
| `ensureDataTypeTemplates(doc)` | Pure — no store reads. Move as-is. |
| `queryTypeReference` / `TYPE_ORDER` from `query-insertion-references.ts` | Pure — keep as internal helpers in `data-type-edits.ts` or a co-located `data-type-edits.helpers.ts`. |
| `buildEditsForType` from `type-creation-helpers.ts` | `cloneTypeFromSSD` reads `ssdImportStore.loadedSSDDocument`. Replace with `ssdDoc: XMLDocument` parameter. |

---

### 7. `scl/queries/data-type-queries.ts` — XML read queries for data types

The `query-types.ts` file contains pure XML query functions. These fit better under `scl/queries/` (alongside `ied-queries.ts`, `lnode-queries.ts`) than inside `domain/`.

**Decision:** After step 2, move these to `scl/queries/data-type-queries.ts`. Depending on whether they are only called from `domain/type-resolution/`, they can remain co-located there instead — decide at implementation time.

---

### 8. `actions/apply-bay-type.action.ts` — Apply bay type orchestrator

**Source:** `matching/applyBayTypeSelection.ts`

**Target:** `headless/actions/apply-bay-type.action.ts` (new file)

This file already has the right shape for an action: reads `ssdImportStore`, `equipmentMatchingStore`,
`bayStore`; calls domain functions; calls `editor.commit()` (see [concepts/store-architecture.md](../concepts/store-architecture.md) — `drop-handler` is the current model for this pattern).

Changes after the domain/scl refactor:
- Call `matchEquipmentForInitialApply` passing `ssdImportStore.conductingEquipmentTemplates`
- Call `buildInsertEditsForFunction` passing `ssdImportStore.functionTemplates`
- Call `buildEditsForDataTypeTemplates` passing `ssdDoc` (obtained from `getDocumentAndEditor`)
- Rename exported function to `applyBayType` (drop "Selection" suffix for consistency with the new naming pattern)

---

### 9. `actions/validate-bay-type.action.ts` — Validate bay type orchestrator

**Source:** `matching/validation/validateBayTypeSelection.ts`

**Target:** `headless/actions/validate-bay-type.action.ts` (new file)

Changes after the domain refactor:
- Call `validateEquipmentMatch` passing `ssdImportStore.conductingEquipmentTemplates`
- Rename exported function to `validateBayType`

---

## Files Deleted After Refactor

Once all consumers are updated, delete the entire `headless/matching/` folder tree.

Also delete `matching/scd-edits/lnode-creation.ts` since its functionality merges into the existing `scl/elements/lnode-element.ts`.

---

## Impurity Summary — Store Reads to Eliminate

| File | Store-reading call | Fix |
|---|---|---|
| `matching/matching.ts` — `createEquipmentLookup` | `ssdImportStore.getConductingEquipmentTemplate(uuid)` | Add `conductingEquipmentTemplates` param; call pure `getConductingEquipmentTemplate(templates, uuid)` |
| `matching/validation/validation.ts` — `validateEquipmentMatch` | `ssdImportStore.getConductingEquipmentTemplate(uuid)` | Add `conductingEquipmentTemplates` param; call pure `getConductingEquipmentTemplate(templates, uuid)` |
| `matching/scd-edits/function-creation.ts` — `buildInsertEditsForFunction` | `ssdImportStore.getFunctionTemplate(uuid)` | Add `functionTemplates` param; call pure `getFunctionTemplate(templates, uuid)` |
| `matching/scd-edits/data-types/copy-data-type-templates.ts` — `queryAllTypeIds` | `ssdImportStore.loadedSSDDocument` | Add `ssdDoc: XMLDocument` param to `collectTypeDependencies` |
| `matching/scd-edits/data-types/type-creation-helpers.ts` — `cloneTypeFromSSD` | `ssdImportStore.loadedSSDDocument` | Add `ssdDoc: XMLDocument` param to `buildEditsForType` |

---

## Recommended Implementation Order

1. **Create `domain/matching/template-lookup.ts`** — add pure `getConductingEquipmentTemplate` and `getFunctionTemplate` helpers; this unblocks steps 2–4
2. **Create `domain/matching/` (rest)** — move matching + validation files flat; replace store calls with pure lookup helpers and `conductingEquipmentTemplates` array param
3. **Create `domain/type-resolution/`** — extract `collectTypeDependencies`, move pure `query-types.ts`
4. **Create `scl/edits/bay-type-edits.ts`** — move `buildEditForBayUpdate` + `buildEditsForEquipmentUpdates`
5. **Create `scl/edits/function-edits.ts`** — move both function builders, plumb `functionTemplates` array param
6. **Merge into `scl/elements/lnode-element.ts`** — add `createLNodeElement` (bay version)
7. **Create `scl/edits/data-type-edits.ts`** — move builders, plumb `ssdDoc` param through the chain
8. **Create `actions/apply-bay-type.action.ts`** — thin orchestrator wiring stores → domain → scl
9. **Create `actions/validate-bay-type.action.ts`** — thin orchestrator
10. **Update all consumers** (components, store derived values) to import from the new paths
11. **Delete `headless/matching/`**
12. **Run tests**, fix any broken imports

Each step can be done independently because the existing `matching/index.ts` barrel keeps old imports working until the final deletion step.
