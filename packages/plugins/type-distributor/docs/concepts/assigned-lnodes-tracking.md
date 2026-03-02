# Assigned LNodes Tracking

## Overview

The assigned LNodes tracking system prevents duplicate assignment of LNodes from one BayType to IEDs by maintaining an index of already-assigned LNodes and disabling drag-and-drop functionality for them.

## Problem Statement

When distributing types from BayTypes to IEDs, LNodes can be assigned multiple times if not tracked. This creates:

- **Duplicate configurations**: Same LNode assigned to multiple IEDs or within the same IED
- **User confusion**: No visual feedback about which LNodes are already assigned

## Solution Architecture

### AssignedLNodesStore

A centralized Svelte store that maintains an index of assigned LNodes:

```typescript
type LNodeKey = `${string}:${string}:${string}:${string}:${string}`
// Format: parentUuid:functionScopeUuid:lnClass:lnType:lnInst

class UseAssignedLNodesStore {
  private assignedIndex = new SvelteSet<LNodeKey>()
  
  rebuild(): void
  markAsAssigned(parentUuid: string, lNodes: LNodeTemplate[], functionScopeUuid?: string): void
  isAssigned(parentUuid: string, lnode: LNodeTemplate, functionScopeUuid?: string): boolean
}
```

### Key Identification

LNodes are uniquely identified by combining:

1. **Parent UUID**: The template UUID of the containing Function or Equipment instance
2. **Function Scope UUID**: The UUID of the source Function/EqFunction template
3. **lnClass**: Logical node class (e.g., "XCBR", "CSWI")
4. **lnType**: Logical node type reference
5. **lnInst**: Logical node instance identifier

**Rationale**: Using parent UUID ensures that the same LNode type can exist in different functions/equipment without false positives. This scoping is essential because bay types can have multiple Functions or Equipment instances that use the same LNode definitions.

### Rebuild Mechanism

The store scans the SCD document to identify assigned LNodes:

```typescript
rebuild() {
  // 1. Query all Bay Function elements
  const functions = doc.querySelectorAll('Bay > Function')
  
  // 2. For each Function with templateUuid
  for (const func of functions) {
    const parentUuid = func.getAttribute('templateUuid')
    
    // 3. Find LNodes with iedName attribute (indicates assignment)
    const lnodes = func.querySelectorAll('LNode[iedName]')
    
    // 4. Index each LNode
    for (const lnode of lnodes) {
      const key = `${parentUuid}:${functionScopeUuid}:${lnClass}:${lnType}:${lnInst}`
      this.assignedIndex.add(key)
    }
  }
  
  // 5. Repeat for Equipment EqFunction elements
  const eqFunctions = doc.querySelectorAll('Bay ConductingEquipment EqFunction')
  // ... similar logic
}
```

**When rebuild runs**:
- Plugin mount/initialization
- Bay selection changes
- Document edit count changes (tracked via `$effect`)

## UI Integration

### Visual Feedback

Assigned LNodes show disabled state:

- **Opacity**: 50% transparency
- **Cursor**: `cursor-not-allowed`
- **Draggable**: `draggable={false}`
- **Color**: Gray text for disabled state
- **Tooltip**: "Already assigned to an IED"

### Parent-Level Disabling

Function/Equipment cards are disabled when **all** their LNodes are assigned:

```typescript
let assignedStatuses = $derived(
  eqFunction.lnodes.map((lnode) =>
    assignedLNodesStore.isAssigned(parentUuid, lnode)
  )
)

let allAssigned = $derived(
  eqFunction.lnodes.length > 0 && 
  assignedStatuses.every((status) => status)
)
```

**UI Behavior**:
- Individual LNodes can be non-draggable while parent remains interactive
- Parent becomes non-draggable only when all children are assigned
- Provides granular control for partial assignment scenarios

### Reactivity

The store uses Svelte 5's `SvelteSet` for reactive updates:

```typescript
let assignedStatuses = $derived(
  func.lnodes.map((lnode) =>
    assignedLNodesStore.isAssigned(parentUuid, lnode)
  )
)
```

Any change to the assigned index automatically updates UI components.

## Scoping and Uniqueness

### Parent UUID Scoping

LNodes are scoped to their parent Function or Equipment instance:

```xml
<!-- Two Functions using same LNode type -->
<Bay name="Bay1">
  <Function name="Protection" templateUuid="func-uuid-1">
    <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1" iedName="IED1"/>
  </Function>
  <Function name="Control" templateUuid="func-uuid-2">
    <!--- Same LNode type, different function --->
    <LNode lnClass="XCBR" lnType="TestXCBR" lnInst="1"/>
  </Function>
</Bay>
```

**Tracking**:
- `func-uuid-1:func-template-1:XCBR:TestXCBR:1` → Assigned ✅
- `func-uuid-2:func-template-2:XCBR:TestXCBR:1` → Not assigned ❌

This allows the same LNode definition to be used across different Functions without conflict.

### Equipment Instance Handling

For equipment-based LNodes, the parent UUID is the matched bay-type equipment instance UUID (stored on SCD equipment as `templateUuid`):

```xml
<ConductingEquipment name="CB1" type="CBR" templateUuid="eq-uuid-1">
  <EqFunction name="Control">
    <LNode lnClass="PTRC" lnType="TestPTRC" lnInst="1" iedName="IED1"/>
  </EqFunction>
</ConductingEquipment>
```

For EqFunction-based LNodes, `parentUuid` is the bay-type equipment instance UUID and `functionScopeUuid` is the EqFunction template UUID.

**EqFunction key**: `eq-instance-1:eq-function-template-1:PTRC:TestPTRC:1`

For bay-level Function LNodes, `parentUuid` is the Function instance UUID and `functionScopeUuid` is the Function template UUID.

**Function key**: `func-instance-1:func-template-1:CSWI:TestCSWI:1`

The store resolves equipment assignment state from current bay context and resolved equipment matches.

## Edge Cases

### Missing templateUuid

Functions/Equipment without `templateUuid` attributes are skipped with a warning:

```typescript
if (!parentUuid) {
  console.warn(`[AssignedLNodes] Function "${functionName}" has no templateUuid, skipping`)
  continue
}
```

### LNodes Without iedName

Only LNodes with the `iedName` attribute are considered assigned:

```typescript
const lnodes = func.querySelectorAll('LNode[iedName]')
```

**Rationale**: LNodes without `iedName` exist in the bay structure as templates but haven't been assigned to any IED yet.

### Rebuild Synchronization

Manual assignments are not persisted across rebuilds:

```typescript
assignedLNodesStore.markAsAssigned({ parentUuid: funcUuid, lNodes: [lnode2] })  // Manual mark
assignedLNodesStore.rebuild()  // Clears manual marks

// lnode2 is no longer marked unless it exists in document
```

**Rationale**: The document is the single source of truth. Manual marks are runtime optimizations that must be validated against document state.

## Performance Considerations

### Indexing Strategy

Using `SvelteSet` provides O(1) lookup performance:

```typescript
isAssigned({
  parentUuid,
  lnode,
  functionScopeUuid
}: isAssignedParams): boolean {
  const key = this.buildKey({ parentUuid, lnode, functionScopeUuid: functionScopeUuid ?? parentUuid })
  return this.assignedIndex.has(key)  // O(1)
}
```

### Rebuild Frequency

Rebuilds are triggered by:

1. **Mount**: Once on plugin initialization
2. **Bay change**: When user selects different bay
3. **Document edits**: Via `$effect` watching `editCount`

**Should be kept in mind:** Each Drop edits the document, so rebuilds will occur after each assignment. 

### Memory Footprint

Each LNode key is a string with format: `${parentUuid}:${functionScopeUuid}:${class}:${type}:${inst}`

Typical bay: 10-50 Functions/Equipment × 5-20 LNodes = 50-1000 keys

Memory impact: Negligible (strings are interned, Set overhead is minimal)

## Future Enhancements

### Performance optimizations could include:
- Debouncing rebuilds during rapid edits
- Incremental updates instead of full rebuilds (e.g., only update affected parent UUIDs)
- Caching results for unchanged parents
- react better to edits
