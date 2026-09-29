# Mocking in This Repository

Mock at boundaries only. Prefer real package code, in-memory DOM/XML documents, existing SCD fixtures, and configured test stores when they are practical.

## Mock These Boundaries

- Browser-only or OpenSCD host APIs unavailable in the test environment.
- Network, file-system, time, randomness, and other external services.
- Shared stores or modules only when a component test needs to isolate one public behavior.
- Expensive package boundaries when the real implementation would make the test slow or nondeterministic.

Do not mock:

- The module under test.
- Internal helpers or collaborators whose behavior is part of the package.
- DOM/XML operations that can run in the configured Vitest environment.
- Svelte components that can be rendered directly with `@testing-library/svelte`.

## Vitest Mocking

Use Vitest APIs and keep mocks typed and local to the boundary:

```ts
import { afterEach, vi } from 'vitest'

vi.mock('@/headless/stores', () => ({
	typeElementsStore: {
		typeElementsPerFamily: {
			bay: {},
			function: {},
		},
	},
}))

afterEach(() => {
	vi.restoreAllMocks()
})
```

Use `vi.spyOn` for a narrow existing-module boundary and `vi.fn` for an injected callback. Use `vi.hoisted` when a `vi.mock` factory must reference mutable test state. Avoid broad module mocks that hide the behavior under test.

## Designing for Mockability

Pass external dependencies into headless functions when the dependency is meaningful to the behavior:

```ts
type XmlParser = (source: string) => XMLDocument

export function loadDocument(source: string, parse: XmlParser): XMLDocument {
	return parse(source)
}
```

For Svelte components, prefer public props and events over mocking child components. For SCD/XML logic, prefer a real `Document` created from a fixture and assert the resulting elements and attributes. If a host editor or browser API must be isolated, wrap it behind the smallest typed interface and mock that boundary.

Good mocks have one purpose, one stable shape, and no conditional behavior based on arbitrary request details. If setup needs many branches, the production interface is probably too broad or the test is mocking the wrong layer.
