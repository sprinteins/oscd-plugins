### New Folder Structure

```
src/
├── headless/
│   ├── types/                    # Pure domain types (renamed from common-types/)
│   │   ├── index.d.ts
│   │   ├── ssd.d.ts             # BayType, Templates, LNodeType, DOType, DAType, EnumType
│   │   ├── matching.d.ts        # EquipmentMatch, EquipmentLookupItem, MatchResult
│   │   ├── validation.d.ts      # ValidationResult, AmbiguousTypeInfo
│   │   └── ied.d.ts             # SIED-related types, DraggedItem
│   │
│   ├── domain/                   # Pure business logic — NO store imports, NO side effects
│   │   ├── ssd-parsing/          # (move from headless/ssd-parsing/ — already pure)
│   │   ├── matching/             # Pure matching algorithm
│   │   │   └── match-equipment.ts    # Takes (scdEquipment[], templates[]) → MatchResult
│   │   ├── validation/           # Pure validation
│   │   │   └── validate-equipment-match.ts  # Takes (bayEquipment, bayTypeTemplates) → ValidationResult
│   │   └── type-resolution/      # Data type dependency collection (extract from data-types/)
│   │       └── collect-type-dependencies.ts # Takes (lnodeTypeIds, ssdDoc) → ordered type list
│   │
│   ├── scl/                      # SCL XML operations — pure: take XML elements as params
│   │   ├── queries/              # Read-only XML queries
│   │   │   ├── bay-queries.ts        # queryBayElement, queryConductingEquipment
│   │   │   ├── ied-queries.ts        # querySIEDs, queryIEDInsertionRef (from ied/)
│   │   │   ├── lnode-queries.ts      # queryLNodesFromAccessPoint (from ied/)
│   │   │   └── data-type-queries.ts  # queryDOTypes, queryDATypes, queryEnumTypes (from data-types/)
│   │   ├── edits/                # Edit builders returning Insert/SetAttributes/Remove
│   │   │   ├── bay-edits.ts          # buildEditForBayUpdate, buildEditsForEquipmentUpdates
│   │   │   ├── function-edits.ts     # buildInsertEditsForFunction, buildInsertEditsForEqFunction
│   │   │   ├── lnode-edits.ts        # createLNodeElement, buildEditsForBayLNode
│   │   │   ├── ied-edits.ts          # buildIEDInsertEdit, buildAccessPointInsertEdit
│   │   │   ├── data-type-edits.ts    # buildEditsForDataTypeTemplates, ensureDataTypeTemplates
│   │   │   └── delete-edits.ts       # buildEditsForDeleteAccessPoint, buildEditsForDeleteLNode
│   │   └── elements/             # Element creation helpers (from ied/elements/)
│   │       ├── ied-element.ts        # createBasicIEDElement
│   │       ├── ldevice.ts            # createLDevice, generateInstName
│   │       ├── lnode.ts              # createLNodeElementInIED
│   │       └── server.ts             # createServerElementWithAuth
│   │
│   ├── stores/                   # Thin reactive state — NO orchestration, NO editor.commit()
│   │   ├── ssd-import.store.svelte.ts     # Parsed SSD data + loaded document ( minus fileInput) + selectedBayType
│   │   ├── bay-types.utils.ts            # Pure template assembly and LNode
│   │   ├── bay.store.svelte.ts            # Selected bay, scdBay derived, equipment matches
│   │   ├── equipment-matching.store.svelte.ts  # Validation result, manual matches (minus isManualMatchingExpanded)
│   │   ├── assigned-lnodes/               # (keep — already reasonably clean)
│   │   ├── dnd.store.svelte.ts            # Only isDragging + draggedItem (drop logic removed)
│   │   └── index.ts
│   │
│   ├── actions/                  # Use-case orchestrators — the ONLY place that calls editor.commit()
│   │   ├── import-ssd.action.ts           # File read → parse → write to ssdImportStore
│   │   ├── validate-bay-type.action.ts    # Read stores → call domain validation → write result to store
│   │   ├── apply-bay-type.action.ts       # Read stores → match → build all edits → commit → update stores
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

## To be discussed:

- Do we want to really extract all types to a separate folder? Or is it fine to keep related types (e.g. matching-related) in their respective domain folders?
  - We keep related types together (e.g. MatchingResult inside a types file inside domatin/matching/)
- If deemed necessary split functions into multiple files and create a deeper folder structure (e.g. scl/equries/ied/queryIED and scl/queries/ied/queryAccessPoints instead of scl/queries/ied-queries).

