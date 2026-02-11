# Architecture Decisions

## Store-Based State Management

The plugin uses Svelte 5 runes-based stores for state management:

- **bayTypesStore**: Manages selected bay type from SSD
- **ssdImportStore**: Holds parsed SSD data (bay types, templates, data types)
- **bayStore**: Tracks selected SCD bay element
- **equipmentMatchingStore**: Manages manual equipment-to-template matches
- **dndStore**: Handles drag-and-drop UI state
- **assignedLNodesStore**: Tracks which LNodes have been assigned to IEDs

**Rationale**: Centralized state management ensures consistent data flow between UI components and headless logic. Stores act as single source of truth for cross-component state.

## Two-Phase Matching Algorithm

Equipment matching follows a two-phase approach:

1. **Manual matching phase**: User-specified matches are applied first
2. **Auto-matching phase**: Remaining equipment is matched by type

**Rationale**: Handles ambiguous cases where multiple templates share the same equipment type but have different names. Manual matching provides user control when auto-matching is insufficient.

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

## Assigned LNodes Tracking with Incremental Updates

The `assignedLNodesStore` maintains an index of LNodes that have been assigned to IEDs to prevent duplicate assignments.

**Key Design Decisions**:

1. **Scoped uniqueness**: LNodes are identified by `parentUuid:lnClass:lnType:lnInst` where parentUuid is the Function or Equipment instance UUID. This allows the same LNode type to exist in different Functions without conflicts.

2. **iedName attribute as assignment indicator**: Only LNodes with the `iedName` attribute are considered assigned. This distinguishes between template LNodes in bay structures and actually assigned LNodes.

3. **Incremental updates during drag-and-drop**: After successful LNode drop, the store uses `markAsAssigned()` for O(1) updates instead of rescanning the entire document. Full `rebuild()` is reserved for significant state changes (bay selection, document reload).

4. **Reactive visual feedback**: UI components use Svelte 5's `$derived` to compute disabled states based on assignment status. Parent Functions/Equipment are disabled only when all their child LNodes are assigned, enabling partial assignment workflows.

5. **Document as single source of truth**: While manual marks optimize runtime performance, `rebuild()` always synchronizes state with the SCD document. This ensures consistency after external document modifications.

**Rationale**: This approach balances performance (incremental updates) with correctness (rebuild validation) while providing clear user feedback about assignment state. The scoped uniqueness model aligns with IEC 61850 semantics where the same logical node type can appear in different functional contexts.