---
description: Describe when these instructions should be loaded
# applyTo: 'Describe when these instructions should be loaded' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---
# Copilot instructions — oscd-plugins

This repository contains OpenSCD plugins (TypeScript/Svelte) in a monorepo.

## “Where to look” references (use these as sources of truth)
- Code style / best practices: see docs under “Guides” (incl. Documentation Guidelines / Style Guide).
- Architecture & design rationale: see docs under “Explanations” (incl. architecture/design notes and ADRs).
- APIs & technical usage: see docs under “References”.
- Step-by-step tasks: see docs under “How-Tos”.

When generating or modifying code/docs, align with the relevant doc category above.

## Code generation rules
- Match existing patterns in `packages/` and prefer consistency over inventing new structure.
- TypeScript: keep strict typing; avoid `any` unless unavoidable.
- Svelte: keep components small; move heavy logic to TS helpers where possible.

## Docs changes
If behavior changes, update docs in the correct category:
How-To (task), Guide (best practice), Reference (API), Explanation (design/architecture).