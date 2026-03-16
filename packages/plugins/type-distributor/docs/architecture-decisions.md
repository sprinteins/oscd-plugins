# Architecture Decisions

## Store-Based State Management

The plugin uses Svelte 5 runes-based stores for state management:

- **ssdImportStore**: Holds all parsed SSD data (bay types, function templates, equipment templates, data type templates, selected bay type). Single source of truth.
- **bay-types.utils**: Plain module (not a store) that provides a lazy, self-invalidating template cache on top of `ssdImportStore`. Exposes `getBayTypeWithTemplates()` and `getAllLNodesWithParent()`.
- **bayStore**: Tracks the selected SCD bay element. `scdBay`, `assignedBayTypeUuid`, and `equipmentMatches` are `$derived`; `selectedBay`, `selectedBayUuid`, and `pendingBayTypeApply` are `$state`.
- **equipmentMatchingStore**: Manages manual equipment-to-template matches and validation state.
- **dndStore**: Handles drag-and-drop UI state and delegates drop commits to `drop-handler`.
- **assignedLNodesStore**: Tracks which LNodes have been assigned to IEDs.

**Rationale**: Centralized state management ensures consistent data flow between UI components and headless logic. Stores act as single source of truth for cross-component state.

## Explicit Matching Modes

Equipment matching uses two explicit APIs with different behavior:

1. **Initial apply** (`matchEquipmentForInitialApply`):
	- Pass 1: persisted `templateUuid` mapping
	- Pass 2: manual key-based matches
	- Pass 3: type fallback for remaining equipment
2. **Persisted bay** (`matchEquipmentForPersistedBay`):
	- strict `templateUuid` mapping only
	- no manual matching, no type fallback

**Rationale**: Preserves equipment identity after assignment while still supporting manual disambiguation and first-time auto-matching.

## LDevice inst and ldName Schema

LDevice elements created by the plugin follow a deterministic naming schema that embeds the source EqFunction/Function UUID to guarantee uniqueness across duplicate-named functions:

| Scenario | `inst` | `ldName` |
|---|---|---|
| Bay-level `Function` | `FunctionName_functionUuid` | `IedName_FunctionName_functionUuid` |
| Equipment `EqFunction` | `EquipmentName_FunctionName_eqFunctionUuid` | `IedName_EquipmentName_FunctionName_eqFunctionUuid` |
| LD0 (per access point) | `LD0_APname` | `IedName_LD0_APname` |

The UUID embedded in `inst` comes from the **SCD-side** `EqFunction[uuid]` (written by `buildInsertsForEqFunction` during `applyBayType`), not the template UUID. This ensures `inst` values remain unique even when two `EqFunction` elements share the same `name` on the same equipment.

`parseLDeviceInst(inst)` decodes this schema and returns `{ equipmentName, functionName, functionUuid }`.

## Position-Based Duplicate EqFunction Resolution

When a `ConductingEquipment` has multiple `EqFunction` elements with the same `name` (e.g., two `DisconnectorFunction` entries), the plugin uses **position-based matching** to correctly target each one:

- `buildInsertsForEqFunction` iterates `templateEquipment.eqFunctions` in order and inserts them into the SCD in that same order.
- `resolveScdEqFunctionUuid` finds the index of the dragged template EqFunction within the template list (`findIndex(f => f.uuid === sourceFunction.uuid)`), then picks the nth SCD `EqFunction[name="..."]` at that position. Its `uuid` becomes `functionUuidOverride`.
- `functionUuidOverride` is threaded through `createMultipleLNodesInAccessPoint` → `ensureLDevice` → `createLDeviceElement` so the LDevice `inst` encodes the correct SCD EqFunction UUID.
- `buildUpdatesForBayLNode` receives the same uuid as `scdEqFunctionUuid` and queries `EqFunction[uuid="..."]` directly, bypassing name-only ambiguity.
- When clearing connections on delete, `queryMatchingBayLNode` extracts `functionUuid` from `parseLDeviceInst(ldInst)` and queries `EqFunction[uuid="..."]` instead of `EqFunction[name="..."]`.

**Invariant**: insertion order in `buildInsertsForEqFunction` is stable and matches template array order, making positional lookup safe.

## Staged Data Type Insertion

Data types are inserted in multiple stages with dependency resolution:

1. Collect all required LNodeType IDs from templates
2. For each LNodeType, recursively collect referenced DOTypes, DATypes, and EnumTypes
3. Insert types in dependency order: EnumType → DAType → DOType → LNodeType

## Validation Before Application

The `validateBayTypeSelection` function runs before applying changes:

- Detects type count mismatches between SCD and bay template
- Identifies ambiguous types requiring manual matching
- Returns `canAutoMatch` flag to guide UI behavior

**Rationale**: Early validation prevents partial application failures and provides clear user feedback about required manual intervention.

## Headless/UI Separation

Business logic resides in `src/headless/`, UI components in `src/ui/`:

- Headless functions are pure, testable, and framework-agnostic
- UI components consume headless logic through stores and function calls
