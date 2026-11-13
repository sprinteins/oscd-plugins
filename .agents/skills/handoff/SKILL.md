---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff summarising the current conversation so a fresh agent can continue. Follow [AGENTS.md](../../../AGENTS.md) output policy: disposable handoffs live in repository-root `.tmp/handoffs/` and remain available until consumed. For a requested durable handoff, agree an explicit retained location under `doc/` or another user-authorized repository path. Report the exact path and retention condition; never write automatically outside the repository.

Include a "suggested skills" section with canonical paths and invocation/direct-read fallback. Record authorized operations, fixed review base, relevant dirty baseline/exclusions, decisions and unresolved gates, exact validation results, and next-session objective.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
