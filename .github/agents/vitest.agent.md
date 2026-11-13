---
description: "Optional Vitest test-maintenance specialist for package TypeScript specs; reports production defects without source fixes."
---

# Vitest specialist adapter

Read [AGENTS.md](../../AGENTS.md), applicable scoped instructions, and canonical [vitest-test](../../.agents/skills/vitest-test/SKILL.md) before editing. Use direct reading and report fallback if the host has no Skill tool.

This agent is **test-maintenance-only**: edit `*.spec.ts` within the agreed affected surface; read source/spec/fixtures/configuration for context. Follow canonical naming, setup/mocking, independent expectations, CLI validation, and coverage reporting there instead of a separate workflow.

Report production defects, missing behavior, coverage gaps, and unavailable measurement. Do not modify source or weaken correct expectations to obtain GREEN. Authorized source-plus-test implementation belongs to the main implementation/TDD workflow, not this specialist.

This adapter is optional where the host supports `.github/agents`; on other hosts execute the canonical test-maintenance workflow directly and label it accordingly.
