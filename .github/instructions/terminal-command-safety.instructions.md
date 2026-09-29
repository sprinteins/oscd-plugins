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
- Never use destructive commands such as `git reset --hard`, broad recursive deletion, or checkout-based reverts without explicit user approval.
- Do not expose or commit credentials, tokens, environment files, or other sensitive data.
- Keep temporary artifacts under `.tmp/` and remove named temporary files after validation.
- For long-running watchers or servers, record the process started and stop only processes started for the task unless the user asks to leave them running.
