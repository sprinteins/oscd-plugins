# Repository skills: discovery and local adaptations

Reference for contributors and coding agents configuring this repository. Shared safety/authorization/navigation lives in [AGENTS.md](../../AGENTS.md); scoped rules live in [`.github/instructions/`](../../.github/instructions/); canonical skill definitions and resources live in [`.agents/skills/`](../../.agents/skills/). Configuration is reversible; this consolidation does not warrant an ADR.

## Supported hosts and adapters

Primary sources checked on 2026-11-09:

| Host | Supported discovery and repository wiring | Verification |
| --- | --- | --- |
| Copilot CLI | [Official CLI skills guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) supports `.agents/skills/`, `.github/skills/`, and `.claude/skills/`. Native canonical path; the Copilot adapter resolves to the same source. | Installed CLI `1.0.103`: `copilot skill --help` confirms paths. `copilot skill list --json` verifies 28 unique enabled project skills, including `ask-matt`, `setup-matt-pocock-skills`, `tdd`, and `vitest-test`. Registration is not execution. |
| Copilot VS Code | [Official skills guide](https://code.visualstudio.com/docs/agent-customization/agent-skills) identifies `.github/skills/` as the Copilot native project location and `.agents/skills/` as an additional Local-session location. The thin [`.github/skills`](../../.github/skills) directory symlink resolves to canonical `.agents/skills/`, with no copied definitions. | Installed VS Code `1.145.2`. Fresh-chat registration/selection and this adapter's traversal must still be checked in the intended harness; CLI registration is not proof of VS Code invocation. |
| Claude Code | [Official skills guide](https://code.claude.com/docs/en/skills#where-skills-live) supports project `.claude/skills/` and symlinked skill folders, deduplicating identical targets. Existing per-skill symlinks point to `.agents/skills/`; add the same thin link for new canonical skills. | Installed Claude `2.1.319`. Symlink validity can be checked locally; live `/` menu and actual invocation still need a new-session manual check. |

The [Claude memory guide](https://code.claude.com/docs/en/memory) now supports native AGENTS in some combinations of root/ancestor instruction files. Its documented `@` import mechanism makes [CLAUDE.md](../../CLAUDE.md) a minimal compatibility adapter, ensuring the same shared root is reached when another CLAUDE file would suppress native AGENTS discovery. No duplicated authored rules. Explicit requested outputs follow root retention policy.

The [Copilot router](../../.github/copilot-instructions.md) points to the same root. The [Vitest specialist](../../.github/agents/vitest.agent.md) is an optional Copilot adapter to canonical test-maintenance rules, not a production fixer. Claude/other unsupported agent hosts use direct canonical workflow reading instead; no speculative extra agent adapter.

The workspace's existing `.vscode/settings.json` is ignored and contains local settings. It remains unchanged; shared discovery must not depend on it. The directory symlink is the necessary repository-level Copilot adapter. Hosts/checkouts that do not traverse symlinks need a manual check; if necessary, use the documented `chat.agentSkillsLocations` compatibility setting locally for `.agents/skills`, without authoring duplicate workflows.

### Discovery is not invocation

1. Start a new host session at repository root after configuration changes. In VS Code, use the intended harness and Skills customization page or `/` menu; in Claude, inspect `/` and `/context all` memory files.
2. Verify canonical `tdd`, `vitest-test`, and user-invoked `ask-matt`/`setup-matt-pocock-skills` appear. Invoke a small explicitly requested task and inspect tool activity/resources. Test automatic selection separately only for model-invoked skills.
3. Stale sessions may still list deleted `.github/skills` definitions; restart before concluding discovery failed. User-invoked skills are not automatically callable by another workflow. If host Skill invocation is absent/fails, read the canonical file/resources directly only for an authorized invocation, and report the fallback.
4. Report inaccessible checks as unverified. Filesystem validity, CLI listing, and observed workflow invocation are distinct evidence. Do not launch external interactive AI sessions or install hosts solely to claim verification.

## Local adaptations and provenance

[skills-lock.json](../../skills-lock.json) retains upstream source/sourceType/skillPath/computedHash records. Version 1 does **not** pin a source revision or protect local patches; its computed hashes are installer provenance, not a verified hash of these adapted files. Preserve source information rather than pretending local edits are upstream.

Reviewed local adaptations:

- **TDD** combines the installed `mattpocock/skills` workflow with the prior repository `.github/skills/tdd` workflow: confirmed seams/catches/misses, independent expectations, domain/design vocabulary, public-API vertical slices, minimal implementation, and small post-green refactoring. Repository layer/interface/refactoring guidance is retained in canonical resources; deep-module terminology is owned by `codebase-design`.
- **Vitest** originates from the repository `.github/skills/vitest-test/SKILL.md`. It owns conventions, fixture/mock setup, configured environment, CLI validation, and ≥90% branch target for agreed affected scope. Prior repository TDD tests/mocking resources are retained there. The optional specialist is test-maintenance-only.
- **Review / implementation / PR / retro** retain upstream intent with repository authorization preflight, relevant committed/worktree/new-file scope, separate Standards/Spec axes, and labelled sequential fallback. Unique evidence/architectural critique from retired prompts is in [review guidance](../../.agents/skills/code-review/review-guidance.md). PR writing consumes the repository template, not an upstream competing layout.
- **Setup / domain / handoff / research / specs / tickets / prototypes / wayfinder / wizard / architecture reports / ask-matt routing** route to shared repository policy for lazy domain docs, active GitHub tracker, explicit retained outputs, root `.tmp/` scratch, consumed handoffs, and no automatic Git publication. Local/GitLab tracker seeds remain inactive alternatives.

There is one authored canonical definition per skill name. `.github/skills` authored duplicates are replaced by the directory adapter, and unsupported `.github/prompts` files are removed. At implementation time, local `main` (`155e195f`) still had both prompts while `origin/main` (`92b03ea3`, “remove obsolete prompt files”) had none; this was verified from local refs without fetching.

## Reviewed upstream updates

Do not blindly reinstall/overwrite adapted skills or treat the lock as patch protection.

1. Obtain approval for the update scope and any external retrieval. Record the exact upstream source revision being compared; retain existing lock source information.
2. Read upstream changes into named root `.tmp/` scratch without overwriting canonical files. Compare each relevant skill **and its support resources** against these documented local adaptations.
3. Apply the smallest reviewed changes manually, preserving shared authorization, test coverage semantics, adapters, and useful upstream behavior. Update this adaptation reference when decisions change; no heavyweight patch manager is required.
4. Validate frontmatter, links, unique canonical names, adapter targets, targeted formatting/config checks, and actual available-host registration. Manually verify fresh-session invocation where tooling cannot. Remove consumed scratch and hand off uncommitted changes unless Git operations were explicitly authorized.
