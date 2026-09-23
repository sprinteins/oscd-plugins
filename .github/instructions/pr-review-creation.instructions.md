---
name: PR Review and Creation
description: Use when preparing a pull request, reviewing changes, or writing a review handoff.
applyTo: '**/*.md,.github/pull_request_template.md'
---

<!-- @ref=oscd-plugins:pr-review-creation -->

# PR Review and Creation

- Use [.github/pull_request_template.md](../pull_request_template.md) when preparing a PR description.
- Summarize the behavior or architecture change, scope, entry points, focused validation commands, documentation status, and known risks.
- Include a reproducible manual verification path when user-visible plugin behavior changes.
- Review changed code for correctness, package boundaries, error handling, generated output, and meaningful test coverage. Skip lint-only style comments.
- Findings must identify the file and location, concern, consequence, evidence, severity, and required action.
- Present proposed review comments before posting them. Do not post GitHub comments without explicit user instruction.
