---
name: Architecture and Package Boundaries
description: Use when changing package boundaries, dependency flow, plugin loading, shared UI, SCD behavior, or release architecture.
applyTo: 'packages/**,doc/**'
---

<!-- @ref=oscd-plugins:architecture-boundaries -->

# Architecture and Package Boundaries

- Keep plugins independent. A plugin failure must not require unrelated plugins to change or fail.
- Shared plugin API contracts belong in `packages/core/api/`; shared IEC 61850 definitions belong in `packages/core/standard/`.
- SCD manipulation and legacy business logic belong in `packages/core/legacy/`, not in individual UI components.
- Reusable Svelte components and themes belong in `packages/core/ui-svelte/`, `packages/ui/`, or `packages/uilib/` according to the existing package boundary.
- Avoid circular dependencies and do not import plugin implementation code into shared core packages.
- Keep headless logic independent from Svelte and browser-only APIs whenever the package structure provides a `headless/` area.
- Preserve the OpenSCD custom-element contract: plugins default-export an element class and do not self-register it.
- Read the relevant ADR and architecture reference before irreversible package, loading, or release changes.
- If a change introduces a new boundary or data flow, document it in `doc/` and add an ADR when the decision is durable.
