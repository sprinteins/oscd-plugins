# Decision: Use `IED` in code, show `S-IED` in UI

- **Status:** Accepted
- **Date:** 2026-02-19
- **Authors:** Team decision (documented by dev)

## Context
In the SCL/XML model the element is always named `IED`. In the frontend user-facing UI we want people to think in terms of "S-IED" (specification IED) to avoid confusion with other IED concepts or naming conventions.

## Decision
Use the XML/DOM element and the internal code identifier `IED` throughout the codebase and APIs. In the user-facing frontend (labels, help text, and UX), present the concept as "S-IED" or "specification IED".

## Rationale
- Keeps a 1:1 mapping with the SCL/XML model (no translation layer in data model).
- Avoids introducing new internal variable names that diverge from the XML (reduces bugs and cognitive load for developers working with DOM).
- Lets the UI speak the user-friendly term `S-IED` while code and tests remain consistent with XML semantics.

## Consequences
- Code, tests, and utility functions will continue to use `IED` for document queries, element names, and types.
- UI strings, component labels, and documentation directed at end users should use `S-IED` where helpful to provide clarity.
- Developers should be aware of the distinction when writing docs or comments: reference the XML model (`IED`) when discussing data/model, and `S-IED` when discussing user-facing terminology.

## Alternatives Considered
- Rename code identifiers to `SIED` or `S-IED`: rejected because it diverges from XML and increases mapping overhead.
- Always use `IED` in UI: rejected because it may confuse end users unfamiliar with IEC terminology.

## Follow-ups
- Add a short note in contributor docs and style guides explaining the distinction (where to use `IED` vs `S-IED`).
- Ensure UI copy uses `S-IED` consistently and code comments mention the mapping where likely to confuse.

## Folder
- we keep the s-ied folder name in the UI components for clarity, even though the code inside uses `IED` identifiers. This is a pragmatic choice to avoid large refactors while still signaling the user-facing concept.