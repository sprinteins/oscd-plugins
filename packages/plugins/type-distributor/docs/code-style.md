# Code style

This document keeps the local coding conventions that are still useful for `type-distributor`.

## Naming conventions

### Functions

- use descriptive verb-based names such as `validateBayType` or `applyBayType`
- use `is`, `has`, and `can` for boolean-returning helpers
- use `buildInsert*`, `buildUpdate*`, `buildRemove*`, or `buildEdit*` based on the narrowest edit type a builder returns
- use `query*` for XML lookups and `ensure*` for helpers that guarantee a required structure exists

### Variables and types

- use camelCase for variables and PascalCase for types
- prefer descriptive names over abbreviations
- use plural names for collections such as `matches`, `templates`, and `edits`

## Parameter objects for 3+ inputs

When a function needs three or more inputs, prefer a single object parameter typed with a local interface.

```ts
interface BuildParams {
	accessPoint: Element
	iedName: string
	selectedBay?: Element | null
}

function buildEditsForDeleteAccessPoint({
	accessPoint,
	iedName,
	selectedBay
}: BuildParams) {
	// ...
}
```

This keeps call sites readable, makes required versus optional inputs obvious, and makes tests easier to write.

## Write targeted XML queries

Prefer precise selectors over broad scans followed by filtering in JavaScript or TypeScript.

```ts
const item = doc.querySelector(`item[id="${id}"]`)
```

Instead of:

```ts
const item = Array.from(doc.getElementsByTagName('item')).find(
	(node) => node.getAttribute('id') === id
)
```

Also normalize missing query results to `null` rather than `undefined` for DOM-style APIs.

This belongs in code style guidance because it is a local implementation convention for writing XML lookup code. It would only become an ADR if the team wanted to record a broader architectural decision about query strategy across the plugin.

## Prefer the shared `createElement` helper

When constructing SCL elements, prefer the core `createElement` helper instead of direct DOM construction followed by separate `setAttribute(...)` calls.

Why:

- namespace handling stays consistent
- attributes can be applied at creation time
- callers avoid repeating low-level XML creation details
- the codebase keeps one place to improve element construction behavior later

## Edit-builder naming

Use the builder prefix that matches the returned edit contract:

| Return type | Prefix |
| --- | --- |
| `Insert[]` only | `buildInserts*` |
| `SetAttributes[]` only | `buildUpdates*` |
| `Remove[]` only | `buildRemoves*` |
| mixed edit arrays | `buildEdits*` |
| single edit | `buildInsert*`, `buildUpdate*`, `buildRemove*`, or `buildEdit*` |

The point is not style for style's sake. The builder name should tell a reviewer what kind of XML mutation to expect before they open the implementation.

## Related docs

- [Test style](./test-style.md)
- [Source overview](./structure/source-overview.md)
