---
name: Instruction Registration
description: Use when creating, renaming, or deleting instruction files under .github/instructions or changing agent guidance.
applyTo: '.github/instructions/**/*.md,AGENTS.md,.github/copilot-instructions.md'
---

<!-- @ref=oscd-plugins:instruction-registration -->

# Instruction Registration

Before adding guidance, search `.github/instructions/`, `AGENTS.md`, and canonical `.agents/skills/` for equivalent rules. Shared safety/authorization/navigation belongs in AGENTS; scoped rules in instructions; workflows in canonical skills. Host entry points are thin routers.

When an instruction file is created, renamed, or removed:

1. Add, update, or remove its exact link in the root `AGENTS.md` instruction hierarchy.
2. Keep `.github/copilot-instructions.md` and `CLAUDE.md` routing to the shared root; avoid duplicating its instruction hierarchy.
3. Set frontmatter with only the supported keys: `name`, `description`, and `applyTo`.
4. Add an `@ref=<anchor>` marker when the instruction has a stable concept worth searching for.
5. Check links and scopes before handoff.

If a package-level `AGENTS.md` is added, register it in the root `AGENTS.md` and keep package-specific rules out of unrelated global instructions.

Skill additions/relocations update every relevant pointer, supporting resource, and necessary host adapter. Check [discovery and upstream-update guidance](../../doc/agents/skills.md); confirm actual host registration separately from filesystem validity. Prompt files are unsupported in this repository; express workflows in skills instead.
