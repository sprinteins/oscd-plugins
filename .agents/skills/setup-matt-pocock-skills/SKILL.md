---
name: setup-matt-pocock-skills
description: "Configure this repository's engineering skills: issue tracker, triage vocabulary, domain layout, and host discovery."
disable-model-invocation: true
---

# Configure repository skills

This prompt-driven workflow explores the existing setup, presents findings, confirms changes, and then writes. It does not reinstall upstream skills.

## 1. Explore

Read [AGENTS.md](../../../AGENTS.md) safety/navigation and [local adaptation/discovery guidance](../../../doc/agents/skills.md). Inspect repository-local manifests, remotes, root/host instruction entry points, `.agents/skills/`, existing adapters, and `doc/agents/` configuration. A folder on disk is not host registration; use primary documentation and accessible read-only host mechanisms.

For domain layout, inspect the root glossary/map and existing root `doc/adr/` and package `doc/adr/` or `docs/adr/`. Do not relocate existing ADRs. Legacy CONTEXT names may be proposed for rename, never silently migrated.

## 2. Present and confirm

Lead with the existing repository choices, not upstream generic defaults:

- **Tracker**: GitHub Issues for sprinteins/oscd-plugins, defined by [issue-tracker.md](../../../doc/agents/issue-tracker.md). GitLab/local/freeform trackers remain alternatives only after explicit reconfiguration. Local durable tickets need an agreed retained repository directory, not another scratch tracker.
- **Triage**: if the `triage` skill is used, confirm the five role strings or collect explicit overrides from existing labels to avoid duplicates. If unused, skip label scaffolding. [triage-labels.md](../../../doc/agents/triage-labels.md) owns the selected mapping.
- **Domain**: [domain policy](../../../doc/agents/domain.md) owns multi-context lazy package glossaries and existing ADR locations. Follow `GLOSSARY-MAP.md` if present; otherwise read relevant existing package glossaries. A package is only a candidate context. Create the map alongside the first resolved glossary; create no empty map, glossary, or ADR.
- **Hosts**: canonical `.agents/skills/`, necessary thin host adapters only; no prompt files or duplicate authored TDD/Vitest workflows. State inaccessible runtime checks.

Show the proposed configuration and exact paths for approval. Do not mutate Git remotes/init, labels, issues, or publication just because a configuration option was selected. If the intended repository cannot be verified, stop that operation and report the missing authorization/access.

## 3. Write the approved configuration

Update `doc/agents/issue-tracker.md`, `domain.md`, and `triage-labels.md` in place as applicable, preserving useful user content. Update root AGENTS navigation instead of appending duplicate blocks. `.github/copilot-instructions.md` and `CLAUDE.md` remain thin shared-rule routers, not competing owners. The approved consolidation permits necessary adapters even when AGENTS already exists.

Seed references (inactive alternatives do not override current configuration):

- [issue-tracker-github.md](issue-tracker-github.md)
- [issue-tracker-gitlab.md](issue-tracker-gitlab.md)
- [issue-tracker-local.md](issue-tracker-local.md)
- [triage-labels.md](triage-labels.md)
- [domain.md](domain.md)

PRs as a triage request surface default **off** unless explicitly reconfigured. Create missing configured labels only under the shared preflight with explicit authorization. For other trackers, record the user-confirmed operation workflow instead of inventing it.

## 4. Verify and hand off

Check registration pointers, relative links, frontmatter, adapter targets, and unique canonical skill names. Run real read-only discovery mechanisms where available; use fresh-session/manual checks for other hosts, distinguishing registration from automatic invocation. Report exact changes, commands/results, blocked checks, and retained output paths. Configuration choices are reversible; no ADR is warranted solely for this setup.
