---
name: implement-spec
description: "Implement an agreed spec and its ticket dependency graph within explicitly authorized operations."
disable-model-invocation: true
---

# Implement a spec

Implement the entire agreed spec, working the **frontier** of unblocked tickets rather than treating tickets as a flat step list.

## Preflight before mutation

Read [AGENTS.md](../../../AGENTS.md), the spec and tickets, [tracker](../../../doc/agents/issue-tracker.md), [domain policy](../../../doc/agents/domain.md), and applicable scoped instructions. Record the target, relevant dirty baseline/exclusions, fixed review base, agreed seams/behavior, allowed file writes, and explicit authorization per Git/GitHub operation.

An implementation request does not authorize stage/commit/push, PR creation/update/ready, ticket closing, or branch/worktree/merge orchestration. Missing authorization means stay in the current worktree and leave edits uncommitted, with ticket results reported locally. Do not reset/rebase away dirty work or claim blocked operations succeeded.

Check actual Skill, subagent, background, and worktree capabilities before planning concurrency. If unavailable, forbidden, or disproportionate, execute tickets sequentially yourself, read canonical skills directly when invocation fails, and report the mode. Never simulate an independent multi-agent run. Confirm required TDD seams with the user before tests; existing explicit spec approval counts.

## Execute the graph

1. Read blocker relationships and select the ready frontier. Define each ticket's observable completion criterion from the agreed spec.
2. Explore only needed context. Research scratch stays in root `.tmp/`; requested durable reports use an explicit retained output location. Context pointers must remain accessible until consumers finish, not automatically saved outside the repo.
3. Default to the current worktree. If separately authorized and supported, use an integration branch and isolated implementer worktrees/branches rooted under repository `.tmp/`, each based on the integration tip. Never reset a mismatched or dirty worktree; stop and report it.
4. Implement one agreed public-API vertical slice at a time using [tdd](../tdd/SKILL.md). Optional implementers receive complete scoped pointers, authorizations, seams, and validation requirements. Run independent tickets concurrently only where file/branch side effects are isolated.
5. Validate each ticket with package-owned focused checks. Update the local frontier from **verified** completions. On the authorized branch/worktree path, integrate only explicitly authorized commits/merges and preserve unrelated work; otherwise keep verified changes uncommitted in the current worktree.
6. Once all tickets' agreed behavior is implemented, run [code-review](../code-review/SKILL.md) over committed changes since the fixed point **and** relevant staged/unstaged/new work. Report Standards and Spec separately, with honest sequential self-review fallback if needed. Fix only findings within the authorized implementation scope, then rerun affected checks.
7. Report complete, partial, blocked, and unmeasured requirements with exact evidence. Draft any requested PR body from the repository template locally; publication/readiness, authorized closing links, or ticket closure need operation-specific approval. Do not close tickets just because implementation completed.
8. Stop helpers started for this task and clean up only authorized agent worktrees/scratch after their contents are integrated or explicitly retained and handoffs consumed. Leave no unapproved commits or remote writes.
