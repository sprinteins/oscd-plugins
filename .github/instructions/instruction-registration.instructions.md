---
name: Instruction Registration
description: Use when creating, renaming, or deleting instruction files under .github/instructions or changing agent guidance.
applyTo: '.github/instructions/**/*.md,AGENTS.md,.github/copilot-instructions.md'
---

<!-- @ref=oscd-plugins:instruction-registration -->

# Instruction Registration

Before adding guidance, search `.github/instructions/`, `AGENTS.md`, `.github/copilot-instructions.md`, and relevant skills for equivalent rules. Keep one authoritative location for each rule.

When an instruction file is created, renamed, or removed:

1. Add, update, or remove its exact link in the root `AGENTS.md` instruction hierarchy.
2. Add, update, or remove its exact link in `.github/copilot-instructions.md` when that file contains the applicable project routing.
3. Set frontmatter with only the supported keys: `name`, `description`, and `applyTo`.
4. Add an `@ref=<anchor>` marker when the instruction has a stable concept worth searching for.
5. Check links and scopes before handoff.

If a package-level `AGENTS.md` is added, register it in the root `AGENTS.md` and keep package-specific rules out of unrelated global instructions.
