---
name: Terminal Command Safety
description: Use when running repository, package-manager, Git, or GitHub commands.
applyTo: '**'
---

<!-- @ref=oscd-plugins:terminal-command-safety -->

# Terminal Command Safety

- Run commands from the nearest owning package directory or use `pnpm --filter`; inspect its manifest before selecting a script.
- Prefer short, non-interactive commands. Use editor tools for multiline file changes instead of heredocs.
- Use `git --no-pager` for Git output that could invoke a pager.
- Follow the shared [safety and authorization rules](../../AGENTS.md) for Git/GitHub writes, destructive operations, secrets, scratch, retained outputs, and handoffs.
- For long-running watchers or servers, record the process started and stop only processes started for the task unless the user asks to leave them running.
