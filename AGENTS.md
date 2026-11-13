# AGENTS.md

<!-- @ref=oscd-plugins:agent-guidelines -->

Shared repository guidance for Copilot VS Code, Copilot CLI, and Claude Code.

## Safety, authorization, and precedence

- Work only on the requested task and directly related tests/documentation. Preserve unrelated dirty work and existing behavior unless the requested change intentionally changes it.
- Higher-priority system, organization, and host safety requirements remain in force. Within repository guidance, this file owns safety and authorization; scoped instructions own domain rules; skills orchestrate those rules, never override them. Apply standards during implementation **and** review.
- Before GitHub, release, or repository-management work, run `git remote -v` and confirm the intended target. Read the configured tracker before ticket operations.
- Stage, commit, push, or publish/update/ready a PR only with explicit user authorization for that operation. An implementation request, skill invocation, spec approval, or tool permission is not Git authorization. Leave changes uncommitted by default.
- Preflight mutating orchestration: establish authorized scope, target, dirty-work baseline, review base, required capabilities, and allowed writes **before** branches/worktrees, merges, ticket/label/comment writes, or publication. Missing approval/capability is a blocked operation, not a successful default. Draft locally or continue read-only; report the blocker.
- Avoid destructive resets, broad deletion, or checkout-based reverts without explicit approval. Preserve user files. Do not expose credentials, secrets, or private data to external services.
- Disposable scratch belongs only in repository-root `.tmp/`. Remove named scratch when no longer needed. Handoffs remain available until consumed. Requested durable outputs need an explicit retained location agreed with the user; default proposals are under `doc/`. No automatic outside-root notes or parallel local scratch tracker.
- Surface failures explicitly, using existing errors/notifications. Do not mask failures with broad catches or silent fallbacks.

## Navigation

This pnpm monorepo contains OpenSCD plugins under `packages/plugins/` and core packages under `packages/core/`. Use `pnpm-workspace.yaml` and local `package.json` files as the source of truth, not cached package lists.

Before editing a package, read its manifest, configuration, tests, and any local `AGENTS.md`. Register new package guidance here. Before a repository command, locate its owning manifest or Makefile and run from that project directory.

Load every applicable scoped instruction:

- Source changes: [coding conventions](.github/instructions/coding-conventions.instructions.md) + [testing and quality](.github/instructions/testing-quality.instructions.md).
- Refactoring, dependencies, shared UI, SCD, or loading: add [architecture boundaries](.github/instructions/architecture-boundaries.instructions.md).
- Documentation, ADRs, or process: [documentation routing](.github/instructions/documentation.instructions.md).
- Responses and handoffs: [communication](.github/instructions/communication.instructions.md).
- Commands: [terminal safety](.github/instructions/terminal-command-safety.instructions.md).
- Agent guidance changes: [instruction registration](.github/instructions/instruction-registration.instructions.md) + [writing-for-agents](.agents/skills/writing-for-agents/SKILL.md).
- PR preparation/review: [PR review and creation](.github/instructions/pr-review-creation.instructions.md).
- Package TypeScript specs: [Vitest routing](.github/instructions/vitest-test.instructions.md) + canonical [vitest-test](.agents/skills/vitest-test/SKILL.md).

Additional references:

- Imports and structure: [barrel pattern](doc/guidelines/barrel-pattern.md), [code style](doc/guidelines/code_style.md).
- Setup and dependency builds: [setup](doc/how-to/setup.md). Build needed shared dependencies before plugin work; install/restore only after manifest changes or a missing-dependency check failure.
- Architecture/release: relevant [ADRs](doc/adr/) and [architecture references](doc/references/architecture/). Read [release process](doc/adr/0003-release-process.md) before publication changes. Changelog/version updates require requested release preparation.

## Agent skills

Canonical skill definitions and resources live only in `.agents/skills/`. Host paths are thin adapters, not separately authored workflows. Read [host discovery and local adaptations](doc/agents/skills.md) when configuring or updating skills.

When a skill is relevant, use the host's supported invocation mechanism. If a Skill tool is absent or fails, read its canonical `SKILL.md` and required resources directly and explicitly report the fallback. User-invoked skills require the user's request, even when reading files directly. A file on disk is not proof of host registration.

Use subagents only when useful, permitted, and actually supported. Otherwise execute the same scoped workflow sequentially and label it self-review; never claim independent or parallel reviewers ran.

### Issue tracker

Track issues and specs in GitHub Issues for sprinteins/oscd-plugins. Before ticket operations, read [issue tracker](doc/agents/issue-tracker.md). Local tracker templates are inactive alternatives.

### Triage labels

Use the five configured roles. Before triaging, read [triage labels](doc/agents/triage-labels.md).

### Domain docs

Use the multi-context [domain policy](doc/agents/domain.md). Follow the root `GLOSSARY-MAP.md` if present; otherwise read relevant existing package glossaries. Create domain documents lazily and preserve existing root `doc/adr/` and package `doc/adr/` or `docs/adr/`.

## Completion and handoff

Validate the affected scope with existing package-owned commands; report exact commands/results, not assumed passes. Completion review covers committed changes since a resolved fixed point **and** relevant staged, unstaged, and new files, excluding unrelated dirty work. Report **Standards** and **Spec** separately using [code-review](.agents/skills/code-review/SKILL.md).

Summarize changed files, validation, documentation status, remaining risks, and blocked operations. Stop after the requested task. Offer relevant next steps without executing them: **Lint + Format**, **Run Tests**, **Run Checks**, **Manual Test**, **Review Code**, **Review Code + Fix**, **Document Architecture** (ADR only if warranted), **Release**, **Create Pull Request** (local draft first; publication requires permission).
