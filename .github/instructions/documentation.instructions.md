---
name: Documentation
description: Use when changing documentation, architecture, ADRs, release knowledge, or project conventions.
applyTo: '**/*.md'
---

<!-- @ref=oscd-plugins:documentation -->

# Documentation Routing

- Repository-wide architecture, guidelines, references, and how-to content belongs under `doc/`.
- Plugin-specific documentation belongs under the relevant plugin package.
- Read [doc_guidelines.md](../../doc/guidelines/doc_guidelines.md) and [doc_styleguide.md](../../doc/guidelines/doc_styleguide.md) before substantial documentation changes.
- Write documentation in English and use the existing Diataxis-oriented structure.
- Update documentation in the same task when implementation changes introduce or invalidate project knowledge.
- Add or update an ADR when a change establishes or reverses an architectural or release decision.
- Do not document credentials, API keys, or other sensitive information.
- If no documentation update is needed, state the reason in the handoff.
