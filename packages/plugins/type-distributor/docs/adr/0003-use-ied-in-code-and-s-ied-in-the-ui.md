# ADR 0003: Use `IED` in code and `S-IED` in the UI

## Status

Accepted

## Context

The SCL model uses the element name `IED`. In the plugin UI, the team wants to present the target device concept as `S-IED` so it is easier for users to distinguish it from other IED-related terms.

## Decision

Use `IED` in code, APIs, XML queries, and tests.

Use `S-IED` in user-facing labels, headings, and workflow documentation where the UX benefits from the distinction.

Keep the existing UI folder naming under `src/ui/components/columns/s-ied/` because it reflects the user-facing concept while the code inside still maps directly to the SCL model.

## Consequences

Code stays aligned with the XML model and avoids an extra translation layer.

UI text can stay user-friendly without forcing internal types and queries to diverge from SCL terminology.

Documentation needs to be deliberate about which audience it is addressing:

- use `IED` when talking about the data model and XML
- use `S-IED` when describing the user workflow and interface
