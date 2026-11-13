---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Read [AGENTS.md](../../../AGENTS.md) for authorization, capabilities, and output policy. Use a fresh background researcher only when useful, permitted, and supported while you do independent work; otherwise research directly and report the mode.

Its job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Disposable exploration notes go under root `.tmp/`, retained until consumers finish. A requested durable report needs an explicit retained repository location (propose `doc/references/`); confirm it before writing and report the exact path. Do not automatically write outside the root or create a parallel local tracker. Cite source dates and inaccessible checks honestly.
