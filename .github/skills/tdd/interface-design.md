# Interface Design for Testability

Design public interfaces around observable package behavior, not around private implementation helpers.

## Headless Logic

- Accept meaningful external dependencies instead of constructing them inside the function.
- Return values or explicit results when possible; isolate unavoidable document/editor mutations behind actions.
- Keep the interface small and strongly typed.
- Use domain types already exported by the package or its core dependency rather than introducing duplicate representations.

```ts
type DocumentReader = (source: string) => XMLDocument

export function readRoot(
	source: string,
	parse: DocumentReader,
): Element | null {
	return parse(source).documentElement
}
```

This can be tested with a real `DOMParser` in a browser or `jsdom` environment, while a parser double can be supplied for a focused boundary test.

## Svelte Components

- Expose behavior through typed props, events, and the rendered DOM.
- Keep domain transformations and SCD queries in headless modules or stores.
- Keep component-local state limited to presentation and interaction concerns.
- Do not add test-only APIs or expose private component state solely to make a test easier.

```ts
render(TypeSelector, {
	types,
	selectedType: 'Bay',
	onselect: onSelect,
})

await user.click(screen.getByRole('button', { name: 'Bay' }))
expect(onSelect).toHaveBeenCalledWith('Bay')
```

## SCD/XML and Editor Boundaries

- Keep XML queries and mutations behind the package's public query/action interfaces.
- Accept an `XMLDocument`, `Element`, or typed editor interface when that is the actual boundary; do not hide a global document or editor singleton inside pure logic.
- Use real SCD fixtures for behavior that depends on namespaces, element relationships, or serialization.
- Wrap OpenSCD host/editor APIs behind the smallest interface needed by the feature, then mock that wrapper in unit tests.

Small interfaces reduce setup, make boundary ownership explicit, and allow tests to verify behavior without coupling to internal module structure.
