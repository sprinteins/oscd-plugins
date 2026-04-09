# ADR 0001: Use store-centered plugin state

## Status

Accepted

## Context

The plugin coordinates SSD import data, the selected SCD bay, validation state, assigned LNode tracking, and drag-and-drop behavior across multiple UI areas. Without a clear ownership model, the same state would be duplicated in components and action code, making it hard to keep the three-column view consistent.

## Decision

Use a store-centered state model:

- `ssdImportStore` is the source of truth for parsed SSD content and the selected bay type
- `bayStore` owns selected-bay context and derives persisted bay state from the live SCD
- `equipmentMatchingStore` owns validation results and manual matching choices
- `assignedLNodesStore` owns the assignment index used to disable already-assigned content
- `dndStore` owns drag state and delegates drop-time orchestration to `drop-handler`

Pure domain logic and XML edit builders stay outside the stores. Actions and drop orchestration read from stores and commit edits.

## Consequences

The UI can stay reactive and thin because cross-component state lives in one place.

The source tree has clearer responsibilities:

- `stores/` owns reactive state
- `domain/` owns matching and type-resolution rules
- `scl/` owns XML queries, element creation, and edit builders
- `actions/` owns apply and validation entry points

This also creates a few intentional seams to watch:

- `dnd.store.svelte.ts` is not just visual state; it participates in drop orchestration
- some action boundaries still reflect current UI needs rather than a perfectly pure domain split
