---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the user passes a ticket reference, fetch it from the issue tracker and state its title before starting. If the reference is ambiguous, ask.

Read [AGENTS.md](../../../AGENTS.md) preflight and the [configured tracker](../../../doc/agents/issue-tracker.md). Record authorized scope, dirty baseline, and fixed review base before edits.

Load [tdd](../tdd/SKILL.md) at user-confirmed seams; read canonical resources and report fallback when a Skill tool is unavailable.

Run the smallest package-owned tests/checks covering each change; expand only when focused evidence requires it. Report exact commands/results and affected coverage status.

Once done, use [code-review](../code-review/SKILL.md) on committed changes since the fixed point and relevant worktree/new files. Report both axes and reviewer mode.

Leave changes uncommitted unless the user explicitly authorized staging/committing. Push/publication/ticket writes require their own authorization; skill invocation grants none.
