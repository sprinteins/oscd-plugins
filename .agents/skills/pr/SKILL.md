---
name: pr
description: "Use when writing a PR body from the repository's canonical template."
metadata:
  credits:
    skill: show-me
    author: Dex Horthy
    organisation: Humanlayer
    url: "https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md"
---

# Write a PR body

Read [AGENTS.md](../../../AGENTS.md) and [PR instructions](../../../.github/instructions/pr-review-creation.instructions.md). Inspect the existing [repository template](../../../.github/pull_request_template.md) and any alternate template folder before drafting. Use the repository template's headings, comments, checklist items, and ordering; this skill supplies no rival layout.

Use relevant glossary vocabulary via the [domain policy](../../../doc/agents/domain.md). Keep prose brief and put evidence next to the claim it supports.

## Summary

Explain what/why and observable scope. Pick the smallest useful visual: pseudocode for logic, a call tree for control flow, component tree for UI, shallow file tree for responsibilities, Mermaid for interactions, or a diff-sketch for changed structure. Include useful commit links here when they aid review. Keep only relevant boundaries; omit visuals for simple changes.

## Evidence & validation

Record exact package-owned commands and actual results, before/after outputs or screenshots where useful, and reproducible manual steps. Identify human versus AI checks and independent reviewer versus sequential self-review mode. Include resolved review base and relevant committed/staged/unstaged/new work, exclusions, separate Standards/Spec findings, uncovered or unmeasured coverage, and not-run reasons. Do not invent execution evidence or equate AI review with another human developer's testing.

## Merge risk, checklist, and issues

Describe blast radius, failure modes, a reversible rollback path or one-way-door constraints. Retain all eight template expectations with honest unchecked N/A reasons; changelog/version is only for requested release preparation.

Separate related links from explicitly authorized closing links. Draft locally; stage/commit/push/PR publication or updates require operation-specific user authorization. No automatic mentions of people.
