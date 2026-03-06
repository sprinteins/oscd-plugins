Why we use the core `createElement`

This short note explains why contributors should prefer the core `createElement` helper when creating SCL elements instead of calling DOM APIs directly.

- **Single source:** `createElement` centralizes element creation (namespace + attributes) so changes to namespace handling, defaults, or attribute logic happen in one place.
- **Avoid `xmlns=""`:** Creating elements and then setting attributes in a second step can produce `xmlns=""` on appended nodes in some documents. Passing attributes to `createElement(doc, tag, attrs)` ensures the element is created in the document namespace and avoids emitting an empty `xmlns`.
- **Atomic attributes:** Supplying attributes at creation (e.g. `createElement(doc, 'LDevice', { inst: 'CBFunction' })`) avoids a separate `setAttribute` call that may interact poorly with namespace resolution.
- **Defaults & safety:** The core helper encapsulates any fallback namespace or safety checks so callers don't have to reimplement them.
- **Consistency & maintenance:** Using `createElement` makes behavior consistent across packages and simplifies future improvements or bug fixes.

Examples

Before (prone to `xmlns=""` when document has no namespace):

```ts
const el = doc.createElement('LDevice')
el.setAttribute('inst', 'CBFunction')
parent.appendChild(el)
```

Preferred (uses core helper):

```ts
const el = createElement(doc, 'LDevice', { inst: 'CBFunction' })
parent.appendChild(el)
```

See implementation: [packages/core/legacy/src/scd-xml/foundation.ts](packages/core/legacy/src/scd-xml/foundation.ts#L1-L40)
Example usage: [packages/plugins/type-distributor/src/headless/scl/elements/ldevice-element.ts](packages/plugins/type-distributor/src/headless/scl/elements/ldevice-element.ts#L101-L118)


---

In future we might want to expand to use a function that also makes sure it is valid according to the standard.