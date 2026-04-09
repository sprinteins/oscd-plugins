# Insert arrays and edit accumulation

This document explains what `Insert[]` is, how it fits into the broader edit model, and how edit arrays are built and combined across the `type-distributor` codebase.

## The edit types

All XML mutations go through OpenSCD's edit API, imported from `@openscd/oscd-api`. There are three edit types:

| Type | What it does |
| --- | --- |
| `Insert` | inserts a DOM node into a parent element at an optional reference position |
| `SetAttributes` | sets one or more attributes on an existing element |
| `Remove` | removes an existing element from the document |

Builder functions in `headless/scl/edits/` return arrays of one or more of these types.

## The shape of `Insert`

```ts
import type { Insert } from '@openscd/oscd-api'

const edit: Insert = {
    parent: scdBay,         // the element to insert into
    node: functionElement,  // the new node to insert
    reference: referenceNode // insert before this node, or null to append
}
```

The `reference` field controls where the new node is placed among its siblings. Pass `null` or omit it to append at the end.

## Why builders return arrays

A single user action — such as applying a bay type — requires many XML mutations at once: attribute updates on the bay, inserts for each `Function` and `EqFunction`, inserts for data type templates, and so on. Returning a flat array from each builder keeps the responsibility of deciding what to insert inside that builder, while the action assembles the full picture.

```ts
// in apply-bay-type.action.ts
const edits: (Insert | SetAttributes)[] = []

edits.push(buildUpdateForBay(scdBay, bayType))
edits.push(...buildEditsForEquipmentUpdates(matches))
edits.push(...buildInsertsForEqFunction({ doc, matches, prefixes }))
edits.push(...buildInsertsForFunction({ doc, bayType, scdBay, functionTemplates, existingPrefixes }))
edits.push(...buildInsertsForDataTypeTemplates({ doc, dataTypeTemplates, lnodeTemplates, ssdDoc }))

editor.commit(edits, { title: `Assign BayType "${bayType.name}" to Bay "${bayName}"` })
```

All edits are committed in a single `editor.commit(...)` call so that OpenSCD can treat the entire operation as one undoable transaction.

## Accumulation pattern

The standard pattern for collecting edits is:

1. declare a typed array — `const edits: Insert[] = []` or a union type when the builder mixes edit kinds
2. push single edits directly — `edits.push(buildUpdateForBay(...))`
3. spread array results — `edits.push(...buildInsertsForFunction(...))`
4. commit once at the end

Spreading keeps the accumulation site flat and readable. Avoid nesting arrays of arrays.

## Builder naming and return types

Builder names signal what their return type contains. See [code style](../code-style.md#edit-builder-naming) for the full table. The short version:

- `buildInserts*` returns `Insert[]`
- `buildUpdates*` returns `SetAttributes[]`
- `buildRemoves*` returns `Remove[]`
- `buildEdits*` returns a mixed union such as `(Insert | SetAttributes)[]`

This convention lets a reviewer know what kind of mutation to expect before reading the implementation.

## Related docs

- [OpenSCD plugin API reference ↗](https://github.com/openscd/oscd-api/blob/main/docs/plugin-api.md)
- [Code style](../code-style.md)
- [Workflow and data flow](../structure/workflow-and-data-flow.md)
