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
