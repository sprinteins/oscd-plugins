# Test Design in This Repository

## Test Layers

Choose the lowest layer that can prove the behavior:

- Pure headless logic: test the exported function or store with Vitest.
- Svelte component behavior: render with `@testing-library/svelte` and assert visible DOM state or user interaction.
- SCD/XML behavior: use `DOMParser`, existing fixtures, and the public query/action interface; assert semantic elements and attributes.
- Browser-specific legacy behavior: use the package's configured Vitest browser mode.

Read the owning package's `package.json` and test configuration before choosing helpers, environment, or commands.

## Test Shape

Use `describe`, `it`, `expect`, and `it.each` from `vitest`. Name tests with GIVEN / WHEN / THEN:

```ts
describe('GIVEN a type collection', () => {
	it.each([
		{ existingNames: [], expected: 1 },
		{ existingNames: ['Bay_copy_1'], expected: 2 },
	])(
		'WHEN the next occurrence is requested THEN $expected is returned',
		({ existingNames, expected }) => {
			setElements(existingNames)

			expect(getTypeNextOccurrence()).toBe(expected)
		},
	)
})
```

Use a flat `it('GIVEN ... WHEN ... THEN ...')` when there is only one case. Group cases under `describe('GIVEN ...')` or `describe('WHEN ...')` when setup is shared. Put repeated setup in `beforeEach`; keep each case's varying inputs and expected result in the case table.

## Component Tests

Render the component through its public props and interact through accessible controls:

```ts
import { render, screen } from '@testing-library/svelte'
import { expect, it } from 'vitest'

it('GIVEN an unselected connection WHEN the component renders THEN the selected style is absent', () => {
	render(Message, { edge: connection, isSelected: false, testid: 'connection' })

	expect(screen.getByTestId('connection')).not.toHaveClass('selected')
})
```

Assert what users can observe: text, roles, labels, enabled state, classes that represent visible state, and emitted/public behavior. Avoid asserting Svelte internals or implementation-only helper calls.

## SCD and XML Tests

Use existing SCD fixtures and mocks where possible. Parse XML with the repository's existing DOM utilities or `DOMParser`. Assert the semantic result:

```ts
it('GIVEN a document without a Bay WHEN the action runs THEN the Bay is added with its name', () => {
	const document = new DOMParser().parseFromString(sourceXml, 'text/xml')

	addBay(document, { name: 'Q01' })

	const bay = document.querySelector('Bay[name="Q01"]')
	expect(bay).not.toBeNull()
})
```

Prefer assertions on element presence, absence, attributes, and relationships. Avoid comparing an entire serialized XML string because formatting, ordering, namespaces, and generated identifiers can change without changing behavior. Use namespace-aware helpers when the package provides them.

## Good and Bad Tests

Good tests:

- exercise public functions, stores, components, or actions;
- use realistic fixtures and the package's existing setup;
- cover happy paths, edge cases, and error behavior;
- keep mocks at external boundaries only;
- remain valid after internal refactoring.

Bad tests:

- test private helpers solely because they exist;
- assert internal call counts or collaborator order;
- duplicate large fixture setup in every test;
- compare complete serialized XML for a structural change;
- use a broad mock where a real in-memory DOM or fixture is practical.

## Completion

- The tracer-bullet test fails for the intended reason before implementation.
- Each added behavior reaches GREEN before the next behavior is added.
- Shared setup is extracted without hiding case-specific intent.
- Important success, boundary, and error branches are covered.
- The focused package test command passes, and coverage is checked when the package provides a coverage script.
