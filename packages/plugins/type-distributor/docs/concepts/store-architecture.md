# Store Architecture

This document describes the store and utility layer in the `type-distributor` plugin — what each module owns, what it exposes, and how they relate.

## Responsibilities

| Module | Owns | Exposes |
|---|---|---|
| `ssd-import.store` | All parsed SSD data —<br>`bayTypes`<br> `functionTemplates`<br> `conductingEquipmentTemplates`<br>`lnodeTypes`<br>`doTypes`<br>`daTypes`<br>`enumTypes`<br>`selectedBayType`<br>`fileInput`<br>`currentFilename` — and the loaded document reference | `loadFromSSD()`<br>`getConductingEquipmentTemplate()`<br>`getFunctionTemplate()`<br>all `$state` properties |
| `bay-types.utils` | A lazy template cache (invalidated automatically when `bayTypes` reference changes) | `getBayTypeWithTemplates(uuid)` — assembles `BayTypeWithTemplates` with Maps<br>`getAllLNodesWithParent(bayTypeWithTemplates)` — pure LNode flattening |
| `bay.store` | `$state`:<br>`selectedBay`<br>`selectedBayUuid`<br>`pendingBayTypeApply`<br>`$derived`:<br>`scdBay` (live DOM element)<br>`assignedBayTypeUuid`<br>`equipmentMatches` | `selectedBay`<br>`selectedBayUuid`<br>`scdBay`<br>`assignedBayTypeUuid`<br>`equipmentMatches`<br>`pendingBayTypeApply` |
| `equipment-matching.store` | Conducting Equipment matching state between SCD bay and bay type template | `manualMatches`<br>`validationResult`<br>`templatesByType`<br>`requiredTemplateCounts`<br>`templateCountMismatch`<br>`templateCountsValid`<br>`selectedTemplateCounts`<br>mutations:<br>`setValidationResult()`<br>`setMatch()`<br>`reset()`<br>`clearManualMatches()` |
| `assigned-lnodes.store` | Index of which LNodes have been assigned to IEDs for the current bay (`SvelteSet`)<br>rebuild logic delegated to `assigned-lnodes.helpers.ts` | `rebuild()`<br>`isAssigned()`<br>`markAsAssigned()`<br>`areAllLNodesAssigned()`<br>`hasConnections` |
| `dnd.store` | Drag-and-drop UI state and drop execution | `isDragging`<br>`draggedItem`<br>`currentDraggedItem`<br>`isDraggingItem()`<br>`handleDragStart/End/Drop()` |
| `drop-handler` | Orchestration logic for a drop commit (not a store — plain module) | `getBayTypeApplicationState()`<br>`shouldApplyBayType()`<br>`applyBayType()`<br>`buildEditsForIed()`<br>`generateCommitTitle()`<br>`commitEdits()` |

## Dependency Graph

```mermaid
flowchart TB
    subgraph DATA ["Data Layer"]
        SSD["ssd-import.store</br>Source of truth — all SSD data</br>+ selectedBayType"]
        BTU["bay-types.utils</br>Template cache & LNode queries"]
    end

    subgraph CONTEXT ["Context Stores"]
        BAY["bay.store</br>Selected bay in SCD"]
        EQM["equipment-matching.store</br>CE matching & validation"]
        ALN["assigned-lnodes.store</br>LNode assignment index"]
    end

    subgraph INTERACTION ["Interaction Layer"]
        DND["dnd.store</br>Drag & drop state"]
        DH["drop-handler</br>Drop commit orchestration"]
    end

    subgraph EXTERNAL ["External"]
        PGS["pluginGlobalStore</br>core-ui-svelte</br>editCount reactivity"]
        MTH["matching</br>matchEquipment()"]
    end

    BTU -- reads --> SSD
    BAY -- reads bayTypes --> SSD
    EQM -- reads bayTypes --> SSD
    ALN -- reads bayTypes --> SSD

    BAY -- reads validationResult --> EQM
    BAY -- reads editCount --> PGS
    BAY -- matchEquipment --> MTH
    ALN -- reads scdBay --> BAY
    ALN -- getAllLNodesWithParent --> BTU

    DND -- markAsAssigned --> ALN
    DND -- delegates --> DH
    DH -- reads/writes --> SSD
    DH -- reads --> BAY
    DH -- reads --> EQM
    DH -- getBayTypeWithTemplates --> BTU
```

## Key design decisions

- **`ssd-import.store` is the single source of truth.** All parsed SSD data — including `selectedBayType` — lives here. No other store duplicates this state. Data type templates are stored as four separate state properties (`lnodeTypes`, `doTypes`, `daTypes`, `enumTypes`) rather than a single `dataTypeTemplates` object.
- **`bay-types.utils` is a plain module, not a store.** Template assembly and LNode flattening require no reactive state beyond the cache. The cache is invalidated by reference comparison against `ssdImportStore.bayTypes`, which changes on every `loadFromSSD()` call.
- **`bay.store` exposes derived properties, not owned state, for `scdBay`, `assignedBayTypeUuid`, and `equipmentMatches`.** These are `$derived` — computed from `selectedBay`, the live SCD document, and the equipment matching store. Only `selectedBay`, `selectedBayUuid`, and `pendingBayTypeApply` are raw `$state`.
- **No circular dependencies.** Previously `ssd-import.store` called `bayTypesStore.clearCache()`, creating a cycle. This is resolved by the self-invalidating reference check in `bay-types.utils`.
- **`dnd.store` / `drop-handler` coupling is intentional.** Drop execution inherently coordinates multiple stores (bay context, matching state, assignment index). This is modelled explicitly in `drop-handler` rather than hidden inside individual stores. The single `applyBayTypeIfNeeded()` function has been split into `shouldApplyBayType()` (predicate) and `applyBayType()` (executor) for clarity.
