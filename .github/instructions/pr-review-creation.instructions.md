---
name: PR Review and Creation
description: Use when preparing a pull request, reviewing changes, or writing a review handoff.
applyTo: '**/*.md,.github/pull_request_template.md'
---

<!-- @ref=oscd-plugins:pr-review-creation -->

# PR Review and Creation

- Use [.github/pull_request_template.md](../pull_request_template.md) when preparing a PR description.
- Preserve its Summary / Evidence & validation / Merge risk / Checklist / Linked issues sections, comments, ordering, and eight expectations. No rival skill template or prechecked N/A. Another developer means another human; AI validation must be labelled. Changelog/version work is only for requested release preparation.
- Summarize the behavior or architecture change, scope, entry points, focused validation commands, documentation status, and known risks.
- Include a reproducible manual verification path when user-visible plugin behavior changes.
- Review changed code for correctness, package boundaries, error handling, generated output, and meaningful test coverage. Skip lint-only style comments.
- Findings must identify the file and location, concern, consequence, evidence, severity, and required action.
- Follow [code-review](../../.agents/skills/code-review/SKILL.md): resolve a fixed base; include relevant committed, staged, unstaged, and new-file evidence; exclude unrelated dirty work; report Standards and Spec separately and label reviewer mode honestly.
- Report exact executed commands/results and not-run reasons, manual verification, before/after evidence when useful, blast radius/reversibility, and rollback. Missing validation is not passed.
- Separate related issues from explicitly authorized closing links. Apply [AGENTS.md](../../AGENTS.md) authorization before staging, committing, pushing, publishing/updating/readying a PR, closing tickets, or posting comments. No automatic mentions.
- Present proposed review comments before posting them. Do not post GitHub comments without explicit user instruction.
