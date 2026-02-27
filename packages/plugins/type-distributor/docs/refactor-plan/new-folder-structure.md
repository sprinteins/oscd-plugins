### New Folder Structure

> **Guiding principle:** Keep files focused (ideally < 150 lines, max ~200).
> Use subfolders to group related files instead of merging many concerns into one large file.
> Cross-cutting types stay in `common-types/`; narrow types stay co-located with domain code.

```
src/
├── headless/
│   ├── common-types/             # Cross-cutting types used across many layers (35+ files)
│   │   ├── index.d.ts
│   │   ├── ssd-types.d.ts            # BayType, Templates, LNodeType, DOType, DAType, EnumType, etc.
│   │   └── matching-types.d.ts       # EquipmentMatch (used in 10+ files across stores, scl, actions)
│   │
│   ├── domain/                   # Pure business logic — NO store imports, NO side effects
│   │   ├── ssd-parsing/          # (move from headless/ssd-parsing/ — already pure)
│   │   │   ├── parse-bay-types.ts
│   │   │   ├── parse-data-type-templates.ts
│   │   │   └── parse-templates.ts
│   │   ├── matching/             # Pure matching algorithm (keep existing files)
│   │   │   ├── match-equipment.ts
│   │   │   ├── equipment-grouping.ts
│   │   │   ├── resolve-matching-context.ts
│   │   │   └── types.d.ts            # EquipmentLookupItem, TemplateCountMismatch (narrow types)
│   │   └── validation/           # Pure validation (keep existing files)
│   │       ├── validate-equipment-match.ts
│   │       └── types.d.ts            # ValidationResult, AmbiguousTypeInfo
│   │
│   ├── scl/                      # SCL XML operations — pure: take XML elements as params
│   │   ├── queries/              # Read-only XML queries (flat — all files are small)
│   │   │   ├── bay-queries.ts             # queryBayElement, queryConductingEquipment
│   │   │   ├── ied-queries.ts             # querySIEDs, queryIEDInsertionRef
│   │   │   ├── lnode-queries.ts           # queryLNodesFromAccessPoint
│   │   │   ├── data-type-queries.ts       # queryDOTypes, queryDATypes, queryEnumTypes (~53L)
│   │   │   └── data-type-refs-queries.ts  # TYPE_ORDER, queryTypeReference (~27L)
│   │   │
│   │   ├── edits/                # Edit builders returning Insert/SetAttributes/Remove
│   │   │   ├── bay/                       # Bay-level edits (keep split — bay-lnode alone is 134L)
│   │   │   │   ├── bay-lnode-edits.ts         # buildEditsForBayLNode
│   │   │   │   └── accesspoint-edits.ts       # createMultipleLNodesInAccessPoint, createAccessPoints
│   │   │   │
│   │   │   ├── ied-edits.ts                   # buildIEDInsertEdit (small, 38L — flat is fine)
│   │   │   │
│   │   │   ├── matching/                  # Edits for applying a bay-type match
│   │   │   │   ├── bay-update.ts              # buildEditForBayUpdate (~19L)
│   │   │   │   ├── equipment-updates.ts       # buildEditsForEquipmentUpdates (~36L)
│   │   │   │   ├── function-creation.ts       # buildInsertEditsForFunction (~52L)
│   │   │   │   ├── eqfunction-creation.ts     # buildInsertEditsForEqFunction (~44L)
│   │   │   │   └── lnode-creation.ts          # createLNodeElement (~18L)
│   │   │   │
│   │   │   ├── data-types/                # Data-type template copy/insert (keep split — 5 concerns)
│   │   │   │   ├── copy-data-type-templates.ts    # buildEditsForDataTypeTemplates (~163L)
│   │   │   │   ├── ensure-data-type-templates.ts  # ensureDataTypeTemplates (~22L)
│   │   │   │   └── type-creation-helpers.ts       # buildEditsForType (~35L)
│   │   │   │
│   │   │   └── delete/                    # Element deletion edits (keep split — helper is ~97L)
│   │   │       ├── delete-access-point.ts         # buildEditsForDeleteAccessPoint (~34L)
│   │   │       ├── delete-lnodes.ts               # buildEditsForDeleteLNodeFromAccessPoint (~75L)
│   │   │       └── delete.helper.ts               # buildEditsForClearingBayLNodeConnections (~97L)
│   │   │
│   │   ├── elements/             # Element creation helpers (flat — all small)
│   │   │   ├── ied-element.ts        # createBasicIEDElement
│   │   │   ├── ldevice.ts            # createLDevice, generateInstName
│   │   │   ├── lnode.ts              # createLNodeElementInIED
│   │   │   └── server.ts            # createServerElementWithAuth
│   │   │
│   │   └── filters/              # Element filters (flat — all small)
│   │       ├── access-point-filters.ts
│   │       ├── ied-filters.ts
│   │       ├── ldevice-filters.ts
│   │       ├── lnode-filters.ts
│   │       └── types.d.ts
│   │
│   ├── stores/                   # Thin reactive state — NO orchestration, NO editor.commit()
│   │   ├── ssd-import.store.svelte.ts          # Parsed SSD data + loaded document + selectedBayType
│   │   ├── bay-types.utils.ts                  # Pure template assembly and LNode helpers
│   │   ├── bay.store.svelte.ts                 # Selected bay, scdBay derived, equipment matches
│   │   ├── equipment-matching.store.svelte.ts  # Validation result, manual matches
│   │   ├── assigned-lnodes/                    # (keep — already reasonably clean)
│   │   ├── dnd.store.svelte.ts                 # Only isDragging + draggedItem (drop logic → actions/)
│   │   └── index.ts
│   │
│   ├── actions/                  # Use-case orchestrators — the ONLY place that calls editor.commit()
│   │   ├── import-ssd.action.ts           # File read → parse → write to ssdImportStore
│   │   ├── validate-bay-type.action.ts    # Read stores → call domain validation → write result
│   │   ├── apply-bay-type.action.ts       # Read stores → match → build all edits → commit
│   │   ├── create-sied.action.ts          # Build IED edit → commit
│   │   ├── create-access-point.action.ts  # Build AP edit → commit
│   │   ├── assign-lnode.action.ts         # (from drop-handler) Build edits → commit → mark assigned
│   │   ├── delete-access-point.action.ts  # Build delete edits → commit → rebuild assigned
│   │   ├── delete-lnode.action.ts         # Build delete edits → commit → rebuild assigned
│   │   └── index.ts
│   │
│   ├── utils/                    # Keep getDocumentAndEditor wrappers
│   └── test-helpers/             # Keep
│
└── ui/
    └── components/               # (structure unchanged, but business logic extracted to actions)
```

---

## Decisions

- **`common-types/` kept for cross-cutting types:** SSD data model types (used by 35+ files)
  and `EquipmentMatch` (used by 10+ files across 3 layers) live in `common-types/`.
  Narrow types (e.g. `EquipmentLookupItem`, `AmbiguousTypeInfo`) stay co-located with their domain.

- **Files stay small:** Instead of merging related files into one large file,
  keep them as separate files inside a subfolder with an `index.ts` barrel.

- **Queries extracted from data-types:** `query-types.ts` and `query-insertion-references.ts`
  move to `scl/queries/` since they are pure read-only XML queries.

- **data-types/ keeps 3 files** (copy, ensure, helpers) — not merged into one.

- **delete/ keeps 3 files** (delete-AP, delete-LNodes, helper) — not merged into one.

- **matching/ (edits) keeps 5 files** — each function is a distinct edit builder.

- **bay/ groups bay-lnode-edits and accesspoint-edits** — both operate on bays
  but are different enough to stay in separate files.

---

## What changed vs. the original plan

| Original plan | Refined plan | Reason |
|---|---|---|
| `scl/edits/bay-edits.ts` (merge 3 files → ~190L) | `scl/edits/bay/` subfolder + `scl/edits/matching/` keeps bay-update & equipment-updates | Bay LNode edits vs. matching edits are different concerns |
| `scl/edits/data-type-edits.ts` (merge 5 files → ~300L) | `scl/edits/data-types/` (3 files) + `scl/queries/` (2 files) | Too many concerns for one file; queries belong in queries/ |
| `scl/edits/delete-edits.ts` (merge 3 files → ~206L) | `scl/edits/delete/` (3 files) | Helper alone is ~100L; keep separation clear |
| `scl/edits/function-edits.ts` (merge 2 → ~96L) | `scl/edits/matching/function-creation.ts` + `eqfunction-creation.ts` | Small files; no need to merge, keeps matching/ group cohesive |
| `scl/edits/lnode-edits.ts` (merge 2 → ~152L) | `scl/edits/bay/bay-lnode-edits.ts` + `scl/edits/matching/lnode-creation.ts` | Different layers: bay LNode edits vs. LNode element creation |
| `domain/type-resolution/` (new) | Removed — queries stay in `scl/queries/`, edits in `scl/edits/data-types/` | No need for a new domain folder; existing split is cleaner |
| Top-level `types/` folder | `common-types/` kept + `EquipmentMatch` moved there | Cross-cutting types (35+ importers) need a shared home; narrow types stay co-located |

